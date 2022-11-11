import hre from "hardhat";
import ContractAbi from "../../artifacts/contracts/Spaceshot.sol/Spaceshot.json";

export default async function deposit(req, res) {
  const { token } = req.cookies;

  console.log(token);
  const contractAddress = "0xd59BAD5EA33514783E3B2822523517e9B95834f6";
  const provider = new hre.ethers.providers.JsonRpcProvider(
    "https://liberty10.shardeum.org/",
    {
      name: "Shardeum",
      chainId: 8080,
    }
  );
  const signer = provider.getSigner();

  const contract = new hre.ethers.Contract(
    contractAddress,
    ContractAbi.abi,
    signer
  );

  const balance = await contract.getBalance(walletAddress);

  res.send(hre.ethers.utils.formatEther(balance));
}
