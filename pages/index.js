import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import { useEffect, useRef, useState, useCallback } from "react";
import { ethers } from "ethers";
import crypto from "crypto";
import GameSpace from "../components/gamespace";
import MultiPlierHistory from "../components/multiplierHistory";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";
import IntervalTimer from "../components/IntervalTimer";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [gameHash, setGameHash] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [seconds, setSeconds] = useState(20);
  const [run, setRun] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [openMetaMask, setOpenMetaMask] = useState(false);
  const [multiplierCrash, setMultiplierCrash] = useState(0);
  const [transaction, setTransaction] = useState(false);

  const [playerDetails, addPlayerDetails] = useState([]);

  const startTimer = () => {
    console.log("Run :", run);
    setRun(true);
  };
  const pauseTimer = () => {
    setRun(false);
  };

  const incrementBetAmount = () => {
    setAmount((a) => a + 1);
  };

  const decrementAmount = () => {
    if (amount <= 1) return;
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
    const contractAddress = "0xd13355fe14967853ee5B5847B8C42E06dde46710";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    if (!accounts[0]) return;

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    setClientSeed(contractAddress);

    const gameHash = await contract.getBlockhash();
    const playerCount = await contract.getPlayerCount();

    const crash = crashPointFromHash(gameHash);

    setMultiplierCrash(parseFloat(crash));

    setGameHash(gameHash);
  };
  const placeBet = async () => {
    if (amount == 0 || multiplier == 0) return;
    if (transaction) return;
    const contractAddress = "0xd13355fe14967853ee5B5847B8C42E06dde46710";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    setOpenMetaMask(true);

    try {
      setTransaction(true);
      await getBlockHash();
      console.log("Mulitplier Value:", multiplierCrash);
      const contractCall = await contract.betAmount(
        amount,
        multiplier,
        parseInt(multiplierCrash)
      );

      const res = await contractCall.wait();

      setStartGame(true);

      const events = res.events.find((event) => event.event == "returnResult");

      const [_amount, _gameMultiplier, _multiplier, profit] = events.args;

      addPlayerDetails((oldPlayers) => [
        ...oldPlayers,
        {
          player: accounts[0],
          betAmount: _amount.toNumber(),
          multiplier: _multiplier.toNumber(),
          payout: profit.toNumber(),
          gameMultiplier: multiplierCrash,
        },
      ]);

      setTransaction(false);
      console.log(events.args);
    } catch (err) {
      setTransaction(false);
      console.log(err);
    }
  };

  const endGame = async () => {
    const contractAddress = "0xd13355fe14967853ee5B5847B8C42E06dde46710";
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
    const contractAddress = "0xd13355fe14967853ee5B5847B8C42E06dde46710";
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

  // useEffect(() => {
  //   let interval;
  //   if (run === true) {
  //     interval = setInterval(() => {
  //       setSeconds((seconds) => seconds - 1);
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [run]);

  // useEffect(() => {
  //   if (seconds <= 0) {
  //     setSeconds(20);
  //     setRun(false);
  //   }
  // }, [seconds]);

  return (
    <div>
      <Header />
      {/* <MultiPlierHistory /> */}
      <GameSpace
        transaction={transaction}
        startgame={startGame}
        setRun={setRun}
        setStartGame={setStartGame}
        multiplier={multiplierCrash}
      />
      <div className="md:px-10">
        <div className="smb:px-3">
          <div className="flex md:flex-row smb:flex-col">
            <div className="border-2 h-20 md:w-96 smb:w-full border-yellow-400 px-3 py-3 rounded-md flex flex-col">
              <span className="font-VT323 text-gray-300">Amount</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-white h-10 font-VT323 outline-none bg-transparent px-2 text-2xl"
                type={"number"}
              />
            </div>
            <div className="border-2 h-20 md:w-96 smb:w-full border-yellow-400 px-3 py-3 rounded-md flex flex-col md:mt-0 smb:mt-10 md:ml-20">
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
          <div className="mt-5 flex md:flex-row smb:flex-col">
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
            <div className="md:ml-20 md:mt-0 smb:mt-10 w-96">
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
        </div>

        <div className="mt-10">
          <table className="table-body font-VT323">
            <thead className="text-gray-600">
              <tr>
                <th>Player</th>
                <th>Bet Amount</th>
                <th>Multiplier</th>
                <th>Payout</th>
                <th>Crsh</th>
              </tr>
            </thead>
            <tbody>
              {playerDetails.map((player, index) => {
                return (
                  <tr
                    className={
                      player.payout >= 1 ? `text-green-300` : `text-white`
                    }
                    key={index}
                  >
                    <td>{player.player}</td>
                    <td>{player.betAmount} SHM</td>
                    <td>x{player.multiplier}</td>
                    <td>{player.payout} SHM</td>
                    <td>x{player.gameMultiplier}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-20" />
      </div>
    </div>
  );
}
