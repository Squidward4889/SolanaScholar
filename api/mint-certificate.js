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
  getMintLen,
  ExtensionType,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} = require("@solana/spl-token");

const DEVNET_RPC = "https://api.devnet.solana.com";
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { walletAddress, tier } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "walletAddress is required" });

    // ── Mint authority from env ───────────────────────────────────────────────
    if (!process.env.MINT_AUTHORITY_SECRET_KEY) {
      return res.status(500).json({ error: "Server not configured" });
    }

    const secretKeyArray = JSON.parse(process.env.MINT_AUTHORITY_SECRET_KEY);
    // fromSeed derives a valid Ed25519 keypair from 32 bytes
    const mintAuthority = Keypair.fromSeed(Uint8Array.from(secretKeyArray.slice(0, 32)));

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const userPublicKey = new PublicKey(walletAddress);
    const mintKeypair   = Keypair.generate();  // unique mint per certificate

    const certTier = tier || "Explorer";

    // ── Account sizing ────────────────────────────────────────────────────────
    // NonTransferable is a zero-data extension — only the type+length header (4 bytes)
    const extensions = [ExtensionType.NonTransferable];
    const mintSpace  = getMintLen(extensions);
    const lamports   = await connection.getMinimumBalanceForRentExemption(mintSpace);

    // ── ATA for user ──────────────────────────────────────────────────────────
    const userATA = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      userPublicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    // ── On-chain memo — permanent issuance record ─────────────────────────────
    const memoText = JSON.stringify({
      program: "SolanaScholar",
      version: "v1",
      type: "OGCertificate",
      tier: certTier,
      mint: mintKeypair.publicKey.toString(),
      recipient: walletAddress,
      issuedAt: new Date().toISOString(),
      note: "This is a test certificate for OG users of Solana Scholar.",
    });

    // ── Build transaction ─────────────────────────────────────────────────────
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction({ recentBlockhash: blockhash, feePayer: userPublicKey });

    // 1. Create the Token-2022 mint account (user pays rent)
    tx.add(SystemProgram.createAccount({
      fromPubkey:    userPublicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space:         mintSpace,
      lamports,
      programId:     TOKEN_2022_PROGRAM_ID,
    }));

    // 2. Initialize NonTransferable extension (must precede InitializeMint)
    tx.add(createInitializeNonTransferableMintInstruction(
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ));

    // 3. Initialize the mint — 0 decimals, server is mint authority
    tx.add(createInitializeMintInstruction(
      mintKeypair.publicKey,
      0,
      mintAuthority.publicKey,
      null,               // no freeze authority
      TOKEN_2022_PROGRAM_ID
    ));

    // 4. Create user's Associated Token Account
    tx.add(createAssociatedTokenAccountInstruction(
      userPublicKey,
      userATA,
      userPublicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ));

    // 5. Mint exactly 1 certificate token to user
    tx.add(createMintToInstruction(
      mintKeypair.publicKey,
      userATA,
      mintAuthority.publicKey,
      1,
      [],
      TOKEN_2022_PROGRAM_ID
    ));

    // 6. Write issuance memo on-chain (permanent audit trail)
    tx.add(new TransactionInstruction({
      keys: [{ pubkey: userPublicKey, isSigner: true, isWritable: false }],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memoText, "utf8"),
    }));

    // ── Server signs (mint account + mint authority) ───────────────────────────
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
