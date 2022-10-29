import anime from "animejs";
import { useRef, useState, useEffect } from "react";
import SpaceCraft from "./spacecraft";
import { ethers } from "ethers";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";

const GameSpace = () => {
  const animationRef = useRef(null);
  const multiplierRef = useRef(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(0);

  const checkGameStatus = async () => {
    const contractAddress = "0x54c512d21c71a8f6f6edD45A23fA9196c63f825d";
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
      await contract.startNewGame();
      const getGameStatus = await contract.getGameStatus();
      const contractResponse = await contract.checkGameStatus();
      console.log(contractResponse);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkGameStatus();
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
      textContent: 400,
      easing: "easeInOutQuad",
      round: 1 / 5,
      duration: 5000 ? 5000 : 4000,
    });
  }, []);
  return (
    <div
      style={{ height: 500 }}
      className="border-2 text-yellow-400 relative h-96 mx-10 my-10  overflow-hidden rounded-lg border-yellow-400"
    >
      <video autoPlay="true" muted id="gamebackground">
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
  );
};

export default GameSpace;
