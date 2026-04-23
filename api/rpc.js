// api/rpc.js
// Server-side proxy for Solana JSON-RPC requests.
// Bypasses browser-level 403 blocks on public RPC endpoints.
// Set SOLANA_RPC_URL in Vercel env vars to use a premium RPC (e.g. Helius).

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).end();

  const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

  try {
    const response = await fetch(rpcUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("[RPC Proxy] Error:", err);
    return res.status(502).json({ error: "RPC request failed", message: err.message });
  }
};
