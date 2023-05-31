import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, ReactElement, SetStateAction } from "react";

type ModalShellObject = {
    children: ReactElement<any, any>;
    width: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ModalShell({children, width, isOpen, setIsOpen} : ModalShellObject) {

    const modalContainer = `w-full ${width} transform overflow-hidden rounded-2xl bg-zinc-800 p-10 text-left align-middle shadow-xl transition-all relative min-h-[200px] flex flex-col justify-center items-center`

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                            <Dialog.Panel className={modalContainer}>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}