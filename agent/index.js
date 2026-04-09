/**
 * LastKey Monitoring Agent — Ana Giriş Noktası
 *
 * Her 24 saatte bir tüm kayıtlı vault'ları Etherlink üzerinde tarar.
 * Eşiğe göre warning e-postası gönderir veya kalıtım kontratını tetikler.
 *
 * Çalıştırmak için: node agent/index.js
 * Test modu için:   node agent/index.js --test
 */

require("dotenv").config();
const cron = require("node-cron");
const http = require("http");
const fs = require("fs");
const path = require("path");
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
  "FRONTEND_URL",
  "ETHERLINK_EXPLORER_URL",
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
const HEALTH_PORT = Number(process.env.HEALTH_PORT || 8789);
const HEALTH_PATH = path.join(__dirname, "data", "health.json");
const healthState = {
  status: "starting",
  startedAt: new Date().toISOString(),
  lastCycleStartedAt: null,
  lastCycleCompletedAt: null,
  lastCycleStatus: null,
  lastResult: null,
  lastError: null,
};

function persistHealthState() {
  const dir = path.dirname(HEALTH_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    HEALTH_PATH,
    JSON.stringify(
      {
        ...healthState,
        uptimeSeconds: Math.floor((Date.now() - Date.parse(healthState.startedAt)) / 1000),
      },
      null,
      2
    )
  );
}

function startHealthServer() {
  const server = http.createServer((req, res) => {
    if (!req.url || (req.url !== "/health" && req.url !== "/")) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "not_found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          ok: true,
          service: "lastkey-agent",
          ...healthState,
          uptimeSeconds: Math.floor((Date.now() - Date.parse(healthState.startedAt)) / 1000),
        },
        null,
        2
      )
    );
  });

  server.listen(HEALTH_PORT, () => {
    console.log(`🩺 Health endpoint active — http://127.0.0.1:${HEALTH_PORT}/health`);
  });
}

async function startup() {
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(agentWallet.address);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🔑  LastKey Monitoring Agent — ONLINE");
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

  healthState.status = "online";
  persistHealthState();
}

async function runCycle() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] Starting vault monitoring cycle...`);
  healthState.lastCycleStartedAt = timestamp;
  healthState.lastCycleStatus = "running";
  healthState.lastError = null;
  persistHealthState();

  try {
    const result = await checkAllVaults(agentWallet);
    console.log(`[${timestamp}] Cycle complete.`);
    console.log(`  Total vaults   : ${result.total}`);
        console.log(`  Warnings sent  : ${result.warningsSent}`);
        console.log(`  Executions     : ${result.executions}`);
        console.log(`  Activities     : ${result.activitiesDetected}`);
        console.log(`  Auto resets    : ${result.autoResets}`);
        console.log(`  Errors         : ${result.errors}`);
    healthState.lastCycleCompletedAt = new Date().toISOString();
    healthState.lastCycleStatus = "ok";
    healthState.lastResult = result;
    persistHealthState();
  } catch (err) {
    console.error(`[${timestamp}] Cycle failed:`, err.message);
    healthState.lastCycleCompletedAt = new Date().toISOString();
    healthState.lastCycleStatus = "failed";
    healthState.lastError = err.message;
    persistHealthState();
  }
}

const isTestMode = process.argv.includes("--test");

startup().then(() => {
  startHealthServer();
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
