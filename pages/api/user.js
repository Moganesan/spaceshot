import prisma from "../../config/prisma";
export default async function userhandler(req, res) {
  const method = req.method;
  console.log("Response from user route");
  if (method == "POST") {
    const { walletAddress, balance } = req.body;
    try {
      await prisma.players.create({
        data: {
          walletAddress: walletAddress,
          balance: parseInt(balance),
        },
      });
      res.status(200).send({
        status: 200,
        message: "New User Created Successfully",
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(404).send({
      status: 400,
      message: "Invalid Request",
    });
  }
}
