import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import GameSpace from "../components/gamespace";
import MultiPlierHistory from "../components/multiplierHistory";

export default function Home() {
  return (
    <div>
      <Header />
      <MultiPlierHistory />
      <GameSpace />
      <div className="px-10">
        <div className="flex">
          <div className="border-2 w-96 border-yellow-400 px-3 py-3 rounded-md flex flex-col">
            <span className="font-VT323 text-gray-300">Amount</span>
            <input
              className="text-white h-10 font-VT323 outline-none bg-transparent px-2 text-2xl"
              type={"number"}
            />
          </div>
          <div className="border-2 w-96 border-yellow-400 px-3 py-3 rounded-md flex flex-col ml-20">
            <span className="font-VT323 text-gray-300">Auto Cashout</span>
            <div className="flex items-center">
              <span className="font-VT323 text-2xl ml-2">X</span>
              <input
                type={"number"}
                className="text-white h-10 outline-none bg-transparent font-VT323 text-2xl px-2"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex">
          <div className="flex items-center w-96 justify-between">
            <div>
              <button className="button font-VT323">MIN</button>
            </div>
            <div>
              <button className="button font-VT323">-</button>
            </div>
            <div>
              <button className="button font-VT323">+</button>
            </div>
            <div>
              <button className="button font-VT323">MAX</button>
            </div>
          </div>
          <div className="ml-20 w-96">
            <button className="button2">PLACE BET</button>
          </div>
        </div>
        <div className="mt-10">
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
        </div>
      </div>
    </div>
  );
}
