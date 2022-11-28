import Header from "../components/header";
const About = () => {
  return (
    <div>
      <Header />
      <div className="px-10 mt-10">
        <h1 className="font-bold text-3xl">Get ready for the rocket launch!</h1>
        <div className="mt-5">
          <h1 className="font-bold text-xl">About</h1>
          <p>
            Spaceshot is a prediction game that&lsquo;s simple, fun, and fair.
            <br /> All you need to do is predict the distance of the rocket
            before it randomly crashes.
          </p>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-xl">Is it fun?</h1>
          <p>
            Yes, it is. The rush of winning and the satisfaction of having your
            money make the benefits even sweeter than before, <br /> acting as a
            dopamine booster that makes you want to play all the time.
          </p>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-xl">
            What if people lose their money?
          </h1>
          <p>
            As we previously said, we have developed a number of tokenomics
            strategies to prevent players from using up all of the cash in their
            <br />
            wallets by setting a cap on the maximum investment amount based on
            the balance of their wallet. This prevents players from using up all
            of their funds in a single game.
          </p>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-xl">Fair play</h1>
          <p>
            We don&lsquo;t cheat, we don&lsquo;t use bots, and we don&lsquo;t
            have any unfair advantage.
            <br /> All crash outcomes can be proven fair.
          </p>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-xl">Private data</h1>
          <p>
            We don&lsquo;t collect any information except your public Shardeum
            address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
