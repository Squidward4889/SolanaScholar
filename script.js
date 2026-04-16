// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const trackData = [
  {
    category: "Beginner",
    title: "Crypto Foundations",
    duration: "4 weeks",
    proof: "Tier 1",
    description: "A structured entry into wallets, tokens, DeFi basics, and crypto fundamentals.",
    outcomes: ["Curated content", "Structured progression", "High-quality learning materials"]
  },
  {
    category: "Analyst",
    title: "Research & Market Context",
    duration: "6 weeks",
    proof: "Tier 2",
    description: "Go deeper into protocol analysis, ecosystem context, and higher-signal research habits.",
    outcomes: ["Interpret crypto ecosystems", "Understand market narratives", "Build stronger context"]
  },
  {
    category: "Builder",
    title: "Advanced Solana Learning",
    duration: "8 weeks",
    proof: "Tier 3",
    description: "Explore Solana-native mechanics, token extensions, and advanced product understanding.",
    outcomes: ["Study token extensions", "Follow innovation quickly", "Earn advanced certification"]
  }
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
    details: [
      ["Modules", "6 / 14"],
      ["Transferability", "Immutable"]
    ]
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
    details: [
      ["Modules", "11 / 14"],
      ["Transferability", "Immutable"]
    ]
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
    details: [
      ["Modules", "14 / 14"],
      ["Transferability", "Immutable"]
    ]
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
// Network Config
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
    explorerUrl: (sig) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

let provider = null;
let activeWallet = null;
let connectedKey = null;
let activeFilter = "All";
let activeNetwork = "mainnet-beta";
let currentTier = null;
let claimPending = false;
let openModalCount = 0; // tracks how many modals are open to manage body scroll lock

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
const walletIcon     = document.getElementById("wallet-icon");
const walletLabel    = document.getElementById("wallet-label");
const balancePill    = document.getElementById("balance-pill");
const balanceOutput  = document.getElementById("balance-output");
const networkPill    = document.getElementById("network-pill");
const networkDot     = document.getElementById("network-dot");
const networkLabel   = document.getElementById("network-label");

const walletModal    = document.getElementById("wallet-modal");
const walletModalBackdrop = document.getElementById("wallet-modal-backdrop");
const walletModalClose    = document.getElementById("wallet-modal-close");
const walletList     = document.getElementById("wallet-list");

const networkModal   = document.getElementById("network-modal");
const networkModalBackdrop = document.getElementById("network-modal-backdrop");
const networkModalClose    = document.getElementById("network-modal-close");

const claimButton    = document.getElementById("claim-button");
const txResult       = document.getElementById("tx-result");
const txLink         = document.getElementById("tx-link");

const toastStack     = document.getElementById("toast-stack");

