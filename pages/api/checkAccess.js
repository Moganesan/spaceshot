import prisma from "../../config/prisma";
import jwt from "jsonwebtoken";

export default async function checkAccess(req, res) {
  const { token } = req.cookies;
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
    return res.status(403).send({
      status: 403,
      message: "Access Denied",
    });

  return res.status(200).send({
    status: 200,
    message: "Access Granted",
  });
}
