import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";


const config = {
  etherscan: {
    apiKey: {
      blast: "blast", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/mainnet/evm/81457/etherscan",
          browserURL: "https://blastscan.io"
        }
      }
    ]
  },
  networks: {
    blast: {
      url: 'https://lingering-indulgent-replica.blast-mainnet.quiknode.pro/6667a8f4be701cb6549b415d567bc706fb2f13a8/',
      accounts: ['8ed56c02101b24e8fdd7738db9cc60de21ec4f7fd5069fbbac05a318d9e0d94e']
    },
  },
  solidity: {
    version: "0.8.16", // Adjust this version to match your contract's pragma
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