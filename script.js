// ─────────────────────────────────────────────────────────────────────────────
// Static Data
// ─────────────────────────────────────────────────────────────────────────────

const trackData = [
  {
    category: "Beginner",
    title: "Self Custody Basics",
    duration: "2 weeks",
    proof: "Tier 1",
    partner: "Powered by Ledger",
    description: "Learn to securely own your crypto without relying on exchanges or third parties. Covers hardware wallets, seed phrases, and real-world backup strategies.",
    outcomes: ["Set up a hardware wallet", "Secure your seed phrase", "Avoid common self-custody pitfalls"],
    modules: [
      { title: "What Is Self Custody?",        duration: "30 min" },
      { title: "Hardware Wallets Explained",   duration: "45 min" },
      { title: "Seed Phrases & Security",      duration: "40 min" },
      { title: "Multi-sig Wallets",            duration: "50 min" },
      { title: "Backup Strategies",            duration: "35 min" },
      { title: "Avoiding Common Mistakes",     duration: "40 min" },
    ]
  },
  {
    category: "Beginner",
    title: "Crypto Foundations",
    duration: "4 weeks",
    proof: "Tier 1",
    description: "A structured entry into wallets, tokens, DeFi basics, and crypto fundamentals.",
    outcomes: ["Curated content", "Structured progression", "High-quality learning materials"],
    modules: [
      { title: "What Is a Blockchain",      duration: "45 min" },
      { title: "Wallets & Private Keys",     duration: "50 min" },
      { title: "Tokens vs. Coins",           duration: "40 min" },
      { title: "DeFi Fundamentals",          duration: "60 min" },
      { title: "Staking & Yield",            duration: "45 min" },
      { title: "NFTs & Digital Assets",      duration: "40 min" },
      { title: "Reading On-Chain Data",      duration: "55 min" },
      { title: "Crypto Taxation Basics",     duration: "35 min" },
    ]
  },
  {
    category: "Analyst",
    title: "Research & Market Context",
    duration: "6 weeks",
    proof: "Tier 2",
    description: "Go deeper into protocol analysis, ecosystem context, and higher-signal research habits.",
    outcomes: ["Interpret crypto ecosystems", "Understand market narratives", "Build stronger context"],
    modules: [
      { title: "Reading Whitepapers",              duration: "60 min" },
      { title: "On-Chain Analytics",               duration: "70 min" },
      { title: "Market Cycles",                    duration: "55 min" },
      { title: "Protocol Evaluation",              duration: "65 min" },
      { title: "Tokenomics Deep Dive",             duration: "75 min" },
      { title: "Ecosystem Mapping",                duration: "50 min" },
      { title: "Narrative Trading",                duration: "60 min" },
      { title: "Building a Research Portfolio",    duration: "45 min" },
    ]
  },
  {
    category: "Analyst",
    title: "Perpetual Contracts Basics",
    duration: "3 weeks",
    proof: "Tier 2",
    description: "Understand perps, funding rates, leverage, and how decentralized perpetual platforms work — with a focus on Solana-native protocols.",
    outcomes: ["Trade perpetuals with confidence", "Understand funding mechanics", "Manage leverage risk"],
    modules: [
      { title: "Introduction to Perpetuals",       duration: "50 min" },
      { title: "Funding Rates Explained",          duration: "55 min" },
      { title: "Leverage & Liquidations",          duration: "60 min" },
      { title: "Long / Short Mechanics",           duration: "45 min" },
      { title: "Risk Management for Perps",        duration: "65 min" },
      { title: "Perp Platforms on Solana",         duration: "50 min" },
    ]
  },
  {
    category: "Builder",
    title: "Advanced Solana Learning",
    duration: "8 weeks",
    proof: "Tier 3",
    description: "Explore Solana-native mechanics, token extensions, and advanced product understanding.",
    outcomes: ["Study token extensions", "Follow innovation quickly", "Earn advanced certification"],
    modules: [
      { title: "Solana Architecture Overview",        duration: "65 min" },
      { title: "Account Model Deep Dive",             duration: "70 min" },
      { title: "Token Extensions (Token-2022)",       duration: "80 min" },
      { title: "Program Derived Addresses",           duration: "75 min" },
      { title: "Cross-Program Invocations",           duration: "70 min" },
      { title: "DePIN & Real World Assets",           duration: "60 min" },
      { title: "MEV & Validator Economics",           duration: "65 min" },
      { title: "Ecosystem Product Analysis",          duration: "55 min" },
    ]
  },
  {
    category: "Builder",
    title: "Launch Your First Solana dApp",
    duration: "5 weeks",
    proof: "Tier 2",
    description: "A hands-on course covering Solana program architecture, the Anchor framework, React frontend integration, and end-to-end deployment on Devnet and Mainnet.",
    outcomes: ["Write Anchor programs from scratch", "Build React + Web3.js frontends", "Deploy to Devnet & Mainnet"],
    modules: [
      { title: "Solana Program Architecture",          duration: "70 min" },
      { title: "Anchor Framework Basics",              duration: "80 min" },
      { title: "Writing Your First Program",           duration: "90 min" },
      { title: "Frontend with React & Web3.js",        duration: "75 min" },
      { title: "Token Integration",                    duration: "65 min" },
      { title: "Testing & Devnet Deployment",          duration: "70 min" },
      { title: "Mainnet Launch Checklist",             duration: "55 min" },
    ]
  },
];

