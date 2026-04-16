# Solana Scholar

A live Solana dApp — structured Web3 education platform with dynamic on-chain certificates, multi-wallet support, and real Solana transactions.

## Features

- **Multi-wallet support** — Phantom, Solflare, Backpack, Coinbase Wallet (auto-detected)
- **On-chain certificate claiming** — real Solana transactions via the Memo program
- **SOL balance display** — live balance pulled from the RPC after connecting
- **Network switcher** — toggle between Mainnet and Devnet
- **Eager reconnect** — remembers trusted wallets on page reload
- **No build step** — vanilla JS + Solana Web3.js via CDN

## Project structure

```
index.html   — page structure, wallet modal, network modal, toast container
styles.css   — full visual system, wallet UI, modals, toasts, responsive
script.js    — dApp logic: wallets, balance, Memo tx, filters, certificate preview
```

## Run locally

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (e.g. `SolanaScholar`)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/SolanaScholar.git
git push -u origin main
```

2. Go to **Settings → Pages** in your repo
3. Under **Source**, select **Deploy from a branch → main → / (root)**
4. Save — your site will be live at `https://<your-username>.github.io/SolanaScholar/`

### Custom domain (optional)

1. Create a `CNAME` file in the root with your domain:
   ```
   yourdomain.com
   ```
2. In your domain registrar, add a CNAME record pointing to `<your-username>.github.io`
3. Enable **Enforce HTTPS** in GitHub Pages settings

## How certificate claiming works

When a user clicks **Claim Certificate On-chain**:

1. The app builds a transaction with a single instruction to the **Solana Memo Program** (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`)
2. The memo payload is `SolanaScholar|v1|<Tier>|<timestamp>` — signed by the user's wallet
3. The transaction is confirmed on-chain and the signature is linked to Solana Explorer
4. Cost: ~0.000005 SOL in network fees (use Devnet to test for free)

## Supported wallets

| Wallet | Detection |
|---|---|
| Phantom | `window.phantom.solana` |
| Solflare | `window.solflare` |
| Backpack | `window.backpack.solana` |
| Coinbase Wallet | `window.coinbaseSolana` |

Any wallet that injects a standard `window.solana` provider will also work.
