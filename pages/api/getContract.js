import prisma from "../../config/prisma";

export default async function getContract(req, res) {
  const contractAddress = await prisma.contracts.findMany({
    take: 1,
    orderBy: {
      deployedAt: "desc",
    },
  });

  return res.status(200).send({
    status: 200,
    contractAddress: contractAddress,
  });
}
