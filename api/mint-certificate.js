const {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  SystemProgram,
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
  TYPE_SIZE,
  LENGTH_SIZE,
} = require("@solana/spl-token");

const {
  createInitializeInstruction: createMetadataInitInstruction,
  createUpdateFieldInstruction,
  pack: packMetadata,
} = require("@solana/spl-token-metadata");

const DEVNET_RPC = "https://api.devnet.solana.com";

module.exports = async function handler(req, res) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { walletAddress, tier } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress is required" });
    }

    // ── Load mint authority keypair from env ──────────────────────────────────
    if (!process.env.MINT_AUTHORITY_SECRET_KEY) {
      console.error("MINT_AUTHORITY_SECRET_KEY env var not set");
      return res.status(500).json({ error: "Server not configured" });
    }

    let mintAuthoritySecret;
    try {
      mintAuthoritySecret = JSON.parse(process.env.MINT_AUTHORITY_SECRET_KEY);
    } catch {
      return res.status(500).json({ error: "Invalid server key format" });
    }

    const mintAuthority = Keypair.fromSecretKey(Uint8Array.from(mintAuthoritySecret));
    const connection = new Connection(DEVNET_RPC, "confirmed");
    const userPublicKey = new PublicKey(walletAddress);

    // Each certificate gets its own unique mint (1-of-1 per claim)
    const mintKeypair = Keypair.generate();

    const certTier = tier || "Explorer";
    const host = req.headers.host || "solana-scholar.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const metadataUri = `${protocol}://${host}/og-cert-metadata.json`;

    // ── Build on-chain metadata (TokenMetadata extension) ────────────────────
    const metadataObject = {
      updateAuthority: mintAuthority.publicKey,
      mint: mintKeypair.publicKey,
      name: "OG User Certificate",
      symbol: "OGCERT",
      uri: metadataUri,
      additionalMetadata: [
        ["tier", certTier],
        ["platform", "Solana Scholar"],
        ["non_transferable", "true"],
        ["issued_at", new Date().toISOString()],
        ["wallet", walletAddress.slice(0, 8) + "..."],
      ],
    };

    const metadataBuffer = packMetadata(metadataObject);

    // ── Compute mint account size ─────────────────────────────────────────────
    // Extensions: NonTransferable + MetadataPointer (TokenMetadata lives inside mint)
    const extensions = [ExtensionType.NonTransferable, ExtensionType.MetadataPointer];
    const mintLen = getMintLen(extensions);
    const totalAccountLen = mintLen + TYPE_SIZE + LENGTH_SIZE + metadataBuffer.length;

    const lamports = await connection.getMinimumBalanceForRentExemption(totalAccountLen);

    // ── Get user's ATA for this mint ──────────────────────────────────────────
    const userATA = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      userPublicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    // ── Build transaction ─────────────────────────────────────────────────────
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

    const tx = new Transaction({ recentBlockhash: blockhash, feePayer: userPublicKey });

    // 1. Create the mint account (user pays rent)
    tx.add(
      SystemProgram.createAccount({
        fromPubkey: userPublicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: totalAccountLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      })
    );

    // 2. Init NonTransferable extension (must precede InitializeMint)
    tx.add(
      createInitializeNonTransferableMintInstruction(
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 3. Init MetadataPointer extension pointing to the mint itself (on-chain metadata)
    tx.add(
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        mintAuthority.publicKey,
        mintKeypair.publicKey, // metadata address = mint itself
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 4. Init Mint — 0 decimals (NFT-like, 1 token = 1 certificate)
    tx.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        0,
        mintAuthority.publicKey,
        null, // no freeze authority
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 5. Init TokenMetadata (on-chain name/symbol/uri stored in the mint account)
    tx.add(
      createMetadataInitInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mintKeypair.publicKey,
        updateAuthority: mintAuthority.publicKey,
        mint: mintKeypair.publicKey,
        mintAuthority: mintAuthority.publicKey,
        name: metadataObject.name,
        symbol: metadataObject.symbol,
        uri: metadataObject.uri,
      })
    );

    // 6. Write additional metadata fields (tier, platform, etc.)
    for (const [field, value] of metadataObject.additionalMetadata) {
      tx.add(
        createUpdateFieldInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: mintKeypair.publicKey,
          updateAuthority: mintAuthority.publicKey,
          field,
          value,
        })
      );
    }

    // 7. Create user's Associated Token Account
    tx.add(
      createAssociatedTokenAccountInstruction(
        userPublicKey,
        userATA,
        userPublicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 8. Mint exactly 1 token to user
    tx.add(
      createMintToInstruction(
        mintKeypair.publicKey,
        userATA,
        mintAuthority.publicKey,
        1,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    // ── Server signs with mintKeypair + mintAuthority ─────────────────────────
    // User still needs to sign as feePayer
    tx.partialSign(mintKeypair, mintAuthority);

    const serialized = tx.serialize({ requireAllSignatures: false });

    return res.status(200).json({
      transaction: Buffer.from(serialized).toString("base64"),
      mintAddress: mintKeypair.publicKey.toString(),
      blockhash,
      lastValidBlockHeight,
    });
  } catch (err) {
    console.error("[mint-certificate]", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
