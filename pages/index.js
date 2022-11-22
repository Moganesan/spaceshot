import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import { useEffect, useRef, useState, useCallback } from "react";
import { BigNumber, ethers } from "ethers";
import crypto from "crypto";
import GameSpace from "../components/gamespace";
import WaitingSpace from "../components/waitingSpace";
import MultiPlierHistory from "../components/multiplierHistory";
import {
  startGame,
  stopGame,
  setMultiplier,
  resetMultiplier,
} from "../store/features/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";
import IntervalTimer from "../components/IntervalTimer";
import {
  MinButton1,
  MinButton2,
  AddButton1,
  AddButton2,
  MinusButton1,
} from "../public/gameassets/gameIcons";
import jwt from "jsonwebtoken";
import axios from "../config/axios";
import { ToastProvider } from "react-toast-notifications";
import {
  setErrorMessage,
  setSuccessMessage,
  setInfoMessage,
} from "../store/features/alertMessageSlice";
import { ToastPortal } from "../components/ToastPortal";

export default function Home({ auth, walletAddress, balance }) {
  const [amount, setAmount] = useState(1);
  const [multiplier, SetMultiplier] = useState(0);
  const [clientSeed, setClientSeed] = useState("");
  const [seconds, setSeconds] = useState(20);
  const [run, setRun] = useState(false);
  const [openMetaMask, setOpenMetaMask] = useState(false);
  const gameState = useSelector((state) => state.ui["startGame"]);
  const [transaction, setTransaction] = useState(false);
  const [multiplierCrash, setMultiplierCrash] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);

  const dispatch = useDispatch();

  const [playerDetails, addPlayerDetails] = useState([]);

  const toastRef = useRef();

  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    if (alert.status == true)
      toastRef.current.addMessage({ mode: alert.mode, message: alert.message });
  }, [alert]);

  const startTimer = () => {
    console.log("Run :", run);
    setRun(true);
  };
  const pauseTimer = () => {
    setRun(false);
  };

  const incrementBetAmount = () => {
    setAmount((a) => parseInt(a) + 1);
  };

  const decrementAmount = () => {
    if (amount <= 1) return;
    setAmount((a) => parseInt(a) - 1);
  };

  const minBetAmount = () => {
    setAmount(1);
  };

  const maxBetAmount = () => {
    setAmount(10);
  };

  function crashPointFromHash(serverSeed) {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    console.log("Contract Address", contractAddress);
    const hash = crypto
      .createHmac("sha256", serverSeed)
      .update(contractAddress)
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
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    if (!accounts[0]) return;

    setClientSeed(contractAddress);
    const gameHash = (await provider.getBlock("latest")).hash;

    const crash = crashPointFromHash(gameHash);
    setMultiplierCrash(crash);
    return crash;
  };
  const getGameBalance = async () => {
    const contractAddress = "0xd59BAD5EA33514783E3B2822523517e9B95834f6";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    const gameBalane = await contract.getBalance(accounts[0]);
    console.log("Game Balance", gameBalane);
  };
  const placeBet = async () => {
    if (amount == 0 || multiplier == 0) return;
    if (amount > 5 && multiplier > 100)
      dispatch(
        setInfoMessage({
          status: "200",
          message: "Max Amount:5 Max Multiplier: 100",
        })
      );
    if (transaction) return;

    const multiplierCrash = await getBlockHash();

    console.log(walletAddress);

    try {
      setTransaction(true);
      const res = await axios.post("/betAmount", {
        walletAddress,
        amount: amount.toString(),
        multiplier: multiplier.toString(),
        gameMultiplier: multiplierCrash.toString(),
      });

      const balanceRes = await axios.post("/getBalance", {
        walletAddress: walletAddress,
      });
      balance = balanceRes;
      const { data } = res.data;
      addPlayerDetails((oldPlayers) => [
        ...oldPlayers,
        {
          player: walletAddress,
          betAmount: data.amount,
          multiplier: data.multiplier,
          payout: data.profit,
          gameMultiplier: data.crash,
        },
      ]);

      setTransaction(false);
      dispatch(startGame());
    } catch (err) {
      setTransaction(false);
      dispatch(setErrorMessage({ code: err.code, message: err.message }));
    }
  };

  // const placeBet = async () => {
  //   // getGameBalance();
  //   if (amount == 0 || multiplier == 0) return;
  //   if (transaction) return;
  //   const multiplierCrash = await getBlockHash();
  //   const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const accounts = await provider.listAccounts();
  //   const signer = provider.getSigner();
  //   const network = await provider.getNetwork();

  //   const contract = new ethers.Contract(
  //     contractAddress,
  //     ContractAbi.abi,
  //     signer
  //   );

  //   setOpenMetaMask(true);

  //   try {
  //     setTransaction(true);

  //     console.log("Multiplier:", multiplier);
  //     console.log(
  //       "Multiplier Crash",
  //       Number(ethers.utils.parseUnits(multiplierCrash.toString()))
  //     );

  //     const contractCall = await contract.betAmount(
  //       walletAddress,
  //       ethers.utils.parseEther(amount.toString()),
  //       ethers.utils.parseUnits(multiplier.toString()),
  //       ethers.utils.parseUnits(multiplierCrash.toString())
  //     );

  //     const res = await contractCall.wait();

  //     const events = res.events.find((event) => event.event == "returnResult");

  //     const [_amount, _gameMultiplier, _multiplier, profit] = events.args;

  //     addPlayerDetails((oldPlayers) => [
  //       ...oldPlayers,
  //       {
  //         player: accounts[0],
  //         betAmount: ethers.utils.formatEther(_amount),
  //         multiplier: ethers.utils.formatUnits(_multiplier),
  //         payout: ethers.utils.formatUnits(profit),
  //         gameMultiplier: ethers.utils.formatUnits(_gameMultiplier),
  //       },
  //     ]);

  //     setTransaction(false);
  //     dispatch(startGame());
  //   } catch (err) {
  //     setTransaction(false);
  //     setMultiplier(0);
  //     console.log(err);
  //   }
  // };

  const endGame = async () => {
    const contractAddress = "0xd59BAD5EA33514783E3B2822523517e9B95834f6";
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
      await contract.endGame(multiplier);
    } catch (err) {
      console.log(err);
    }
  };

  const getGameResult = async () => {
    const contractAddress = "0xd59BAD5EA33514783E3B2822523517e9B95834f6";
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
      const result = await contract.getGameResult();
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

  const checkAccounts = async () => {
    const contractAddress = "0xd59BAD5EA33514783E3B2822523517e9B95834f6";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    if (!accounts[0]) {
      setWalletAddress("");
    } else {
      const contract = new ethers.Contract(
        contractAddress,
        ContractAbi.abi,
        signer
      );

      console.log("Wallet Address:", accounts[0]);

      const balance = await contract.getBalance(accounts[0]);
      setWalletAddress(accounts[0]);
    }
  };

  return (
    <ToastProvider>
      <ToastPortal ref={toastRef} autoClose={true} />
      <Header walletAddress={walletAddress} balance={balance} auth={auth} />
      <div>
        <div className="flex md:flex-row-reverse smb:flex-col">
          <div style={{ flex: 1 }}>
            {gameState ? (
              <GameSpace
                transaction={transaction}
                setRun={setRun}
                multiplier={multiplierCrash}
              />
            ) : (
              <WaitingSpace transaction={transaction} />
            )}
          </div>

          <div className="md:px-10">
            <div className="smb:px-3">
              <div>
                <div className="flex flex-col">
                  <div className="smb:mt-10">
                    <div className="border-2 h-20 md:w-96 smb:w-full border-yellow-400 px-3 py-3 rounded-md flex flex-col">
                      <span className="font-VT323 text-gray-300">Amount</span>
                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-white h-10 font-VT323 outline-none bg-transparent px-2 text-2xl"
                        type={"number"}
                      />
                    </div>
                    <div className="flex items-center w-96 justify-between">
                      <div>
                        <button
                          onClick={minBetAmount}
                          className="relative font-VT323"
                        >
                          <MinButton1 />
                          <span className="absolute center">MIN</span>
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={decrementAmount}
                          className="relative font-VT323"
                        >
                          <MinusButton1 />
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={incrementBetAmount}
                          className="relative font-VT323"
                        >
                          <AddButton1 />
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={maxBetAmount}
                          className="relative font-VT323"
                        >
                          <MinButton1 />
                          <span className="absolute center">MAX</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="border-2 h-20 md:w-96 smb:w-full border-yellow-400 px-3 py-3 rounded-md flex flex-col">
                      <div>
                        <span className="font-VT323 text-gray-300">
                          Predicted Multiplier
                        </span>
                        <div className="flex items-center">
                          <span className="font-VT323 text-2xl ml-2">X</span>
                          <input
                            onChange={(e) => SetMultiplier(e.target.value)}
                            value={multiplier}
                            type={"number"}
                            className="text-white h-10 outline-none bg-transparent font-VT323 text-2xl px-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-10">
                      <div className="w-full">
                        {!gameState ? (
                          <button
                            className={`button3 anima ${
                              transaction && "animate-pulse"
                            }`}
                            onClick={() => placeBet()}
                          >
                            {multiplier} PREDICT
                          </button>
                        ) : (
                          <button className="button2 cursor-wait">
                            Wait FOR NEXT ROUND
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 px-10">
          <table className="table-body font-VT323">
            <thead className="text-gray-600">
              <tr>
                <th>Player</th>
                <th>Predicted Amount</th>
                <th>Multiplier</th>
                <th>Payout</th>
                <th>Crsh</th>
              </tr>
            </thead>
            {!gameState && (
              <tbody>
                {playerDetails.map((player, index) => {
                  return (
                    <tr
                      className={
                        player.payout >= 1 ? `text-green-300` : `text-red-300`
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
            )}
          </table>
        </div>
      </div>
    </ToastProvider>
  );
}

export async function getServerSideProps({ req, res }) {
  const { token } = req.cookies;
  if (!token) {
    return {
      props: {
        auth: false,
        walletAddress: "",
        balance: "0",
      },
    };
  }
  const verify = jwt.verify(token, process.env.AUTH_TOKEN_PRIVATE_KEY);
  const balance = await axios.post("/getBalance", {
    walletAddress: verify.walletAddress,
  });

  return {
    props: {
      auth: verify ? true : false,
      walletAddress: verify ? verify.walletAddress : "",
      balance: verify ? balance.data.balance : "0",
    },
  };
}
