import jwt from "jsonwebtoken";
import { ethers } from "ethers";
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

  const checkAccess = await prisma.whitelistedPlayers.findUnique({
    where: {
      walletAddress: verify.walletAddress,
    },
  });

  if (!checkAccess)
    return res.status(201).send({
      status: 201,
      message: "Unauthorized Request",
    });

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpc_url = process.env.NEXT_PUBLIC_RPC_URL;
  const network_name = process.env.NEXT_PUBLIC_NETWORK_NAME;
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);
  const provider = new ethers.providers.JsonRpcProvider(rpc_url, {
    name: network_name,
    chainId: chainId,
  });

  const signer = new ethers.Wallet(
    "755b276b5aab56178ee64ff33e905f03b9ff33e04ebe778fd33ece2b84bb41df",
    provider
  );

  const contract = new ethers.Contract(
    contractAddress,
    ContractAbi.abi,
    signer
  );

  try {
    console.log("Wallet Address", verify.walletAddress);
    const contractCall = await contract.betAmount(
      verify.walletAddress,
      ethers.utils.parseEther(amount),
      ethers.utils.parseUnits(multiplier),
      ethers.utils.parseUnits(gameMultiplier),
      {
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("150", "gwei").toString(),
        type: 1,
        accessList: [
          {
            address: verify.walletAddress,
            storageKeys: [
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            ],
          },
          {
            address: contractAddress,
            storageKeys: [
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            ],
          },
        ],
      }
    );

    const contractRes = await contractCall.wait();

    const events = contractRes.events.find(
      (event) => event.event == "returnResult"
    );

    const [_amount, _gameMultiplier, _multiplier, profit] = events.args;

    const _profit = parseFloat(ethers.utils.formatUnits(profit));

    const betAmount = parseFloat(ethers.utils.formatEther(_amount));

    if (_profit == 0) {
      await prisma.players.update({
        where: {
          walletAddress: verify.walletAddress,
        },
        data: {
          balance: {
            decrement: betAmount,
          },
        },
      });
    } else {
      await prisma.players.update({
        where: {
          walletAddress: verify.walletAddress,
        },
        data: {
          balance: {
            increment: amount * ethers.utils.formatUnits(_multiplier),
          },
        },
      });
    }

    console.log("Transaction is Completed");

    console.log("Profit", ethers.utils.formatEther(profit));

    return res.status(200).send({
      status: 200,
      data: {
        amount: ethers.utils.formatEther(_amount),
        multiplier: ethers.utils.formatUnits(_multiplier),
        crash: ethers.utils.formatUnits(_gameMultiplier),
        profit:
          parseInt(ethers.utils.formatEther(profit)) !== 0
            ? amount * ethers.utils.formatUnits(_multiplier)
            : 0,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 500,
      error: err,
    });
  }
}
