import anime from "animejs";
import { useRef, useState, useEffect } from "react";
import SpaceCraft from "./spacecraft";
import { ethers } from "ethers";
import RocketAnimation from "../public/rocketAnimation.json";
import Lottie from "lottie-react";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";

const GameSpace = ({ multiplier, startgame }) => {
  const animationRef = useRef(null);
  const multiplierRef = useRef(null);
  const timerRef = useRef(null);
  const [timer, setTimer] = useState(10);

  const [multiplierValue, setMultiplier] = useState(0);

  const [currentMultiplier, setCurrentMultiplier] = useState(0);

  console.log("Game Multiplier Value");

  const checkGameStatus = async () => {
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
      const getGameStatus = await contract.getGameStatus();
      const contractResponse = await contract.checkGameStatus();
      console.log(contractResponse);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setMultiplier(multiplier);
    if (!startgame) {
      timerRef.current = anime({
        targets: ".timer-text",
        textContent: 0,
        easing: "easeInOutQuad",
        round: 1,
        duration: 10000,
      });
    } else {
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
      multiplierRef.current = anime({
        targets: ".multiplier-text",
        textContent: multiplier,
        endDelay: 20000,
        easing: "easeInOutQuad",
        round: 2,
        duration: 10000,
      });
    }
  }, [startgame]);

  return (
    <>
      {startgame ? (
        <div
          style={{ height: 500 }}
          className="border-2 text-yellow-400 relative h-96 mx-10 my-10  overflow-hidden rounded-lg border-yellow-400"
        >
          <video autoPlay="true" loop="true" muted id="gamebackground">
            <source src="/bge.mp4" type="video/mp4" />
          </video>

          <div className="spacecraft">
            <SpaceCraft />
          </div>
          <div className="absolute multiplier flex items-center top-72">
            <span className="font-VT323 multiplier-text text-6xl text-white">
              {currentMultiplier}
            </span>
            <span className="ml-1 text-6xl font-VT323">x</span>
          </div>
        </div>
      ) : (
        <div
          style={{ height: 500 }}
          className="border-2 text-yellow-400 relative h-96 mx-10 my-10 flex items-center justify-center  overflow-hidden rounded-lg border-yellow-400"
        >
          <div className="w-48 h-48">
            <Lottie animationData={RocketAnimation} loop={true} />
            <span className="text-green-400 font-VT323 text-2xl font-bold">
              Round starts in <span className="timer-text">{timer}</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default GameSpace;
