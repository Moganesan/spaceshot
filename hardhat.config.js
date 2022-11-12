require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    shardeum: {
      url: "https://liberty20.shardeum.org/",
      chainId: 8081,
      accounts: [
        "755b276b5aab56178ee64ff33e905f03b9ff33e04ebe778fd33ece2b84bb41df",
      ],
    },
    goeril: {
      url: "https://goerli.optimism.io",
      accounts: [
        "c6d851c07dbef0e82ba820ed8624fffff2fbc70e734062ad75ed78059ac6d927",
      ],
    },
  },
};