// ─────────────────────────────────────────────────────────────────────────────
// Toast System
// ─────────────────────────────────────────────────────────────────────────────

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastStack.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("toast-visible"));
  });

  setTimeout(() => {
    toast.classList.remove("toast-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 4000);
}

// ─────────────────────────────────────────────────────────────────────────────
// Wallet Modal
// ─────────────────────────────────────────────────────────────────────────────

function lockScroll()   { openModalCount++; document.body.style.overflow = "hidden"; }
function unlockScroll() { if (--openModalCount <= 0) { openModalCount = 0; document.body.style.overflow = ""; } }

function openWalletModal() {
  renderWalletList();
  walletModal.classList.remove("hidden");
  lockScroll();
}

function closeWalletModal() {
  walletModal.classList.add("hidden");
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
      <span class="wallet-option-icon" style="background:${w.color}1a;border-color:${w.color}44;color:${w.color}">
        ${w.name.charAt(0)}
      </span>
      <span class="wallet-option-name">${w.name}</span>
      <span class="wallet-option-status ${detected ? "detected" : "install"}">
        ${detected ? "Detected" : "Install"}
      </span>
    `;

    const connect = () => {
      closeWalletModal();
      connectWallet(w);
    };

    li.addEventListener("click", connect);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        connect();
      }
    });

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
  networkModal.classList.remove("hidden");
  lockScroll();
}

function closeNetworkModal() {
  networkModal.classList.add("hidden");
  unlockScroll();
}

function setNetwork(networkId) {
  activeNetwork = networkId;
  const net = NETWORKS[networkId];
  if (networkLabel) networkLabel.textContent = net.label;
  if (networkDot)   networkDot.className = `network-dot ${networkId === "mainnet-beta" ? "green" : "yellow"}`;

  if (connectedKey) {
    fetchAndDisplayBalance(connectedKey);
  }
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
      // Hide pill for zero balance — prevents showing "0.0000 SOL" on fresh wallets
      balancePill.classList.add("hidden");
      return;
    }
    const sol = (lamports / 1e9).toFixed(4);
    balanceOutput.textContent = `${sol} SOL`;
    balancePill.classList.remove("hidden");
  } catch {
    balancePill.classList.add("hidden");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Wallet Connection
// ─────────────────────────────────────────────────────────────────────────────

function shortenAddress(address) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

async function handleConnected(publicKey) {
  connectedKey = typeof publicKey === "string" ? publicKey : publicKey?.toString?.() || "";

  if (!connectedKey) return;

  walletButton.classList.add("connected");
  walletLabel.textContent = shortenAddress(connectedKey);

  if (activeWallet) {
    walletIcon.style.background = `${activeWallet.color}28`;
    walletIcon.style.borderColor = `${activeWallet.color}55`;
  }

  await fetchAndDisplayBalance(connectedKey);
  showToast(`${activeWallet?.name || "Wallet"} connected`, "success");
}

/** Attach wallet event listeners — extracted to avoid duplication across connect paths. */
function attachWalletListeners(p) {
  p.on?.("disconnect", () => {
    connectedKey = null;
    resetWalletUI();
  });

  p.on?.("accountChanged", (pk) => {
    if (pk) {
      handleConnected(pk);
    } else {
      connectedKey = null;
      resetWalletUI();
    }
  });
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
    provider = p;
    activeWallet = walletDef;
    await handleConnected(response.publicKey);
    attachWalletListeners(p);
  } catch (err) {
    if (err.code !== 4001) {
      showToast("Connection failed. Please try again.", "error");
    }
  }
}

async function disconnectWallet() {
  try {
    await provider?.disconnect();
  } catch {
    // ignore disconnect errors
  }

  connectedKey = null;
  provider = null;
  activeWallet = null;
  resetWalletUI();
  showToast("Wallet disconnected", "info");
}

function resetWalletUI() {
  walletButton.classList.remove("connected");
  walletLabel.textContent = "Connect Wallet";
  walletIcon.style.background = "";
  walletIcon.style.borderColor = "";
  balancePill.classList.add("hidden");

  // Clear any in-flight claim state so the button isn't stuck
  claimPending = false;
  claimButton.disabled = false;
  claimButton.classList.remove("claimed");
  claimButton.textContent = "Claim Certificate On-chain";
  txResult.classList.add("hidden");
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificate Claiming (Solana Memo Program)
// ─────────────────────────────────────────────────────────────────────────────

async function claimCertificate() {
  if (claimPending) return;

  if (!connectedKey || !provider) {
    showToast("Connect your wallet to claim this certificate.", "error");
    openWalletModal();
    return;
  }

  if (typeof solanaWeb3 === "undefined") {
    showToast("Solana library not loaded. Please refresh.", "error");
    return;
  }

  claimPending = true;
  claimButton.disabled = true;
  claimButton.textContent = "Sending transaction...";
  txResult.classList.add("hidden");

  try {
    const { Connection, PublicKey, Transaction, TransactionInstruction } = solanaWeb3;
    const connection = new Connection(NETWORKS[activeNetwork].rpc, "confirmed");
    const publicKey = new PublicKey(connectedKey);

    // Solana Memo Program — records data on-chain tied to the signer
    const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

    const memoText = `SolanaScholar|v1|${currentTier}|${Date.now()}`;

    const ix = new TransactionInstruction({
      keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
      programId: MEMO_PROGRAM_ID,
      data: new TextEncoder().encode(memoText)
    });

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: publicKey
    }).add(ix);

    let signature;

    // Use signAndSendTransaction if available (Phantom, Backpack), otherwise sign then send
    if (provider.signAndSendTransaction) {
      const result = await provider.signAndSendTransaction(tx);
      signature = result.signature;
    } else {
      const signed = await provider.signTransaction(tx);
      signature = await connection.sendRawTransaction(signed.serialize());
    }

    showToast("Transaction sent. Confirming on-chain...", "info");

    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed"
    );

    const explorerUrl = NETWORKS[activeNetwork].explorerUrl(signature);

    txLink.href = explorerUrl;
    txResult.classList.remove("hidden");

    claimButton.textContent = "Claimed!";
    claimButton.classList.add("claimed");
    claimButton.disabled = false;

    showToast(`${currentTier} certificate minted on Solana!`, "success");

    // Refresh balance after fee deduction
    setTimeout(() => fetchAndDisplayBalance(connectedKey), 1500);
  } catch (err) {
    claimButton.textContent = "Claim Certificate On-chain";
    claimButton.classList.remove("claimed");
    claimButton.disabled = false;

    const rejected = err.code === 4001 || err.message?.toLowerCase().includes("rejected") || err.message?.toLowerCase().includes("cancelled");
    showToast(rejected ? "Transaction rejected." : (err.message || "Transaction failed."), "error");
  } finally {
    claimPending = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Track Filters & Render
// ─────────────────────────────────────────────────────────────────────────────

const filters = ["All", ...new Set(trackData.map((t) => t.category))];

function renderFilters() {
  controls.innerHTML = "";

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${filter === activeFilter ? " active" : ""}`;
    button.textContent = filter;
    button.addEventListener("click", () => {
      activeFilter = filter;
      renderFilters();
      renderTracks();
    });
    controls.appendChild(button);
  });
}