const certificateMilestones = [
  {
    min: 0,
    title: "Foundations Certificate",
    tier: "Explorer",
    copy: "A verifiable on-chain certificate for learners completing the first structured modules.",
    features: [
      ["Metadata extension", "Adds user data and progress to the certificate."],
      ["Immutable owner", "Keeps the certificate bound to the learner wallet."],
      ["Memo required", "Creates a clear message when the certificate is issued."]
    ],
    details: [["Modules", "6 / 14"], ["Transferability", "Immutable"]]
  },
  {
    min: 45,
    title: "Applied Certificate",
    tier: "Practitioner",
    copy: "A dynamic certificate that reflects continued progress across structured learning paths.",
    features: [
      ["Progress-linked", "Updates as the user advances through the platform."],
      ["Verifiable on-chain", "Can be checked publicly and independently."],
      ["Professional issuance", "Issued by leading crypto professionals."]
    ],
    details: [["Modules", "11 / 14"], ["Transferability", "Immutable"]]
  },
  {
    min: 80,
    title: "Advanced Scholar Credential",
    tier: "Authority",
    copy: "An advanced credential for learners who complete higher-level courses and prove serious crypto knowledge.",
    features: [
      ["Advanced metadata", "Captures progress, track history, and completion level."],
      ["Immutable ownership", "Confirms permanent learner ownership."],
      ["Innovation-ready", "Built on Solana as the home for crypto-native experimentation."]
    ],
    details: [["Modules", "14 / 14"], ["Transferability", "Immutable"]]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Wallet Definitions
// ─────────────────────────────────────────────────────────────────────────────

const WALLETS = [
  {
    id: "phantom",
    name: "Phantom",
    color: "#ab9ff2",
    getProvider() {
      const p = window.phantom?.solana;
      if (p?.isPhantom) return p;
      if (window.solana?.isPhantom) return window.solana;
      return null;
    },
    url: "https://phantom.app/"
  },
  {
    id: "solflare",
    name: "Solflare",
    color: "#fc8d00",
    getProvider() {
      return window.solflare?.isSolflare ? window.solflare : null;
    },
    url: "https://solflare.com/"
  },
  {
    id: "backpack",
    name: "Backpack",
    color: "#e33e3f",
    getProvider() {
      return window.backpack?.solana ?? null;
    },
    url: "https://backpack.app/"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    color: "#0052ff",
    getProvider() {
      return window.coinbaseSolana ?? null;
    },
    url: "https://www.coinbase.com/wallet"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Network Config — Devnet by default
// ─────────────────────────────────────────────────────────────────────────────

const NETWORKS = {
  "mainnet-beta": {
    label: "Mainnet",
    rpc: "https://api.mainnet-beta.solana.com",
    explorerUrl: (sig) => `https://explorer.solana.com/tx/${sig}`
  },
  devnet: {
    label: "Devnet",
    rpc: "https://api.devnet.solana.com",
    explorerUrl: (sig) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
    mintExplorerUrl: (addr) => `https://explorer.solana.com/address/${addr}?cluster=devnet`
  }
};


// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

let provider            = null;
let activeWallet        = null;
let connectedKey        = null;
let activeFilter        = "All";
let activeNetwork       = "devnet";
let currentTier         = null;
let claimPending        = false;
let airdropPending      = false;
let openModalCount      = 0;
let certAlreadyMinted   = false;
let existingMintAddress = null;
let balancePollInterval = null;

// ─────────────────────────────────────────────────────────────────────────────
// DOM References
// ─────────────────────────────────────────────────────────────────────────────

const controls       = document.getElementById("track-controls");
const grid           = document.getElementById("track-grid");
const progressRange  = document.getElementById("progress-range");
const progressOutput = document.getElementById("progress-output");
const tierOutput     = document.getElementById("tier-output");
const scoreOutput    = document.getElementById("score-output");
const featureList    = document.getElementById("certificate-features");
const badgeOutput    = document.getElementById("badge-output");
const certTitle      = document.getElementById("certificate-title");
const certCopy       = document.getElementById("certificate-copy");
const certDetails    = document.getElementById("certificate-details");
const masteryBar     = document.getElementById("mastery-bar");
const metadataBar    = document.getElementById("metadata-bar");

const walletButton   = document.getElementById("wallet-button");
const walletLabel    = document.getElementById("wallet-label");
const balancePill    = document.getElementById("balance-pill");
const balanceOutput  = document.getElementById("balance-output");
const faucetButton   = document.getElementById("faucet-button");
const networkPill    = document.getElementById("network-pill");
const networkDot     = document.getElementById("network-dot");
const networkLabel   = document.getElementById("network-label");

const walletModal         = document.getElementById("wallet-modal");
const walletModalBackdrop = document.getElementById("wallet-modal-backdrop");
const walletModalClose    = document.getElementById("wallet-modal-close");
const walletList          = document.getElementById("wallet-list");

const networkModal         = document.getElementById("network-modal");
const networkModalBackdrop = document.getElementById("network-modal-backdrop");
const networkModalClose    = document.getElementById("network-modal-close");

const claimButton  = document.getElementById("claim-button");
const txResult     = document.getElementById("tx-result");
const txLink       = document.getElementById("tx-link");
const txLabel      = document.getElementById("tx-label");

const toastStack   = document.getElementById("toast-stack");

const pricingModal         = document.getElementById("pricing-modal");
const pricingModalBackdrop = document.getElementById("pricing-modal-backdrop");
const pricingModalClose    = document.getElementById("pricing-modal-close");
const pmPlanLabel          = document.getElementById("pricing-modal-plan-label");
const pmPriceBig           = document.getElementById("pm-price-big");
const pmBillingNote        = document.getElementById("pm-billing-note");
const pmBilledTotal        = document.getElementById("pm-billed-total");
const pmCardBtn            = document.getElementById("pm-card-btn");
const pmUsdcBtn            = document.getElementById("pm-usdc-btn");
const pmUsdcLabel          = document.getElementById("pm-usdc-label");

const coursePanel        = document.getElementById("course-panel");
const coursePanelContent = document.getElementById("course-panel-content");
const coursePanelClose   = document.getElementById("course-panel-close");

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastStack.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("toast-visible")));
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 4500);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scroll Lock
// ─────────────────────────────────────────────────────────────────────────────

function lockScroll()   { openModalCount++; document.body.style.overflow = "hidden"; }
function unlockScroll() { if (--openModalCount <= 0) { openModalCount = 0; document.body.style.overflow = ""; } }

// ─────────────────────────────────────────────────────────────────────────────
// Wallet Modal
// ─────────────────────────────────────────────────────────────────────────────

function openWalletModal() {
  renderWalletList();
  walletModal.classList.add("open");
  lockScroll();
}

function closeWalletModal() {
  walletModal.classList.remove("open");
  unlockScroll();
}

function renderWalletList() {
  walletList.innerHTML = "";
  WALLETS.forEach((w) => {
    const detected = !!w.getProvider();
    const li = document.createElement("li");
    li.className = "wallet-option";
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.innerHTML = `
      <span class="wallet-option-icon" style="background:${w.color}1a;border-color:${w.color}44;color:${w.color}">${w.name.charAt(0)}</span>
      <span class="wallet-option-name">${w.name}</span>
      <span class="wallet-option-status ${detected ? "detected" : "install"}">${detected ? "Detected" : "Install"}</span>
    `;
    const connect = () => { closeWalletModal(); connectWallet(w); };
    li.addEventListener("click", connect);
    li.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); connect(); } });
    walletList.appendChild(li);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Network Modal
