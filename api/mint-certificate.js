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
  createReallocateInstruction,
} = require("@solana/spl-token");

const {
  createInitializeInstruction: createTokenMetadataInstruction,
  createUpdateFieldInstruction,
  pack,
} = require("@solana/spl-token-metadata");

const DEVNET_RPC   = "https://api.devnet.solana.com";
const MEMO_PROGRAM = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

// TLV sizes for the TokenMetadata extension body
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

    // ── Metadata (Metadata Extension) ────────────────────────────────────────────
    // updateAuthority included so pack() gives the correct on-chain byte size.
    const metadata = {
      updateAuthority:    mintAuthority.publicKey,
      mint:               mintKeypair.publicKey,
      name:               "OG Solana Scholar",
      symbol:             "OGCERT",
      uri:                "https://solana-scholar.vercel.app/og-cert-metadata.json",
      additionalMetadata: [["tier", certTier]],
    };

    // ── Account sizing — KEY FIX ──────────────────────────────────────────────────
    //
    // WRONG (causes Instruction 3 error):
    //   getMintLen([..., ExtensionType.TokenMetadata]) + pack().length
    //   → pre-allocates metadata bytes as zeros → initializeMint walks the TLV
    //     list, finds type=0 (Uninitialized) in the zero-padded region → InvalidAccountData
    //
    // CORRECT (this implementation):
    //   • createAccount uses mintSpace = getMintLen([NonTransferable, MetadataPointer])
    //     → no zero-padded metadata bytes → initializeMint succeeds
    //   • totalLamports covers the final post-realloc size upfront
    //   • initializeTokenMetadata and updateField call realloc() internally;
    //     they only need the lamports to already be in the account
    //
    const mintExtensions = [ExtensionType.NonTransferable, ExtensionType.MetadataPointer];
    const mintSpace      = getMintLen(mintExtensions);
    const metadataSpace  = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const totalLamports  = await connection.getMinimumBalanceForRentExemption(mintSpace + metadataSpace);

    // ── ATA ───────────────────────────────────────────────────────────────────────
    const userATA = getAssociatedTokenAddressSync(
      mintKeypair.publicKey, userPublicKey, false, TOKEN_2022_PROGRAM_ID
    );

    // ── Memo text — shown in wallet signing UI ────────────────────────────────────
    const memoText = "This is a test certificate for OG users of Solana Scholar.";

    // ── Build transaction ─────────────────────────────────────────────────────────
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction({ recentBlockhash: blockhash, feePayer: userPublicKey });

    // 1. Create mint account — mintSpace bytes only, totalLamports pre-funded
    tx.add(SystemProgram.createAccount({
      fromPubkey:       userPublicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space:            mintSpace,      // ← NO metadata bytes pre-allocated
      lamports:         totalLamports,  // ← funds both base + future realloc
      programId:        TOKEN_2022_PROGRAM_ID,
    }));

    // 2. NonTransferable — must precede InitializeMint
    tx.add(createInitializeNonTransferableMintInstruction(
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ));

    // 3. MetadataPointer — must precede InitializeMint; mint is its own metadata account
    tx.add(createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      mintAuthority.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ));

    // 4. InitializeMint — succeeds now because there are no uninitialized TLV bytes
    tx.add(createInitializeMintInstruction(
      mintKeypair.publicKey, 0, mintAuthority.publicKey, null, TOKEN_2022_PROGRAM_ID
    ));

    // 5. Initialize TokenMetadata — Token-2022 reallocates account to fit name/symbol/uri
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

    // 6. Write tier field — Token-2022 reallocates again to fit additionalMetadata entry
    tx.add(createUpdateFieldInstruction({
      programId:       TOKEN_2022_PROGRAM_ID,
      metadata:        mintKeypair.publicKey,
      updateAuthority: mintAuthority.publicKey,
      field:           "tier",
      value:           certTier,
    }));

    // 7. Create ATA — Token-2022 ATAs automatically include ImmutableOwner
    tx.add(createAssociatedTokenAccountInstruction(
      userPublicKey, userATA, userPublicKey,
      mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID
    ));

    // 8. Reallocate ATA to add space for the MemoTransfer extension.
    //    ATAs are created at a fixed size; MemoTransfer needs its own TLV slot.
    //    Reallocate transfers the extra rent-exempt lamports from payer → account.
    tx.add(createReallocateInstruction(
      userATA,                          // token account to grow
      userPublicKey,                    // payer for the extra rent
      [ExtensionType.MemoTransfer],     // extensions to add
      userPublicKey,                    // owner
      [],
      TOKEN_2022_PROGRAM_ID
    ));

    // 9. Enable MemoTransfer on the ATA (now that the slot exists)
    tx.add(createEnableRequiredMemoTransfersInstruction(
      userATA, userPublicKey, [], TOKEN_2022_PROGRAM_ID
    ));

    // 10. Memo instruction — before MintTo so wallets display it in the signing preview
    tx.add(new TransactionInstruction({
      keys:      [{ pubkey: userPublicKey, isSigner: true, isWritable: false }],
      programId: MEMO_PROGRAM,
      data:      Buffer.from(memoText, "utf8"),
    }));

    // 11. Mint exactly 1 certificate token to the user's ATA
    tx.add(createMintToInstruction(
      mintKeypair.publicKey, userATA, mintAuthority.publicKey, 1, [], TOKEN_2022_PROGRAM_ID
    ));

    // ── Server partial signs ──────────────────────────────────────────────────────
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
