// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer, otherAccount] = await hre.ethers.getSigners();

  const deployerAddress = deployer.address;

  const contract = await hre.ethers.getContractFactory("Spaceshot");
  const deploy = await contract.deploy({
    value: hre.ethers.utils.parseEther("20"),
  });

  await deploy.deployed();

  // await deploy.deposit({ value: hre.ethers.utils.parseEther("2") });

  const balance = await deploy.getBalance(deployer.address);
  const gameBalance = await deploy.getGameBalance();
  console.log("Account Balance:", hre.ethers.utils.formatEther(balance));
  console.log("Game Balance:", gameBalance);
  console.log("Contract Address:", deploy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