// ─────────────────────────────────────────────────────────────────────────────

function openNetworkModal() {
  networkModal.querySelectorAll(".network-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.network === activeNetwork);
  });
  networkModal.classList.add("open");
  lockScroll();
}

function closeNetworkModal() {
  networkModal.classList.remove("open");
  unlockScroll();
}

function setNetwork(networkId) {
  activeNetwork = networkId;
  const net = NETWORKS[networkId];
  if (networkLabel) networkLabel.textContent = net.label;
  if (networkDot)   networkDot.className = `network-dot ${networkId === "mainnet-beta" ? "green" : "yellow"}`;
  if (connectedKey) fetchAndDisplayBalance(connectedKey);
}

// ─────────────────────────────────────────────────────────────────────────────
// Balance
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAndDisplayBalance(pubkey) {
  if (typeof solanaWeb3 === "undefined") return;
  try {
    const { Connection, PublicKey } = solanaWeb3;
    const connection = new Connection(NETWORKS[activeNetwork].rpc, "confirmed");
    const lamports = await connection.getBalance(new PublicKey(pubkey));
    if (lamports === 0) {
      balancePill.classList.add("hidden");
      if (faucetButton && activeNetwork === "devnet") faucetButton.classList.remove("hidden");
      return;
    }
    const sol = (lamports / 1e9).toFixed(3);
    balanceOutput.textContent = `${sol} SOL`;
    balancePill.classList.remove("hidden");
    // Hide faucet if user has SOL
    if (faucetButton) faucetButton.classList.add("hidden");
  } catch {
    balancePill.classList.add("hidden");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Devnet Airdrop
// ─────────────────────────────────────────────────────────────────────────────

function openFaucet() {
  if (!connectedKey) return;
  if (activeNetwork !== "devnet") {
    showToast("Faucet is only available on Devnet.", "error");
    return;
  }
  // Open faucet pre-filled with the user's wallet address
  const url = `https://faucet.solana.com/?wallet=${encodeURIComponent(connectedKey)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  showToast("Faucet opened — balance will update automatically.", "info");
}

// ─────────────────────────────────────────────────────────────────────────────
// Wallet Connection
// ─────────────────────────────────────────────────────────────────────────────

function startBalancePolling() {
  stopBalancePolling();
  if (activeNetwork !== "devnet") return;
  balancePollInterval = setInterval(() => {
    if (connectedKey) fetchAndDisplayBalance(connectedKey);
  }, 5000);
}

function stopBalancePolling() {
  if (balancePollInterval) { clearInterval(balancePollInterval); balancePollInterval = null; }
}

function shortenAddress(addr) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function attachWalletListeners(p) {
  p.on?.("disconnect", () => { connectedKey = null; resetWalletUI(); });
  p.on?.("accountChanged", (pk) => {
    if (pk) { handleConnected(pk); } else { connectedKey = null; resetWalletUI(); }
  });
}

async function handleConnected(publicKey) {
  connectedKey = typeof publicKey === "string" ? publicKey : publicKey?.toString?.() || "";
  if (!connectedKey) return;

  walletButton.classList.add("connected");
  walletLabel.textContent = shortenAddress(connectedKey);


  // Show faucet button on devnet after connecting
  if (faucetButton && activeNetwork === "devnet") {
    faucetButton.classList.remove("hidden");
  }

  await fetchAndDisplayBalance(connectedKey);
  startBalancePolling();
  showToast(`${activeWallet?.name || "Wallet"} connected`, "success");

  // Check on-chain for an existing OG cert; briefly show loading state
  claimButton.disabled = true;
  claimButton.textContent = "Checking wallet…";
  await checkExistingCertificate(connectedKey);
  if (!certAlreadyMinted) {
    claimButton.disabled = false;
    claimButton.textContent = "Claim OG Certificate";
  }
}

async function connectWallet(walletDef) {
  const p = walletDef.getProvider();
  if (!p) {
    window.open(walletDef.url, "_blank", "noopener,noreferrer");
    showToast(`${walletDef.name} not installed. Opening install page.`, "info");
    return;
  }
  try {
    const response = await p.connect();
    provider     = p;
    activeWallet = walletDef;
    await handleConnected(response.publicKey);
    attachWalletListeners(p);
  } catch (err) {
    if (err.code !== 4001) showToast("Connection failed. Please try again.", "error");
  }
}

async function disconnectWallet() {
  try { await provider?.disconnect(); } catch {}
  connectedKey = null;
  provider     = null;
  activeWallet = null;
  resetWalletUI();
  showToast("Wallet disconnected", "info");
}

function resetWalletUI() {
  walletButton.classList.remove("connected");
  walletLabel.textContent    = "Connect Wallet";
  stopBalancePolling();
  balancePill.classList.add("hidden");
  if (faucetButton) faucetButton.classList.add("hidden");

  // Reset claim state
  claimPending        = false;
  certAlreadyMinted   = false;
  existingMintAddress = null;
  claimButton.disabled = false;
  claimButton.classList.remove("claimed", "already-minted");
  claimButton.textContent = "Claim OG Certificate";
  txResult.classList.add("hidden");
}

// ─────────────────────────────────────────────────────────────────────────────
// OG Certificate — Duplicate Check
// ─────────────────────────────────────────────────────────────────────────────

function setAlreadyMintedUI(mintAddress) {
  certAlreadyMinted   = true;
  existingMintAddress = mintAddress;
  claimButton.disabled = true;
  claimButton.textContent = "Already Minted ✓";
  claimButton.classList.add("already-minted");
  claimButton.classList.remove("claimed");

  if (mintAddress) {
    const explorerUrl = NETWORKS[activeNetwork].mintExplorerUrl
      ? NETWORKS[activeNetwork].mintExplorerUrl(mintAddress)
      : `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`;
    txLink.href = explorerUrl;
    if (txLabel) txLabel.textContent = `OG Cert · ${mintAddress.slice(0, 6)}...${mintAddress.slice(-4)}`;
    txResult.classList.remove("hidden");
  }
}

async function checkExistingCertificate(walletAddress) {
  try {
    const apiBase = window.location.origin;
    const res = await fetch(
      `${apiBase}/api/check-certificate?walletAddress=${encodeURIComponent(walletAddress)}`
    );
    if (!res.ok) return;
    const { hasCertificate, mintAddress } = await res.json();
    if (hasCertificate) setAlreadyMintedUI(mintAddress);
  } catch {
    // Silently ignore — fallback is the claim flow itself
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OG Certificate — Token-2022 via Serverless API
// ─────────────────────────────────────────────────────────────────────────────

async function claimOGCertificate() {
  if (claimPending) return;
  if (certAlreadyMinted) {
    showToast("You already hold an OG Certificate!", "info");
    return;
  }

  if (!connectedKey || !provider) {
    showToast("Connect your wallet first.", "error");
    openWalletModal();
    return;
  }

  if (typeof solanaWeb3 === "undefined") {
    showToast("Solana library not loaded. Refresh the page.", "error");
    return;
  }

  claimPending = true;
  claimButton.disabled  = true;
  claimButton.textContent = "Building transaction...";
  txResult.classList.add("hidden");

  try {
    // 1. Request partially-signed transaction from our serverless API
    const apiBase = window.location.origin;
    const response = await fetch(`${apiBase}/api/mint-certificate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: connectedKey, tier: currentTier }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `API error ${response.status}`);
    }

    const { transaction: txBase64, mintAddress, blockhash, lastValidBlockHeight } = await response.json();

    // 2. Deserialize the partially-signed transaction
    const { Transaction, Connection } = solanaWeb3;
    const txBytes = Uint8Array.from(atob(txBase64), (c) => c.charCodeAt(0));
    const tx = Transaction.from(txBytes);

    claimButton.textContent = "Awaiting signature...";

    // 3. User signs the transaction (they are the feePayer)
    let signedTx;
    if (provider.signTransaction) {
      signedTx = await provider.signTransaction(tx);
    } else {
      throw new Error("Wallet does not support signTransaction");
    }

    claimButton.textContent = "Sending to Solana...";

    // 4. Send the fully-signed transaction
    const connection = new Connection(NETWORKS[activeNetwork].rpc, "confirmed");
    const signature = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    showToast("Transaction sent. Confirming on-chain...", "info");

    // 5. Confirm
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

    // 6. Show success
    const explorerUrl = NETWORKS[activeNetwork].mintExplorerUrl
      ? NETWORKS[activeNetwork].mintExplorerUrl(mintAddress)
      : NETWORKS[activeNetwork].explorerUrl(signature);

    txLink.href = explorerUrl;
    if (txLabel) txLabel.textContent = `OG Cert minted · ${mintAddress.slice(0, 6)}...${mintAddress.slice(-4)}`;
    txResult.classList.remove("hidden");

    claimButton.textContent = "Already Minted ✓";
    claimButton.classList.remove("claimed");
    claimButton.classList.add("already-minted");
    claimButton.disabled = true;
    certAlreadyMinted   = true;
    existingMintAddress = mintAddress;

    showToast("OG User Certificate minted on Solana!", "success");
    setTimeout(() => fetchAndDisplayBalance(connectedKey), 1500);

  } catch (err) {
    const rejected = err.code === 4001 ||
      err.message?.toLowerCase().includes("rejected") ||
      err.message?.toLowerCase().includes("cancelled");

    if (!rejected && connectedKey) {
      // Transaction may have landed despite the error (network blip, timeout,
      // "already processed" on retry, etc.).  Check on-chain before giving up.
      claimButton.textContent = "Verifying…";
      claimButton.disabled = true;
      await checkExistingCertificate(connectedKey);
      if (certAlreadyMinted) {
        showToast("Certificate minted successfully!", "success");
        fetchAndDisplayBalance(connectedKey);
        return; // setAlreadyMintedUI already applied — leave button as-is
      }
    }

    claimButton.textContent = "Claim OG Certificate";
    claimButton.classList.remove("claimed", "already-minted");
    claimButton.disabled = false;
    showToast(
      rejected
        ? "Transaction rejected."
        : (err.message || "Transaction failed."),
      rejected ? "info" : "error"
    );
  } finally {
    claimPending = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing Modal
// ─────────────────────────────────────────────────────────────────────────────

const PLANS = {
  monthly: {
    label:      "Monthly Plan",
    price:      "$25",
    billing:    "/month",
    billed:     "Billed $25 monthly",
    // Create a Stripe Payment Link at https://dashboard.stripe.com/payment-links
    stripeLink: "https://buy.stripe.com/REPLACE_MONTHLY",
    usdcAmount: 25,      // USDC (6 decimals) — matches USD price
  },
  yearly: {
    label:      "Yearly Plan",
    price:      "$20",
    billing:    "/month",
    billed:     "Billed $240 per year — save $60",
    stripeLink: "https://buy.stripe.com/REPLACE_YEARLY",
    usdcAmount: 240,
  },
};

// Treasury wallet that receives USDC subscription payments
const TREASURY_ADDRESS = "REPLACE_WITH_TREASURY_WALLET_ADDRESS";

// USDC mint addresses
const USDC_MINT = {
  "mainnet-beta": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  devnet:         "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
};

let activePlan = null;
let solPayPending = false;

function openPricingModal(planKey) {
  const plan = PLANS[planKey];
  if (!plan) return;
  activePlan = planKey;

  pmPlanLabel.textContent   = plan.label;
  pmPriceBig.textContent    = plan.price;
  pmBillingNote.textContent = plan.billing;
  pmBilledTotal.textContent = plan.billed;

  // Update USDC button label
  if (pmUsdcLabel) pmUsdcLabel.textContent = `Pay ${plan.usdcAmount} USDC`;

  pricingModal.classList.add("open");
  lockScroll();
}

function closePricingModal() {
  pricingModal.classList.remove("open");
  unlockScroll();
  activePlan = null;
}

// Encode a u64 as little-endian 8 bytes (no BigInt dependency on older browsers)
function encodeU64LE(n) {
  const hi = Math.floor(n / 0x1_00_00_00_00);
  const lo = n >>> 0;
  return new Uint8Array([
    lo & 0xff, (lo >>> 8) & 0xff, (lo >>> 16) & 0xff, (lo >>> 24) & 0xff,
    hi & 0xff, (hi >>> 8) & 0xff, (hi >>> 16) & 0xff, (hi >>> 24) & 0xff,
  ]);
}

async function handleUSDCPayment() {
  if (solPayPending) return;
  const plan = PLANS[activePlan];
  if (!plan) return;

  if (!connectedKey || !provider) {
    closePricingModal();
    openWalletModal();
    showToast("Connect your wallet to pay with USDC.", "info");
    return;
  }

  if (typeof solanaWeb3 === "undefined") {
    showToast("Solana library not loaded. Refresh the page.", "error");
    return;
  }

  solPayPending = true;
  if (pmUsdcBtn) pmUsdcBtn.disabled = true;
  if (pmUsdcLabel) pmUsdcLabel.textContent = "Sending…";

  try {
    const { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } = solanaWeb3;

    const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const ATA_PROGRAM_ID   = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bXp");
    const MEMO_PROG        = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

    const usdcMint     = new PublicKey(USDC_MINT[activeNetwork] || USDC_MINT["mainnet-beta"]);
    const fromPubkey   = new PublicKey(connectedKey);
    const treasuryKey  = new PublicKey(TREASURY_ADDRESS);

    // Derive sender and treasury USDC ATAs
    const seeds = (owner) => [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), usdcMint.toBuffer()];
    const [fromATA]    = PublicKey.findProgramAddressSync(seeds(fromPubkey),  ATA_PROGRAM_ID);
    const [toATA]      = PublicKey.findProgramAddressSync(seeds(treasuryKey), ATA_PROGRAM_ID);

    const microUsdc    = plan.usdcAmount * 1_000_000; // USDC has 6 decimals

    const connection = new Connection(NETWORKS[activeNetwork].rpc, "confirmed");
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction({ recentBlockhash: blockhash, feePayer: fromPubkey });

    // Ensure treasury USDC ATA exists (idempotent create — no-ops if already exists)
    tx.add(new TransactionInstruction({
      keys: [
        { pubkey: fromPubkey,              isSigner: true,  isWritable: true  },
        { pubkey: toATA,                   isSigner: false, isWritable: true  },
        { pubkey: treasuryKey,             isSigner: false, isWritable: false },
        { pubkey: usdcMint,                isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false },
      ],
      programId: ATA_PROGRAM_ID,
      data: new Uint8Array([1]), // index 1 = CreateIdempotent
    }));

    // SPL Token Transfer (instruction 3)
    tx.add(new TransactionInstruction({
      keys: [
        { pubkey: fromATA,    isSigner: false, isWritable: true  },
        { pubkey: toATA,      isSigner: false, isWritable: true  },
        { pubkey: fromPubkey, isSigner: true,  isWritable: false },
      ],
      programId: TOKEN_PROGRAM_ID,
      data: new Uint8Array([3, ...encodeU64LE(microUsdc)]),
    }));

    // On-chain memo
    tx.add(new TransactionInstruction({
      keys:      [{ pubkey: fromPubkey, isSigner: true, isWritable: false }],
      programId: MEMO_PROG,
      data:      new TextEncoder().encode(`SolanaScholar:${activePlan}`),
    }));

    const signedTx = await provider.signTransaction(tx);
    const sig = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false });
    await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");

    closePricingModal();
    showToast(`USDC payment confirmed! Welcome to Solana Scholar.`, "success");
    fetchAndDisplayBalance(connectedKey);
  } catch (err) {
    const rejected = err.code === 4001 || err.message?.toLowerCase().includes("rejected");
    showToast(
      rejected
        ? "Payment cancelled."
        : (err.message?.includes("insufficient")
            ? "Insufficient USDC balance."
            : (err.message || "Payment failed.")),
      "error"
    );
  } finally {
    solPayPending = false;
    if (pmUsdcBtn) pmUsdcBtn.disabled = false;
    if (pmUsdcLabel && activePlan) pmUsdcLabel.textContent = `Pay ${PLANS[activePlan].usdcAmount} USDC`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Course Panel
// ─────────────────────────────────────────────────────────────────────────────

function openCoursePanel(track) {
  const modulesHTML = track.modules.map((mod, i) => `
    <div class="module-item">
      <span class="module-num">${String(i + 1).padStart(2, "0")}</span>
      <div class="module-info">
        <span class="module-title">${mod.title}</span>
        <span class="module-duration">${mod.duration}</span>
      </div>
      <span class="module-lock" aria-label="Locked">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <rect x="2.5" y="5.5" width="8" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M4 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </span>
    </div>
  `).join("");

  const detailsHTML = [
    ["Duration",    track.duration],
    ["Certificate", track.proof],
    ["Modules",     track.modules.length],
    ["Level",       track.category],
  ].map(([l, v]) => `<div class="panel-detail-row"><span>${l}</span><strong>${v}</strong></div>`).join("");

  const outcomesHTML = track.outcomes
    .map((o) => `<li>${o}</li>`)
    .join("");

  coursePanelContent.innerHTML = `
    <div class="cp-hero">
      <div class="cp-meta-row">
        <span class="cp-cat">${track.category}</span>
        <span class="cp-dur">${track.duration}</span>
        <span class="cp-proof">${track.proof}</span>
      </div>
      <h1 id="course-panel-title" class="cp-title">${track.title}</h1>
      <p class="cp-desc">${track.description}</p>
    </div>

    <div class="cp-progress-block">
      <div class="cp-progress-header">
        <span class="cp-status-pill">Not Started</span>
        <span class="cp-pct">0%</span>
      </div>
      <div class="bar-track cp-bar">
        <span style="width:0%"></span>
      </div>
      <p class="cp-modules-note">0 of ${track.modules.length} modules complete</p>
    </div>

    <div class="cp-body-grid">
      <section class="cp-modules-col">
        <h3>Course Modules</h3>
        <div class="module-list">${modulesHTML}</div>
      </section>

      <aside class="cp-sidebar">
        <h3>What You'll Learn</h3>
        <ul class="cp-outcomes">${outcomesHTML}</ul>

        <h3>Details</h3>
        <div class="panel-details">${detailsHTML}</div>
      </aside>
    </div>
  `;

  coursePanel.classList.add("open");
  coursePanel.scrollTop = 0;
  lockScroll();
}

function closeCoursePanel() {
  coursePanel.classList.remove("open");
  unlockScroll();
}

// ─────────────────────────────────────────────────────────────────────────────
// Track Filters & Render
// ─────────────────────────────────────────────────────────────────────────────

const filters = ["All", ...new Set(trackData.map((t) => t.category))];

function renderFilters() {
  controls.innerHTML = "";
  filters.forEach((filter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-chip${filter === activeFilter ? " active" : ""}`;
    btn.textContent = filter;
    btn.addEventListener("click", () => { activeFilter = filter; renderFilters(); renderTracks(); });
    controls.appendChild(btn);
  });
}

function renderTracks() {
  const visible = activeFilter === "All" ? trackData : trackData.filter((t) => t.category === activeFilter);
  grid.innerHTML = "";
  visible.forEach((track) => {
    const card = document.createElement("article");
    card.className = "track-card card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open ${track.title} course`);
    card.innerHTML = `
      <div class="track-meta">
        <span>${track.category}</span>
        <span>${track.duration}</span>
        ${track.partner ? `<span class="track-partner-tag">${track.partner}</span>` : ""}
      </div>
      <h3>${track.title}</h3>
      <p>${track.description}</p>
      <ul class="track-list">${track.outcomes.map((o) => `<li>${o}</li>`).join("")}</ul>
      <span class="track-card-cta">View course →</span>
    `;
    const open = () => openCoursePanel(track);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    grid.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificate Preview
// ─────────────────────────────────────────────────────────────────────────────

function getMilestone(progress) {
  return [...certificateMilestones].reverse().find((m) => progress >= m.min);
}

function renderCertificate(progress) {
  const milestone   = getMilestone(progress);
  const scoreValue  = Math.min(99, Math.round(progress * 0.68 + 45));
  const metaValue   = Math.min(100, Math.round(progress * 0.88 + 10));

  currentTier = milestone.tier;

  progressOutput.textContent = `${progress}%`;
  tierOutput.textContent     = milestone.tier;
  scoreOutput.textContent    = `${scoreValue} / 100`;
  badgeOutput.textContent    = milestone.tier;
  certTitle.textContent      = milestone.title;
  certCopy.textContent       = milestone.copy;
  masteryBar.style.width     = `${scoreValue}%`;
  metadataBar.style.width    = `${metaValue}%`;

  featureList.innerHTML = milestone.features
    .map(([t, c]) => `<li><span>${t}</span><strong>${c}</strong></li>`)
    .join("");

  certDetails.innerHTML = milestone.details
    .map(([l, v]) => `<div><span>${l}</span><strong>${v}</strong></div>`)
    .join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// Eager Reconnect
// ─────────────────────────────────────────────────────────────────────────────

function tryEagerReconnect() {
  WALLETS.forEach((w) => {
    if (connectedKey) return;
    const p = w.getProvider();
    if (!p) return;
    p.connect({ onlyIfTrusted: true })
      .then(({ publicKey }) => {
        if (!connectedKey) {
          provider = p; activeWallet = w;
          handleConnected(publicKey);
          attachWalletListeners(p);
        }
      })
      .catch(() => {});
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────

renderFilters();
renderTracks();
renderCertificate(Number(progressRange.value));
setNetwork(activeNetwork);
tryEagerReconnect();

// ─────────────────────────────────────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────────────────────────────────────

walletButton.addEventListener("click", () => {
  if (connectedKey) { disconnectWallet(); } else { openWalletModal(); }
});

walletModalClose.addEventListener("click", closeWalletModal);
walletModalBackdrop.addEventListener("click", closeWalletModal);

networkPill?.addEventListener("click", openNetworkModal);
networkModalClose?.addEventListener("click", closeNetworkModal);
networkModalBackdrop?.addEventListener("click", closeNetworkModal);

networkModal?.querySelectorAll(".network-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.network;
    if (id !== activeNetwork) { setNetwork(id); showToast(`Switched to ${NETWORKS[id].label}`, "info"); }
    closeNetworkModal();
  });
});

faucetButton?.addEventListener("click", openFaucet);
claimButton.addEventListener("click", claimOGCertificate);

progressRange.addEventListener("input", (e) => {
  renderCertificate(Number(e.target.value));
  txResult.classList.add("hidden");
  claimButton.textContent = "Claim OG Certificate";
  claimButton.classList.remove("claimed");
  claimButton.disabled = false;
});

coursePanelClose?.addEventListener("click", closeCoursePanel);

// Pricing modal
pricingModalClose?.addEventListener("click", closePricingModal);
pricingModalBackdrop?.addEventListener("click", closePricingModal);

document.querySelectorAll(".subscribe-btn").forEach((btn) => {
  btn.addEventListener("click", () => openPricingModal(btn.dataset.plan));
});

pmCardBtn?.addEventListener("click", () => {
  const plan = PLANS[activePlan];
  if (!plan) return;
  window.open(plan.stripeLink, "_blank", "noopener,noreferrer");
});

pmUsdcBtn?.addEventListener("click", handleUSDCPayment);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeWalletModal(); closeNetworkModal(); closeCoursePanel(); closePricingModal(); }
});
