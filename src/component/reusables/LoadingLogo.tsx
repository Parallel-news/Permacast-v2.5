import { Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { loadingPage } from "../../atoms";

interface LoadingLogoInter {
    playerActivated: boolean
}

export default function LoadingLogo(props: LoadingLogoInter) {

    const [_loadingPage] = useRecoilState(loadingPage)

    return( 
        <Transition
            show={_loadingPage}
            appear={true}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 rotate-[-120deg] scale-50"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform transition duration-[200ms]"
            leaveFrom="opacity-100 rotate-0 scale-100"
            leaveTo="opacity-75 rotate-[120deg] scale-75"
            className={`absolute z-50 ${props.playerActivated ? ' bottom-[130px] lg:bottom-[115px] right-[35px]' : ' bottom-[25px] right-[35px]'}`}
        >
            <div 
                className="bg-[#FFFF00] rounded-md w-[30px] h-[30px] "
                style={{ animation: "rotate 2s linear infinite" }}
            ></div>
        </Transition>
    )
}