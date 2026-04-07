/**
 * DeadDrop Vault Monitor
 * Tüm kayıtlı vault'ları tarar ve eşik kontrolü yapar.
 */

const { ethers } = require("ethers");
const { sendWarningEmail, sendExecutionEmail } = require("./emailer");
const { triggerExecution, markWarning, recordDetectedActivity } = require("./executor");
const { loadActivityStore, saveActivityStore, getOwnerState } = require("./activity-store");
const ABI = require("../frontend/public/abi/DeadDrop.json");

const CONTRACT_ADDRESS = process.env.DEADDROP_CONTRACT_ADDRESS;
const WARNING_DAY_THRESHOLD = 293;
const EXECUTION_DAY_THRESHOLD = 300;
const ACTIVITY_KIND_SIGNED_TRANSACTION = 1;

async function checkAllVaults(agentWallet) {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, agentWallet);
  const provider = contract.runner.provider;
  const activityStore = loadActivityStore();

  const stats = {
    total: 0,
    warningsSent: 0,
    executions: 0,
    errors: 0,
    activitiesDetected: 0,
    autoResets: 0,
  };

  let owners;
  try {
    owners = await contract.getAllOwners();
    stats.total = owners.length;
    console.log(`  Found ${owners.length} registered vault(s)`);
  } catch (err) {
    console.error("  ❌ Failed to fetch owners:", err.message);
    return stats;
  }

  for (const owner of owners) {
    try {
      const result = await processVault(contract, provider, owner, activityStore);
      if (result === "warning") stats.warningsSent++;
      if (result === "executed") stats.executions++;
      if (result === "activity") stats.activitiesDetected++;
      if (result === "auto-reset") {
        stats.activitiesDetected++;
        stats.autoResets++;
      }
    } catch (err) {
      console.error(`  ❌ Error processing vault ${owner}:`, err.message);
      stats.errors++;
    }
  }

  saveActivityStore(activityStore);
  return stats;
}

async function processVault(contract, provider, owner, activityStore) {
  const detected = await syncDetectedActivity(contract, provider, owner, activityStore);
  const status = await contract.getVaultStatus(owner);
  const [
    active,
    executed,
    warningIssued,
    ,
    daysInactive,
    daysUntilExecution,
    vaultBalance,
  ] = status;

  if (!active || executed) {
    console.log(`  [${shortAddr(owner)}] Skipped (active: ${active}, executed: ${executed})`);
    return "skipped";
  }

  const days = Number(daysInactive);
  const balance = ethers.formatEther(vaultBalance);

  console.log(
    `  [${shortAddr(owner)}] ${days} days inactive | ${balance} XTZ | warning: ${warningIssued}`
  );

  if (detected.result === "auto-reset") {
    console.log(`  [${shortAddr(owner)}] ✅ Qualified onchain activity reset the timer`);
    return "auto-reset";
  }

  if (detected.result === "activity") {
    console.log(`  [${shortAddr(owner)}] 👀 Onchain activity detected`);
    return "activity";
  }

  if (days >= EXECUTION_DAY_THRESHOLD) {
    console.log(`  [${shortAddr(owner)}] 🔴 EXECUTION THRESHOLD REACHED`);

    const email = await getVaultEmail(contract, owner);
    const [wallets, percentages, labels] = await contract.getBeneficiaries(owner);
    const txHash = await triggerExecution(contract, owner);

    if (txHash) {
      await sendExecutionEmail({
        to: email,
        ownerAddress: owner,
        txHash,
        wallets,
        percentages,
        labels,
        totalAmount: balance,
      });
      console.log(`  [${shortAddr(owner)}] ✅ Execution complete. TX: ${txHash}`);
      return "executed";
    }
  }

  if (days >= WARNING_DAY_THRESHOLD && !warningIssued) {
    console.log(`  [${shortAddr(owner)}] ⚠️  WARNING THRESHOLD REACHED`);

    const email = await getVaultEmail(contract, owner);
    const daysRemaining = Number(daysUntilExecution);
    const txHash = await markWarning(contract, owner);

    if (txHash) {
      await sendWarningEmail({
        to: email,
        ownerAddress: owner,
        daysInactive: days,
        daysRemaining,
      });

      console.log(`  [${shortAddr(owner)}] ✅ Warning sent and recorded onchain`);
      return "warning";
    }
  }

  return "ok";
}

async function syncDetectedActivity(contract, provider, owner, activityStore) {
  const ownerState = getOwnerState(activityStore, owner);
  const latestBlock = await provider.getBlock("latest");
  const currentNonce = await provider.getTransactionCount(owner);

  if (ownerState.lastKnownNonce === null || ownerState.lastCheckedBlock === null) {
    ownerState.lastKnownNonce = currentNonce;
    ownerState.lastCheckedBlock = Number(latestBlock.number);
    return { result: "initialized" };
  }

  ownerState.lastCheckedBlock = Number(latestBlock.number);

  if (currentNonce <= ownerState.lastKnownNonce) {
    return { result: "none" };
  }

  ownerState.lastKnownNonce = currentNonce;

  const observedTimestamp = Number(latestBlock.timestamp);
  const txHash = await recordDetectedActivity(
    contract,
    owner,
    ACTIVITY_KIND_SIGNED_TRANSACTION,
    observedTimestamp,
    true
  );

  if (!txHash) {
    return { result: "none" };
  }

  ownerState.lastDetectedActivityTimestamp = observedTimestamp;
  ownerState.lastQualifiedActivityTimestamp = observedTimestamp;

  return { result: "auto-reset", observedTimestamp, txHash };
}

async function getVaultEmail(contract, owner) {
  try {
    return await contract.getVaultEmail(owner);
  } catch {
    return null;
  }
}

function shortAddr(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

module.exports = { checkAllVaults };
