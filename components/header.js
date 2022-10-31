import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { Switch } from "@headlessui/react";
import ContractAbi from "../artifacts/contracts/Spaceshot.sol/Spaceshot.json";

const Header = () => {
  let [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [openMenuOptions, setOpenMenuOptions] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [enableSound, setEnableSound] = useState(false);
  const [enableAnimation, setEnableAnimation] = useState(false);
  const [enableChatSound, setEnableChatSound] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountBalace, setAccountBalance] = useState("");

  const [metaMaskError, setMetaMaskError] = useState(false);
  const [metaMask, setMetaMask] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const loginWithMetaMask = async () => {
    if (typeof window.ethereum == "undefined") {
      return setMetaMaskError(true);
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setWalletAddress(accounts[0]);
  };

  const getBalance = async () => {
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
      const accountBalance = await contract.getBalance(accounts[0]);
      const gameBalance = await contract.getGameBalance();
      console.log("Game Balance", ethers.utils.formatEther(gameBalance));
      setAccountBalance(ethers.utils.formatEther(accountBalance));
    } catch (err) {
      console.log(err);
    }
  };

  const DepositAmount = async () => {
    console.log("Deposit Amount", depositAmount);
    const contractAddress = "0xD7746beC4f562b4c6eD610417858f97175Fe6854";
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
      await contract.deposit({
        value: ethers.utils.parseEther(depositAmount),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const checkAccounts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    if (!accounts[0]) {
      loginWithMetaMask();
    } else {
      setWalletAddress(accounts[0]);
    }
  };

  const withdraw = async () => {
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
      await contract.withdraw(withdrawAmount);
    } catch (err) {
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

  useEffect(() => {
    checkAccounts();
    getBalance();
  }, []);

  return (
    <div className="h-24 px-10 flex items-center justify-between">
      <div className="mr-56">
        <h1 className="text-yellow-400 text-3xl">SPACESHOT</h1>
      </div>
      <div className="w-64 flex items-center justify-around">
        <button onClick={() => OpenProfileModal()}>
          <Image src={"/profile.svg"} width={40} height={40} />
        </button>
        <button onClick={() => OpenSettingsModal(true)}>
          <Image src={"/settingsicon.svg"} width={40} height={40} />
        </button>
        <button onClick={() => openMenuOptionModal()}>
          <Image src={"/menuicon.svg"} width={40} height={40} />
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
                    <div className="flex items-center w-96 justify-between">
                      <div>
                        <Image src={"/soundicon.svg"} width={60} height={60} />
                      </div>
                      <span className="font-VT323 text-5xl ml-10">Sound</span>
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
                    <div className="flex mt-10 items-center w-96 justify-between">
                      <div>
                        <Image src={"/playicon.svg"} width={60} height={60} />
                      </div>
                      <span className="font-VT323 text-5xl ml-10">
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

                    <div className="flex mt-10 items-center w-96 justify-between">
                      <div>
                        <Image src={"/chaticon.svg"} width={60} height={60} />
                      </div>
                      <span className="font-VT323 ml-10 text-5xl">
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
                        onClick={() => DepositAmount()}
                        className="font-VT323 text-2xl px-9 ml-3 bg-yellow-400 h-12"
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
                        onClick={() => withdraw()}
                        className="font-VT323 text-2xl px-9 ml-3 bg-yellow-400 h-12"
                      >
                        WITHDRAW
                      </button>
                    </div>
                    <h1 className="font-VT323 text-3xl mt-3">
                      Balance : {accountBalace} SHM
                    </h1>
                  </div>
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
