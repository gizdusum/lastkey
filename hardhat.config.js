require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    etherlink: {
      url: process.env.ETHERLINK_RPC_URL || "https://node.shadownet.etherlink.com",
      chainId: Number(process.env.NEXT_PUBLIC_ETHERLINK_CHAIN_ID || 127823),
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      gasPrice: "auto",
      timeout: 60000
    }
  },
  etherscan: {
    apiKey: {
      etherlink: "no-api-key-needed"
    },
    customChains: [
      {
        network: "etherlink",
        chainId: Number(process.env.NEXT_PUBLIC_ETHERLINK_CHAIN_ID || 127823),
        urls: {
          apiURL: process.env.ETHERLINK_EXPLORER_API_URL || "https://shadownet.explorer.etherlink.com/api",
          browserURL: process.env.ETHERLINK_EXPLORER_URL || "https://shadownet.explorer.etherlink.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
