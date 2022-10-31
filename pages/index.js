import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import crypto from "crypto";
import GameSpace from "../components/gamespace";
import MultiPlierHistory from "../components/multiplierHistory";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [gameHash, setGameHash] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [startGame, setStartGame] = useState(false);
  const [multiplierCrash, setMultiplierCrash] = useState(0);

  const incrementBetAmount = () => {
    setAmount((a) => a + 1);
  };

  const decrementAmount = () => {
    setAmount((a) => a - 1);
  };

  const minBetAmount = () => {
    setAmount(1);
  };

  const maxBetAmount = () => {
    setAmount(50);
  };

  function crashPointFromHash(serverSeed) {
    const hash = crypto
      .createHmac("sha256", serverSeed)
      .update(clientSeed)
      .digest("hex");

    const hs = parseInt(100 / 5); // 5% house edge
    if (divisible(hash, hs)) return 1;

    const h = parseInt(hash.slice(0, 52 / 4), 16);
    const e = Math.pow(2, 52);
    return Math.floor((100 * e - h) / (e - h)) / 100.0;
  }

  function divisible(hash, mod) {
    var val = 0;
    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4)
      val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    return val === 0;
  }

  const getBlockHash = async () => {
    const contractAddress = "0xD7746beC4f562b4c6eD610417858f97175Fe6854";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    setClientSeed(contractAddress);

    const gameHash = await contract.getBlockhash();
    const playerCount = await contract.getPlayerCount();

    console.log("Player Count:", playerCount.toNumber());

    console.log("Game Hash", gameHash);
    const crash = crashPointFromHash(gameHash);

    console.log("Crash", crash);
    console.log("Multiplier Crash Vlaue", crash);
    setMultiplierCrash(parseFloat(crash));

    setGameHash(gameHash);
  };
  const placeBet = async () => {
    const contractAddress = "0xD7746beC4f562b4c6eD610417858f97175Fe6854";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    try {
      console.log(amount, multiplier, multiplierCrash);
      const contractCall = await contract.betAmount(
        amount,
        multiplier,
        parseInt(multiplierCrash)
      );

      const res = await contractCall.wait();

      const events = res.events.find((event) => event.event == "returnResult");

      const [_amount, _multiplier, profit] = events.args;

      console.log(events.args);
    } catch (err) {
      console.log(err);
    }
  };

  const endGame = async () => {
    const contractAddress = "0xD7746beC4f562b4c6eD610417858f97175Fe6854";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    console.log("Call Game Status");

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    try {
      await contract.endGame(multiplier);
    } catch (err) {
      console.log(err);
    }
  };

  const getGameResult = async () => {
    const contractAddress = "0xD7746beC4f562b4c6eD610417858f97175Fe6854";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    console.log("Call Game Status");

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    try {
      const result = await contract.getGameResult();
      console.log("Game Result:", result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlockHash();
    const gameStartInternal = setInterval(() => {
      setStartGame((c) => !c);
      getBlockHash();
    }, 10000);

    return () => {
      clearInterval(gameStartInternal);
    };
  }, []);
  return (
    <div>
      <Header />
      <MultiPlierHistory />
      <GameSpace startgame={startGame} multiplier={multiplierCrash} />
      <div className="px-10">
        <div className="flex">
          <div className="border-2 w-96 border-yellow-400 px-3 py-3 rounded-md flex flex-col">
            <span className="font-VT323 text-gray-300">Amount</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-white h-10 font-VT323 outline-none bg-transparent px-2 text-2xl"
              type={"number"}
            />
          </div>
          <div className="border-2 w-96 border-yellow-400 px-3 py-3 rounded-md flex flex-col ml-20">
            <span className="font-VT323 text-gray-300">Auto Cashout</span>
            <div className="flex items-center">
              <span className="font-VT323 text-2xl ml-2">X</span>
              <input
                onChange={(e) => setMultiplier(e.target.value)}
                value={multiplier}
                type={"number"}
                className="text-white h-10 outline-none bg-transparent font-VT323 text-2xl px-2"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex">
          <div className="flex items-center w-96 justify-between">
            <div>
              <button onClick={minBetAmount} className="button font-VT323">
                MIN
              </button>
            </div>
            <div>
              <button onClick={decrementAmount} className="button font-VT323">
                -
              </button>
            </div>
            <div>
              <button
                onClick={incrementBetAmount}
                className="button font-VT323"
              >
                +
              </button>
            </div>
            <div>
              <button onClick={maxBetAmount} className="button font-VT323">
                MAX
              </button>
            </div>
          </div>
          <div className="ml-20 w-96">
            {!startGame ? (
              <button className="button3" onClick={() => placeBet()}>
                PLACE BET
              </button>
            ) : (
              <button className="button2 cursor-wait">
                Wait FOR NEXT ROUND
              </button>
            )}
          </div>
        </div>

        {/* <div className="mt-10">
          <span className="font-VT323 px-10 border-2 py-5 border-yellow-400">
            ALL PLAYERS
          </span>
          <table className="table-body font-VT323">
            <thead className="text-gray-600">
              <tr>
                <th>Player</th>
                <th>Bet Amount</th>
                <th>Multiplier</th>
                <th>Payout</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Moganesan</td>
                <td>0.5 SHM</td>
                <td>x3.00</td>
                <td>2.38 SHM</td>
              </tr>
              <tr>
                <td>Moganesan</td>
                <td>0.5 SHM</td>
                <td>x3.00</td>
                <td>2.38 SHM</td>
              </tr>
            </tbody>
          </table>
        </div> */}

        <div className="mt-20" />
      </div>
    </div>
  );
}
