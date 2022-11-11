import prisma from "../../config/prisma";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

export default async function login(req, res) {
  const { walletAddress } = req.body;

  const method = req.method;
  if (method !== "POST")
    return res.status(400).send({
      status: 404,
      message: "Invalid Request",
    });
  console.log(walletAddress);

  if (!walletAddress)
    return res.status(401).json({
      status: 401,
      message: "Invalid Wallet Address",
    });

  const checkUser = await prisma.players.findUnique({
    where: {
      walletAddress: walletAddress,
    },
  });

  if (!checkUser) {
    const newUser = await prisma.players.create({
      data: {
        balance: 0,
        walletAddress: walletAddress,
      },
    });

    const token = await jwt.sign(
      {
        pid: newUser.id,
        walletAddress: newUser.walletAddress,
      },
      process.env.AUTH_TOKEN_PRIVATE_KEY,
      { expiresIn: "1d" }
    );

    await prisma.sessions.create({
      data: {
        token: token,
        pid: newUser.id,
      },
    });

    setCookie("token", token, {
      req,
      res,
      httpOnly: true,
      maxAge: 60 * 6 * 24,
    });

    return res
      .status(200)
      .json({ status: 200, data: newUser, message: "Login Success" });
  }

  const token = await jwt.sign(
    {
      pid: checkUser.id,
      walletAddress: checkUser.walletAddress,
    },
    process.env.AUTH_TOKEN_PRIVATE_KEY,
    { expiresIn: "1d" }
  );

  const checkSession = await prisma.sessions.findUnique({
    where: {
      pid: checkUser.id,
    },
  });

  if (checkSession)
    await prisma.sessions.delete({
      where: {
        pid: checkUser.id,
      },
    });

  await prisma.sessions.create({
    data: {
      token: token,
      pid: checkUser.id,
    },
  });

  setCookie("token", token, {
    req,
    res,
    httpOnly: true,
    maxAge: 60 * 6 * 24,
  });

  res
    .status(200)
    .json({ status: 200, data: checkUser, message: "Login Success" });
}
