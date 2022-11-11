import jwt from "jsonwebtoken";
import hre from "hardhat";
import prisma from "../../config/prisma";
import ContractAbi from "../../artifacts/contracts/Spaceshot.sol/Spaceshot.json";

export default async function betAmount(req, res) {
  const { token } = req.cookies;
  const { amount, multiplier, gameMultiplier } = req.body;
  if (!token)
    return res.status(403).send({
      status: 403,
      message: "Unauthorized Request",
    });

  const verify = jwt.verify(token, process.env.AUTH_TOKEN_PRIVATE_KEY);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpc_url = process.env.RPC_URL;
  const provider = new hre.ethers.providers.JsonRpcProvider(rpc_url, {
    name: "Shardeum",
    chainId: 8080,
  });

  const signer = new hre.ethers.Wallet(
    "755b276b5aab56178ee64ff33e905f03b9ff33e04ebe778fd33ece2b84bb41df",
    provider
  );
  const contract = new hre.ethers.Contract(
    contractAddress,
    ContractAbi.abi,
    signer
  );

  console.log(verify.walletAddress);
  console.log(amount);
  console.log(multiplier);
  console.log(gameMultiplier);
  try {
    const contractCall = await contract.betAmount(
      verify.walletAddress.toLowerCase(),
      hre.ethers.utils.parseEther(amount.toString()),
      hre.ethers.utils.parseUnits(multiplier.toString()),
      hre.ethers.utils.parseUnits(gameMultiplier.toString())
    );

    const res = await contractCall.wait();

    const events = res.events.find((event) => event.event == "returnResult");

    const [_amount, _gameMultiplier, _multiplier, profit] = events.args;

    console.log(_amount);
    return res.status(200).send({
      status: 200,
      data: {
        amount: hre.ethers.utils.parseEther(_amount),
        multiplier: hre.ethers.utils.parseUnits(_multiplier),
        crash: hre.ethers.utils.parseUnits(_gameMultiplier),
        profit: hre.ethers.utils.parseUnits(profit),
      },
    });
  } catch (err) {
    console.log(err);
  }
}
