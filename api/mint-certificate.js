const {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  SystemProgram,
  TransactionInstruction,
} = require("@solana/web3.js");

const {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializeNonTransferableMintInstruction,
  createInitializeMetadataPointerInstruction,
  getMintLen,
  ExtensionType,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createEnableRequiredMemoTransfersInstruction,
} = require("@solana/spl-token");

const {
  createInitializeInstruction: createTokenMetadataInstruction,
  createUpdateFieldInstruction,
  pack,
} = require("@solana/spl-token-metadata");

const DEVNET_RPC    = "https://api.devnet.solana.com";
const MEMO_PROGRAM  = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

// TLV header sizes used when calculating TokenMetadata body space
const TYPE_SIZE   = 2;
const LENGTH_SIZE = 4;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { walletAddress, tier } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "walletAddress is required" });

    if (!process.env.MINT_AUTHORITY_SECRET_KEY) {
      return res.status(500).json({ error: "Server not configured" });
    }

    const secretKeyArray = JSON.parse(process.env.MINT_AUTHORITY_SECRET_KEY);
    const mintAuthority  = Keypair.fromSeed(Uint8Array.from(secretKeyArray.slice(0, 32)));

    const connection    = new Connection(DEVNET_RPC, "confirmed");
    const userPublicKey = new PublicKey(walletAddress);
    const mintKeypair   = Keypair.generate();
    const certTier      = tier || "Explorer";

    // ── On-chain metadata (Metadata Extension) ───────────────────────────────────
    // The metadata account IS the mint itself (MetadataPointer points to mint).
    const metadata = {
      mint:               mintKeypair.publicKey,
      name:               "OG User Certificate",
      symbol:             "OGCERT",
      uri:                "https://solana-scholar.vercel.app/og-cert-metadata.json",
      additionalMetadata: [["tier", certTier]],
    };

    // ── Account sizing ────────────────────────────────────────────────────────────
    // IMPORTANT: Do NOT pass ExtensionType.TokenMetadata into getMintLen — it is a
    // variable-length extension and getMintLen cannot know its size. Instead, add the
    // packed metadata body manually (TYPE_SIZE + LENGTH_SIZE + pack().length).
    // Passing TokenMetadata into getMintLen writes zero-byte padding that
    // initializeMint misreads as corrupt extension data (Instruction 3 error).
    const mintExtensions = [ExtensionType.NonTransferable, ExtensionType.MetadataPointer];
    const mintSpace = getMintLen(mintExtensions) + TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const lamports  = await connection.getMinimumBalanceForRentExemption(mintSpace);

    // ── ATA ───────────────────────────────────────────────────────────────────────
    const userATA = getAssociatedTokenAddressSync(
      mintKeypair.publicKey, userPublicKey, false, TOKEN_2022_PROGRAM_ID
    );

    // ── Memo text ─────────────────────────────────────────────────────────────────
    // Shown in the wallet signing UI when the user claims their certificate.
    const memoText = "This is a test certificate for OG users of Solana Scholar.";

    // ── Build transaction ─────────────────────────────────────────────────────────
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction({ recentBlockhash: blockhash, feePayer: userPublicKey });

    // 1. Create the Token-2022 mint account sized for all extensions
    tx.add(SystemProgram.createAccount({
      fromPubkey:       userPublicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space:            mintSpace,
      lamports,
      programId:        TOKEN_2022_PROGRAM_ID,
    }));

    // 2. NonTransferable extension — must precede InitializeMint
    tx.add(createInitializeNonTransferableMintInstruction(
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ));

    // 3. MetadataPointer extension — must precede InitializeMint;
    //    points to the mint itself as the metadata storage account
    tx.add(createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,    // mint
      mintAuthority.publicKey,  // pointer update authority
      mintKeypair.publicKey,    // metadata account = the mint itself
      TOKEN_2022_PROGRAM_ID
    ));

    // 4. Initialize the mint (0 decimals, no freeze authority)
    tx.add(createInitializeMintInstruction(
      mintKeypair.publicKey, 0, mintAuthority.publicKey, null, TOKEN_2022_PROGRAM_ID
    ));

    // 5. Initialize TokenMetadata on-chain — must come AFTER InitializeMint
    tx.add(createTokenMetadataInstruction({
      programId:       TOKEN_2022_PROGRAM_ID,
      metadata:        mintKeypair.publicKey,
      updateAuthority: mintAuthority.publicKey,
      mint:            mintKeypair.publicKey,
      mintAuthority:   mintAuthority.publicKey,
      name:            metadata.name,
      symbol:          metadata.symbol,
      uri:             metadata.uri,
    }));

    // 6. Write the tier field into additionalMetadata
    tx.add(createUpdateFieldInstruction({
      programId:       TOKEN_2022_PROGRAM_ID,
      metadata:        mintKeypair.publicKey,
      updateAuthority: mintAuthority.publicKey,
      field:           "tier",
      value:           certTier,
    }));

    // 7. Create user's ATA — Token-2022 ATAs automatically include ImmutableOwner
    tx.add(createAssociatedTokenAccountInstruction(
      userPublicKey, userATA, userPublicKey,
      mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID
    ));

    // 8. Enable MemoTransfer on the ATA (Memo Required extension)
    //    Requires owner (user) to sign — user is already signing as feePayer.
    tx.add(createEnableRequiredMemoTransfersInstruction(
      userATA, userPublicKey, [], TOKEN_2022_PROGRAM_ID
    ));

    // 9. Memo instruction — placed before MintTo so wallets display it
    //    prominently in the signing UI, and satisfies MemoTransfer on future transfers.
    tx.add(new TransactionInstruction({
      keys:      [{ pubkey: userPublicKey, isSigner: true, isWritable: false }],
      programId: MEMO_PROGRAM,
      data:      Buffer.from(memoText, "utf8"),
    }));

    // 10. Mint exactly 1 certificate token to the user's ATA
    tx.add(createMintToInstruction(
      mintKeypair.publicKey, userATA, mintAuthority.publicKey, 1, [], TOKEN_2022_PROGRAM_ID
    ));

    // ── Server partial signs (mint keypair + mint authority) ──────────────────────
    tx.partialSign(mintKeypair, mintAuthority);

    const serialized = tx.serialize({ requireAllSignatures: false });

    return res.status(200).json({
      transaction:        Buffer.from(serialized).toString("base64"),
      mintAddress:        mintKeypair.publicKey.toString(),
      blockhash,
      lastValidBlockHeight,
    });
  } catch (err) {
    console.error("[mint-certificate]", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
