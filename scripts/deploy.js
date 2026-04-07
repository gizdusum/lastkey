const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  const agentAddress = process.env.AGENT_ADDRESS;
  if (!agentAddress) {
    throw new Error("AGENT_ADDRESS environment variable is not set in .env");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  LastKey — Etherlink Deploy");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Deployer address : ${deployer.address}`);
  console.log(`Agent address    : ${agentAddress}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance : ${ethers.formatEther(balance)} XTZ`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (balance === 0n) {
    throw new Error("Deployer wallet has no XTZ. Get testnet XTZ from Etherlink faucet first.");
  }

  console.log("\nDeploying LastKey contract...");
  const DeadDrop = await ethers.getContractFactory("DeadDrop");
  const contract = await DeadDrop.deploy(agentAddress);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const explorerBase = process.env.ETHERLINK_EXPLORER_URL || "https://shadownet.explorer.etherlink.com";

  console.log("\n✅ LastKey deployed successfully!");
  console.log(`Contract address : ${contractAddress}`);
  console.log(`Explorer URL     : ${explorerBase}/address/${contractAddress}`);

  const abiDir = path.join(__dirname, "../frontend/public/abi");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  const artifact = await ethers.getContractFactory("DeadDrop");
  const abi = JSON.parse(artifact.interface.formatJson());
  fs.writeFileSync(path.join(abiDir, "DeadDrop.json"), JSON.stringify(abi, null, 2));
  fs.writeFileSync(path.join(abiDir, "LastKey.json"), JSON.stringify(abi, null, 2));

  const deploymentInfo = {
    contractAddress,
    agentAddress,
    deployer: deployer.address,
    network: "Etherlink Shadownet Testnet",
    chainId: Number(process.env.NEXT_PUBLIC_ETHERLINK_CHAIN_ID || 127823),
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(__dirname, "../deployment.json"), JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📁 Files saved:");
  console.log("  - frontend/public/abi/DeadDrop.json");
  console.log("  - frontend/public/abi/LastKey.json");
  console.log("  - deployment.json");

  console.log("\n⚡ Next step:");
  console.log("  Add to your .env file:");
  console.log(`  DEADDROP_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`  NEXT_PUBLIC_DEADDROP_ADDRESS=${contractAddress}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((error) => {
  console.error("\n❌ Deploy failed:", error.message);
  process.exit(1);
});