function renderTracks() {
  const visible = activeFilter === "All"
    ? trackData
    : trackData.filter((t) => t.category === activeFilter);

  grid.innerHTML = "";

  visible.forEach((track) => {
    const card = document.createElement("article");
    card.className = "track-card card";
    card.innerHTML = `
      <div class="track-meta">
        <span>${track.category}</span>
        <span>${track.duration}</span>
        <span>${track.proof}</span>
      </div>
      <h3>${track.title}</h3>
      <p>${track.description}</p>
      <ul class="track-list">
        ${track.outcomes.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
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
  const milestone = getMilestone(progress);
  const scoreValue = Math.min(99, Math.round(progress * 0.68 + 45));
  const metadataValue = Math.min(100, Math.round(progress * 0.88 + 10));

  currentTier = milestone.tier;

  progressOutput.textContent = `${progress}%`;
  tierOutput.textContent = milestone.tier;
  scoreOutput.textContent = `${scoreValue} / 100`;

  badgeOutput.textContent = milestone.tier;
  certTitle.textContent = milestone.title;
  certCopy.textContent = milestone.copy;

  masteryBar.style.width = `${scoreValue}%`;
  metadataBar.style.width = `${metadataValue}%`;

  featureList.innerHTML = milestone.features
    .map(([title, copy]) => `<li><span>${title}</span><strong>${copy}</strong></li>`)
    .join("");

  certDetails.innerHTML = milestone.details
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// Eager Reconnect
// ─────────────────────────────────────────────────────────────────────────────

function tryEagerReconnect() {
  WALLETS.forEach((w) => {
    if (connectedKey) return; // already connected by a previous wallet

    const p = w.getProvider();
    if (!p) return;

    p.connect({ onlyIfTrusted: true })
      .then(({ publicKey }) => {
        if (!connectedKey) {
          provider = p;
          activeWallet = w;
          handleConnected(publicKey);
          attachWalletListeners(p);
        }
      })
      .catch(() => {
        // Ignore: user hasn't trusted this site yet
      });
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
  if (connectedKey) {
    disconnectWallet();
  } else {
    openWalletModal();
  }
});

walletModalClose.addEventListener("click", closeWalletModal);
walletModalBackdrop.addEventListener("click", closeWalletModal);

networkPill?.addEventListener("click", openNetworkModal);
networkModalClose?.addEventListener("click", closeNetworkModal);
networkModalBackdrop?.addEventListener("click", closeNetworkModal);

networkModal.querySelectorAll(".network-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.network;
    if (id !== activeNetwork) {
      setNetwork(id);
      showToast(`Switched to ${NETWORKS[id].label}`, "info");
    }
    closeNetworkModal();
  });
});

claimButton.addEventListener("click", claimCertificate);

progressRange.addEventListener("input", (e) => {
  renderCertificate(Number(e.target.value));
  // Reset claim state when tier changes
  txResult.classList.add("hidden");
  claimButton.textContent = "Claim Certificate On-chain";
  claimButton.classList.remove("claimed");
  claimButton.disabled = false;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeWalletModal();
    closeNetworkModal();
  }
});
