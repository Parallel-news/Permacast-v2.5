import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { FADE_WAIT, LOGO_WAIT, TITLE_WAIT } from '../../constants';

export const InitialLoad = () => {

    const [showLogo, setShowLogo] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [color, ] = useState("#000000");
    const [isShowing, setIsShowing] = useState(true)

    // Title Appears
    useEffect(() => {
        const timer = setTimeout(() => setShowTitle(true), TITLE_WAIT);
        return () => clearTimeout(timer);
      }, []);
    // Logo Swivel
    useEffect(() => {
      const timer = setTimeout(() => setShowLogo(true), LOGO_WAIT);
      return () => clearTimeout(timer);
    }, []);
    // Zoom Out
    useEffect(() => {
        const timer = setTimeout(() => setIsShowing(false), FADE_WAIT);
        return () => clearTimeout(timer);
    }, [])

    return (
        <>
            <Transition
                show={isShowing}
                enter="transform transition duration-[0ms]"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-out duration-500"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className={`flex justify-center items-center space-x-4 md:space-x-10 h-screen relative mb-[30px] z-50`} id="jumbotron" style={{ backgroundColor: color, transition: 'width 0.5s ease-out' }}>
                    {!showLogo ? 
                        <div className="bg-black rounded-md w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[85px] md:h-[85px] lg:w-[110px] lg:h-[110px] xl:w-[140px] xl:h-[140px] "></div> 
                    :
                        <Transition
                            show={showLogo}
                            appear={true}
                            enter="transform transition duration-[400ms]"
                            enterFrom="opacity-0 rotate-[-120deg] scale-50"
                            enterTo="opacity-100 rotate-0 scale-100"
                            className=""
                        >
                            <div className="bg-[#FFFF00] rounded-md w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[85px] md:h-[85px] lg:w-[110px] lg:h-[110px] xl:w-[140px] xl:h-[140px] "></div>
                        </Transition>
                    }
                    <Transition
                        show={showTitle}
                        appear={true}
                        enter="transition ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                    >
                        <p className={`shine mb-2 md:mb-4 font-mono`}>
                            permacast
                        </p>
                    </Transition>
                </div> 
            </Transition>
        </>
    )
}
