import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const config = {
  etherscan: {
    apiKey: {
      blast: "blast", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "blast_sepolia",
        chainId: 168587773,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://testnet.blastscan.io"
        }
      }
    ]
  },
  networks: {
    blast_sepolia: {
      url: 'https://sepolia.blast.io',
      accounts: ['8ed56c02101b24e8fdd7738db9cc60de21ec4f7fd5069fbbac05a318d9e0d94e']
    },
  },
  solidity: {
    version: "0.8.10", // Adjust this version to match your contract's pragma
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  sourcify: {
    enabled: true,
  },
};

module.exports = config;