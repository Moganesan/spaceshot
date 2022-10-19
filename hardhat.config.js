require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    shardeum: {
      url: "https://liberty10.shardeum.org/	",
      accounts: [
        "c6d851c07dbef0e82ba820ed8624fffff2fbc70e734062ad75ed78059ac6d927",
      ],
    },
  },
};
