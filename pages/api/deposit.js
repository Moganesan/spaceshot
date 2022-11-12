import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";

export default async function deposit(req, res) {
  const { token } = req.cookies;
  const { amount } = req.body;
  if (!token) {
    return res.status(403).send({
      status: 403,
      message: "Unauthorized Request",
    });
  }

  const verify = jwt.verify(token, process.env.AUTH_TOKEN_PRIVATE_KEY);

  try {
    const player = await prisma.players.update({
      where: {
        walletAddress: verify.walletAddress,
      },
      data: {
        balance: { increment: parseFloat(amount) },
      },
    });

    return res.status(200).send({
      status: 200,
      data: {
        walletBalance: player.balance,
      },
      message: "Wallet Balance Updated",
    });
  } catch (err) {
    console.log(err);
  }
}
