import toast, { ToastBar, Toaster } from "react-hot-toast";
import { MintNotifObject } from "../types";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FADE_WAIT, TITLE_WAIT } from "../../../constants";
import Image from "next/image";

export default function MintedNotification({thumbnail, primaryMsg, secondaryMsg}: MintNotifObject)  {

    const [showNotif, setShowNotif] = useState<boolean>(false)
    // Enter
    useEffect(() => {
        const timer = setTimeout(() => setShowNotif(true), TITLE_WAIT);
        return () => clearTimeout(timer);
    }, []);
    // Leave
    useEffect(() => {
        const timer = setTimeout(() => setShowNotif(false), FADE_WAIT+1500);
        return () => clearTimeout(timer);
    }, [])

    return (
        <Transition
            show={showNotif}
            enter="transition ease-out duration-500"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-out duration-500"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            className="max-w-md w-full"
        >
            <div
                className={`max-w-[300px] w-full bg-[#333] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                    <Image
                        className="h-12 w-12 rounded-lg"
                        src={thumbnail}
                        alt=""
                        width={60}
                        height={60}
                    />
                    </div>
                    <div className="ml-3 flex-1">
                    <p className="text-md font-medium mt-0.5 text-white">
                        {primaryMsg}
                    </p>
                    <p className="mt-1 text-sm text-gray-300 line-clamp-1">
                        {secondaryMsg}
                    </p>
                    </div>
                </div>
                </div>
        </div> 
    </Transition>       
    )
}
