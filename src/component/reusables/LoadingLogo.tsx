import { Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { loadingPage } from "../../atoms";

export default function LoadingLogo() {

    const [_loadingPage] = useRecoilState(loadingPage)

    return( 
        <Transition
            show={_loadingPage}
            appear={true}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 rotate-[-120deg] scale-50"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform transition duration-[400ms]"
            leaveFrom="opacity-100 rotate-0 scale-100"
            leaveTo="opacity-75 rotate-[120deg] scale-50"
            className=""
        >
            <div 
                className="bg-[#FFFF00] rounded-md w-[40px] h-[40px] w-[45px] h-[45px] "
                style={{ animation: "rotate 2s linear infinite" }}
            ></div>
        </Transition>
    )
}