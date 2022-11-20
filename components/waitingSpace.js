import RocketAnimation from "../public/rocketAnimation.json";
import Lottie from "lottie-react";

const WaitingSpace = ({ transaction }) => {
  return (
    <div
      style={{ height: 500 }}
      className="border-2 text-yellow-400 relative h-96 smb:px-3 mr-10 flex items-center justify-center flex-col  overflow-hidden rounded-lg border-yellow-400"
    >
      <div className="w-48 h-48">
        <Lottie animationData={RocketAnimation} loop={true} />
      </div>
      <span className="text-green-400 font-VT323 text-2xl font-bold">
        {transaction
          ? "wait for completing transaction"
          : "Make New Prediction for starting new game"}
      </span>
    </div>
  );
};

export default WaitingSpace;
