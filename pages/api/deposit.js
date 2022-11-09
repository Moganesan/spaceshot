import provider from "@truffle/hdwallet-provider";
import contract from "../../artifacts/contracts/Spaceshot.sol/Spaceshot.json";
import web3 from "web3";

export default async function deposit(req, res) {
  console.log(req.body);
}
