/**
 * DeadDrop Vault Monitor
 * Tüm kayıtlı vault'ları tarar ve eşik kontrolü yapar.
 */

const { ethers } = require("ethers");
const { sendWarningEmail, sendExecutionEmail } = require("./emailer");
const { triggerExecution, markWarning } = require("./executor");
const ABI = require("../frontend/public/abi/DeadDrop.json");

const CONTRACT_ADDRESS = process.env.DEADDROP_CONTRACT_ADDRESS;
const WARNING_DAY_THRESHOLD = 293;
const EXECUTION_DAY_THRESHOLD = 300;

async function checkAllVaults(agentWallet) {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, agentWallet);

  const stats = {
    total: 0,
    warningsSent: 0,
    executions: 0,
    errors: 0,
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
      const result = await processVault(contract, owner);
      if (result === "warning") stats.warningsSent++;
      if (result === "executed") stats.executions++;
    } catch (err) {
      console.error(`  ❌ Error processing vault ${owner}:`, err.message);
      stats.errors++;
    }
  }

  return stats;
}

async function processVault(contract, owner) {
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
