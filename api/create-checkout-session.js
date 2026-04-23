// api/create-checkout-session.js
// Creates a Stripe Checkout Session and returns the hosted URL.
// Requires STRIPE_SECRET_KEY to be set in Vercel environment variables.

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  const { plan } = req.body || {};

  const PLANS = {
    monthly: { amount: 2500,  name: "Solana Scholar — Monthly Access" },
    yearly:  { amount: 24000, name: "Solana Scholar — Yearly Access"  },
  };

  const selected = PLANS[plan];
  if (!selected) return res.status(400).json({ error: "Invalid plan" });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(503).json({ error: "Card payments are not yet configured." });
  }

  const proto  = req.headers["x-forwarded-proto"] || "https";
  const host   = req.headers["x-forwarded-host"]  || req.headers.host;
  const origin = `${proto}://${host}`;

  // Build form-encoded body for Stripe REST API (no npm dependency needed)
  const params = new URLSearchParams();
  params.append("payment_method_types[0]",                          "card");
  params.append("line_items[0][price_data][currency]",              "usd");
  params.append("line_items[0][price_data][product_data][name]",    selected.name);
  params.append("line_items[0][price_data][product_data][description]",
                "Full access to all Solana Scholar courses and on-chain certificate minting.");
  params.append("line_items[0][price_data][unit_amount]",           String(selected.amount));
  params.append("line_items[0][quantity]",                          "1");
  params.append("mode",                                             "payment");
  params.append("success_url",                                      `${origin}/?payment=success&plan=${plan}`);
  params.append("cancel_url",                                       `${origin}/?payment=cancelled`);
  params.append("metadata[plan]",                                   plan);
  params.append("metadata[source]",                                 "solana-scholar");
  params.append("allow_promotion_codes",                            "true");

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization:  `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error("[Stripe] Error:", session.error);
      return res.status(500).json({ error: session.error?.message || "Stripe error" });
    }

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[Stripe] Fetch failed:", err);
    return res.status(500).json({ error: "Could not reach Stripe. Please try again." });
  }
};
