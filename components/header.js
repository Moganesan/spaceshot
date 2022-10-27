import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Image from "next/image";
const Header = () => {
  let [openSettingsModal, setOpenSettingsModal] = useState(true);

  function closeModal() {
    setOpenSettingsModal(false);
  }

  function OpenSettingsModal() {
    setOpenSettingsModal(true);
  }

  function closeSettingsModal() {
    setOpenSettingsModal(false);
  }

  return (
    <div className="h-24 px-10 flex items-center justify-between">
      <div className="mr-56">
        <h1 className="text-yellow-400 text-3xl">SPACESHOT</h1>
      </div>
      <div className="w-64 flex items-center justify-around">
        <button>
          <Image src={"/profile.svg"} width={40} height={40} />
        </button>
        <button onClick={() => OpenSettingsModal(true)}>
          <Image src={"/settingsicon.svg"} width={40} height={40} />
        </button>
        <button>
          <Image src={"/menuicon.svg"} width={40} height={40} />
        </button>
      </div>

      <Transition appear show={openSettingsModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="bg-balckbackground transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
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
