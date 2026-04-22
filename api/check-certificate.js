const {
  Connection,
  PublicKey,
  Keypair,
} = require("@solana/web3.js");

const {
  TOKEN_2022_PROGRAM_ID,
  getMint,
} = require("@solana/spl-token");

const DEVNET_RPC = "https://api.devnet.solana.com";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { walletAddress } = req.query;
  if (!walletAddress) return res.status(400).json({ error: "walletAddress is required" });

  if (!process.env.MINT_AUTHORITY_SECRET_KEY) {
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    const secretKeyArray = JSON.parse(process.env.MINT_AUTHORITY_SECRET_KEY);
    const mintAuthority = Keypair.fromSeed(Uint8Array.from(secretKeyArray.slice(0, 32)));
    const mintAuthorityPubkey = mintAuthority.publicKey.toString();

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const userPublicKey = new PublicKey(walletAddress);

    // Fetch all Token-2022 accounts owned by this wallet
    const { value: accounts } = await connection.getTokenAccountsByOwner(userPublicKey, {
      programId: TOKEN_2022_PROGRAM_ID,
    });

    // Token account layout: mint (0-31), owner (32-63), amount u64 LE (64-71)
    for (const { account } of accounts) {
      const data = account.data;
      if (data.length < 72) continue;

      const amount = data.readBigUInt64LE(64);
      if (amount === 0n) continue;

      const mintPubkey = new PublicKey(data.slice(0, 32));

      try {
        const mint = await getMint(connection, mintPubkey, "confirmed", TOKEN_2022_PROGRAM_ID);
        if (mint.mintAuthority?.toString() === mintAuthorityPubkey) {
          return res.status(200).json({
            hasCertificate: true,
            mintAddress: mintPubkey.toString(),
          });
        }
      } catch {
        // Mint fetch failed (account may be closed); skip
      }
    }

    return res.status(200).json({ hasCertificate: false, mintAddress: null });
  } catch (err) {
    console.error("[check-certificate]", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
