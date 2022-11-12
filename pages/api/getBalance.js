import prisma from "../../config/prisma";
export default async function getBalance(req, res) {
  const { walletAddress } = req.body;
  const balance = await prisma.players.findUnique({
    where: {
      walletAddress: walletAddress,
    },
    select: {
      balance: true,
    },
  });

  return res.status(200).send({
    status: 200,
    balance: balance.balance,
  });
}
