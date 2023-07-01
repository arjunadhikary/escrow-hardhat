require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/q6rKG-ilP2jaVLhY0ShuPp_oDNw7S8xW",
      accounts: ["59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"]
    },
  },
  paths: {
    artifacts: "./app/src/artifacts",
  }
};
