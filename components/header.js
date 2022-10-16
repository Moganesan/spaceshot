import MultiPlierHistory from "./multiplierHistory";
const Header = () => {
  return (
    <div className="h-24 px-10 flex items-center border-b-2">
      <div className="mr-56">
        <h1 className="text-yellow-400 text-3xl">SPACESHOT</h1>
      </div>
      <MultiPlierHistory />
    </div>
  );
};

export default Header;
