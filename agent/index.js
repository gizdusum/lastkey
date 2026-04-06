/**
 * DeadDrop AI Agent — Ana Giriş Noktası
 *
 * Her 24 saatte bir tüm kayıtlı vault'ları Etherlink üzerinde tarar.
 * Eşiğe göre warning e-postası gönderir veya kalıtım kontratını tetikler.
 *
 * Çalıştırmak için: node agent/index.js
 * Test modu için:   node agent/index.js --test
 */

require("dotenv").config();
const cron = require("node-cron");
const { ethers } = require("ethers");
const { checkAllVaults } = require("./monitor");

const REQUIRED_ENV = [
  "ETHERLINK_RPC_URL",
  "AGENT_PRIVATE_KEY",
  "DEADDROP_CONTRACT_ADDRESS",
];

const OPTIONAL_ENV = [
  "OPENAI_API_KEY",
  "EMAIL_USER",
  "EMAIL_APP_PASSWORD",
];

const missingRequiredEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingRequiredEnv.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingRequiredEnv.forEach((key) => console.error(`   - ${key}`));
  process.exit(1);
}

const missingOptionalEnv = OPTIONAL_ENV.filter((key) => !process.env[key]);
if (missingOptionalEnv.length > 0) {
  console.warn("⚠️  Optional integrations are not configured yet:");
  missingOptionalEnv.forEach((key) => console.warn(`   - ${key}`));
  console.warn("   Monitoring can still run, but email/NLP features stay disabled.\n");
}

const provider = new ethers.JsonRpcProvider(process.env.ETHERLINK_RPC_URL);
const agentWallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);

async function startup() {
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(agentWallet.address);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ⚰️  DeadDrop AI Agent — ONLINE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Network  : ${network.name || "unknown"} (chainId: ${network.chainId})`);
  console.log(`Agent    : ${agentWallet.address}`);
  console.log(`Balance  : ${ethers.formatEther(balance)} XTZ`);
  console.log(`Contract : ${process.env.DEADDROP_CONTRACT_ADDRESS}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (balance === 0n) {
    console.warn("⚠️  Agent wallet has no XTZ. It cannot send transactions.");
    console.warn("   Fund agent wallet before running in production.\n");
  }
}

async function runCycle() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] Starting vault monitoring cycle...`);

  try {
    const result = await checkAllVaults(agentWallet);
    console.log(`[${timestamp}] Cycle complete.`);
    console.log(`  Total vaults   : ${result.total}`);
    console.log(`  Warnings sent  : ${result.warningsSent}`);
    console.log(`  Executions     : ${result.executions}`);
    console.log(`  Errors         : ${result.errors}`);
  } catch (err) {
    console.error(`[${timestamp}] Cycle failed:`, err.message);
  }
}

const isTestMode = process.argv.includes("--test");

startup().then(() => {
  if (isTestMode) {
    console.log("🧪 TEST MODE — Running single cycle immediately...\n");
    runCycle().then(() => {
      console.log("\n✅ Test cycle complete. Exiting.");
      process.exit(0);
    });
  } else {
    runCycle();

    cron.schedule("0 9 * * *", runCycle, {
      timezone: "UTC",
    });

    console.log("⏰ Cron scheduler active — runs daily at 09:00 UTC");
    console.log("   Press Ctrl+C to stop.\n");
  }
});
