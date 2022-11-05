import anime from "animejs";
import { useRef, useState, useEffect } from "react";
import SpaceCraft from "./spacecraft";
import { ethers } from "ethers";
import Lottie from "lottie-react";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";
import { useDispatch, useSelector } from "react-redux";
import { stopGame } from "../store/features/uiSlice";
import { data } from "autoprefixer";

const GameSpace = ({ transaction, multiplier }) => {
  const animationRef = useRef(null);

  const dispatch = useDispatch();

  const [currentMultiplier, setCurrentMultiplier] = useState(0);

  const gameState = useSelector((state) => state.ui["startGame"]);

  const checkGameStatus = async () => {
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

    try {
      const getGameStatus = await contract.getGameStatus();
      const contractResponse = await contract.checkGameStatus();
      console.log(contractResponse);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    animationRef.current = anime({
      targets: ".spacecraft",
      translateX: 720,
      delay: function (el, i) {
        return i * 1000;
      },
      direction: "normal",
      easing: "easeInOutSine",
      complete: function () {
        animationRef.current = anime({
          targets: ".spacecraft",
          translateY: -60,
          loop: true,
          delay: function (el, i) {
            return i * 100;
          },
          direction: "alternate",
          easing: "easeInOutSine",
          complete: function () {
            console.log("Animation Completed");
          },
        });
      },
    });
  }, [gameState]);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      if (multiplier <= currentMultiplier) {
        setCurrentMultiplier((m) => multiplier - 0.1);
        clearInterval(interval);
        setTimeout(() => {
          dispatch(stopGame());
        }, 1000);
      }
      setCurrentMultiplier((m) => m + 0.1);
    }, 500);

    return () => clearInterval(interval);
  }, [currentMultiplier]);

  return (
    <>
      <div
        style={{ height: 500 }}
        className="border-2 text-yellow-400 relative h-96 smb:mx-4 md:mx-10 my-10  overflow-hidden rounded-lg border-yellow-400"
      >
        {multiplier}
        <video autoPlay="true" loop="true" muted id="gamebackground">
          <source src="/bge.mp4" type="video/mp4" />
        </video>

        <div className="spacecraft">
          <SpaceCraft />
        </div>
        <div className="absolute multiplier flex items-center top-72">
          <span className="font-VT323 multiplier-text text-6xl text-white">
            {currentMultiplier.toString()}
          </span>
          <span className="ml-1 text-6xl font-VT323">x</span>
        </div>
      </div>
    </>
  );
};

export default GameSpace;
