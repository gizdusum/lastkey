/**
 * DeadDrop Executor
 * Smart contract üzerinde agent işlemlerini gönderir.
 */

const GAS_LIMIT_WARNING = 100_000n;
const GAS_LIMIT_EXECUTE = 500_000n;
const GAS_LIMIT_ACTIVITY = 140_000n;

async function markWarning(contract, ownerAddress) {
  try {
    console.log(`    Sending markWarningIssued() for ${ownerAddress}...`);
    const tx = await contract.markWarningIssued(ownerAddress, {
      gasLimit: GAS_LIMIT_WARNING,
    });
    const receipt = await tx.wait();
    console.log(`    TX confirmed: ${receipt.hash}`);
    return receipt.hash;
  } catch (err) {
    console.error("    ❌ markWarningIssued failed:", err.message);
    return null;
  }
}

async function triggerExecution(contract, ownerAddress) {
  try {
    console.log(`    Sending executeInheritance() for ${ownerAddress}...`);
    const tx = await contract.executeInheritance(ownerAddress, {
      gasLimit: GAS_LIMIT_EXECUTE,
    });
    const receipt = await tx.wait();
    console.log(`    TX confirmed: ${receipt.hash}`);
    return receipt.hash;
  } catch (err) {
    console.error("    ❌ executeInheritance failed:", err.message);
    return null;
  }
}

async function recordDetectedActivity(contract, ownerAddress, activityKind, observedTimestamp, qualifiedReset) {
  try {
    console.log(`    Recording detected activity for ${ownerAddress}...`);
    const tx = await contract.recordDetectedActivity(
      ownerAddress,
      activityKind,
      observedTimestamp,
      qualifiedReset,
      {
        gasLimit: GAS_LIMIT_ACTIVITY,
      }
    );
    const receipt = await tx.wait();
    console.log(`    TX confirmed: ${receipt.hash}`);
    return receipt.hash;
  } catch (err) {
    console.error("    ❌ recordDetectedActivity failed:", err.message);
    return null;
  }
}

module.exports = { markWarning, triggerExecution, recordDetectedActivity };
