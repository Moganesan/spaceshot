import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { Switch } from "@headlessui/react";
import { ProfileIcon, MenuIcon, SettingsIcon } from "../components/icons";
import axios from "../config/axios";
import {
  setSuccessMessage,
  setErrorMessage,
} from "../store/features/alertMessageSlice";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";
import { useDispatch } from "react-redux";

const Header = ({ walletAddress, balance, auth }) => {
  let [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [openMenuOptions, setOpenMenuOptions] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [enableSound, setEnableSound] = useState(false);
  const [enableAnimation, setEnableAnimation] = useState(false);
  const [enableChatSound, setEnableChatSound] = useState(false);
  const [WalletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountBalace, setAccountBalance] = useState("");

  const [metaMaskError, setMetaMaskError] = useState(false);
  const [metaMask, setMetaMask] = useState(false);
  const dispatch = useDispatch();

  const loginWithMetaMask = async () => {
    if (typeof window.ethereum == "undefined") {
      return setMetaMaskError(true);
    }

    console.log(ethers.utils.hexValue(97));

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    try {
      const res = await axios.post("/login", { walletAddress: accounts[0] });
      setWalletAddress(res.data.data.walletAddress);
      setAccountBalance(res.data.data.balance);
    } catch (err) {
      console.log(err);
    }
  };

  const DepositAmount = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    try {
      setLoading(true);

      // check if the chain to connect to is installed
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(8081) }], // chainId must be in hexadecimal numbers
        });
      } catch (err) {
        console.log("Error From Network Change", err);
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: ethers.utils.hexValue(8081),
                  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
                  chainName: process.env.NEXT_PUBLIC_NETWORK_NAME,
                  nativeCurrency: {
                    name: process.env.NEXT_PUBLIC_CURRENCY_NAME,
                    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL,
                    decimals: 18,
                  },
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
      }

      await contract.deposit({
        value: ethers.utils.parseEther(depositAmount),
      });

      console.log("Deposit Amount", depositAmount);
      const res = await axios.post("/deposit", { amount: depositAmount });
      console.log("res", res);
      setAccountBalance(res.data.data.walletBalance);
      dispatch(
        setSuccessMessage({
          code: "200",
          message: "Amount Deposited Successfully",
        })
      );
      setLoading(false);
      setDepositAmount("");
    } catch (err) {
      setLoading(false);
      dispatch(setErrorMessage({ code: err.code, message: err.message }));
      console.log(err);
    }
  };

  const getBalance = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    const balance = await contract.getBalance(walletAddress);

    console.log(ethers.utils.formatEther(balance));
  };

  const getGameBalance = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    const balance = await contract.getGameBalance();

    console.log("Game Balance", ethers.utils.formatEther(balance));
  };

  const withdraw = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
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
      setLoading(true);
      const res = await axios.post("/withdraw", {
        amount: withdrawAmount.toString(),
      });

      setAccountBalance(res.data.data.balance);

      dispatch(
        setSuccessMessage({
          code: "200",
          message: "Amount credited successfully",
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        setErrorMessage({
          code: err.code,
          message: err.message,
        })
      );
      console.log(err);
    }
  };

  function OpenSettingsModal() {
    setOpenSettingsModal(true);
  }

  function closeSettingsModal() {
    setOpenSettingsModal(false);
  }

  function openMenuOptionModal() {
    setOpenMenuOptions(true);
  }

  function closeMenuOptionModal() {
    setOpenMenuOptions(false);
  }

  function OpenProfileModal() {
    setOpenProfileModal(true);
  }

  function closeProfileModal() {
    setOpenProfileModal(false);
  }

  const checkAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts[0]) {
      console.log("Wallet Address", walletAddress);
      setWalletAddress(walletAddress);
      setAccountBalance(balance);
    } else {
      setWalletAddress("");
    }
  };

  useEffect(() => {
    checkAccount();
  }, []);

  return (
    <div className="h-24 smb:px-5 md:px-10 flex items-center justify-between">
      <div className="smb:mr-10">
        <h1 className="text-yellow-400 font-VT323 text-5xl">SPACESHOT</h1>
      </div>
      <div className="md:w-96 smb:w-96 flex items-center justify-around">
        {WalletAddress ? (
          <button
            className="md:w-10 md:h-10 "
            onClick={() => OpenProfileModal()}
          >
            <ProfileIcon />
          </button>
        ) : (
          <button className="button4" onClick={loginWithMetaMask}>
            Connect Wallet
          </button>
        )}

        <button
          className="md:w-10 md:h-10 "
          onClick={() => OpenSettingsModal(true)}
        >
          <SettingsIcon />
        </button>
        <button
          className="md:w-10 md:h-10 "
          onClick={() => openMenuOptionModal()}
        >
          <MenuIcon />
        </button>
      </div>

      <Transition appear show={openSettingsModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeSettingsModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-gray-900 transform overflow-hidden rounded-sm p-6 text-left align-middle shadow-xl transition-all">
                  <div>
                    <div className="flex items-center md:w-96 justify-between">
                      <div>
                        <Image src={"/soundicon.svg"} width={60} height={60} />
                      </div>
                      <span className="font-VT323 md:text-5xl smb:text-2xl ml-10">
                        Sound
                      </span>
                      <Switch
                        checked={enableSound}
                        onChange={setEnableSound}
                        className={`${
                          enableSound ? "bg-yellow-400" : "bg-yellow-400"
                        }
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 switch  focus-visible:ring-yellow-300 focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            enableSound ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-yellow-400 shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                    <div className="flex mt-10 items-center md:w-96 justify-between">
                      <div>
                        <Image src={"/playicon.svg"} width={60} height={60} />
                      </div>
                      <span className="font-VT323 smb:text-2xl md:text-5xl ml-10">
                        Animation
                      </span>

                      <Switch
                        checked={enableAnimation}
                        onChange={setEnableAnimation}
                        className={`${
                          enableAnimation ? "bg-yellow-400" : "bg-yellow-400"
                        }
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 switch  focus-visible:ring-yellow-300 focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            enableAnimation ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-yellow-400 shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>

                    <div className="flex mt-10 items-center md:w-96 justify-between">
                      <div>
                        <Image src={"/chaticon.svg"} width={60} height={60} />
                      </div>
                      <span className="font-VT323 ml-10 smb:text-2xl md:text-5xl">
                        Chat Sound
                      </span>

                      <Switch
                        checked={enableChatSound}
                        onChange={setEnableChatSound}
                        className={`${
                          enableChatSound ? "bg-yellow-400" : "bg-yellow-400"
                        }
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 switch  focus-visible:ring-yellow-300 focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            enableChatSound ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-yellow-400 shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openMenuOptions} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeMenuOptionModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-gray-900 flex flex-col transform overflow-hidden rounded-sm p-6 text-left align-middle shadow-xl transition-all">
                  <button className="font-VT323 text-5xl px-20 hover:text-yellow-400">
                    FAQ
                  </button>
                  <button className="font-VT323 text-5xl px-20 mt-10  hover:text-yellow-400">
                    STATICS
                  </button>
                  <button className="font-VT323 text-5xl px-20 mt-10  hover:text-yellow-400">
                    LEADBOARD
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openProfileModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeProfileModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-gray-900 transform overflow-hidden rounded-sm p-6 text-left align-middle shadow-xl transition-all">
                  {walletAddress ? (
                    <div>
                      <h1 className="font-VT323 text-3xl">
                        Wallet Address : {walletAddress}
                      </h1>
                      <div className="mt-3">
                        <input
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="SHM"
                          type={"number"}
                          className="border-2 bg-gray-900 h-12 border-yellow-400 rounded-sm outline-none px-3"
                        />
                        <button
                          onClick={() => !loading && DepositAmount()}
                          className={`font-VT323 text-2xl px-9 ml-3 bg-yellow-400 h-12 ${
                            loading && "animate-pulse"
                          } `}
                        >
                          DEPOSIT
                        </button>
                      </div>
                      <div className="mt-3">
                        <input
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="SHM"
                          type={"number"}
                          className="border-2 bg-gray-900 h-12 border-yellow-400 rounded-sm outline-none px-3"
                        />
                        <button
                          onClick={() => !loading && withdraw()}
                          className={`font-VT323 text-2xl px-9 ml-3 bg-yellow-400 h-12 ${
                            loading && "animate-pulse"
                          }`}
                        >
                          WITHDRAW
                        </button>
                        <button onClick={() => getBalance()}>
                          Get Balance
                        </button>
                        <button onClick={() => getGameBalance()}>
                          Get Game balance
                        </button>
                      </div>
                      <h1 className="font-VT323 text-3xl mt-3">
                        Balance : {accountBalace} SHM
                      </h1>
                    </div>
                  ) : (
                    <div>
                      <button onClick={loginWithMetaMask}>
                        Connect Wallet
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Header;
