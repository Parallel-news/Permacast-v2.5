import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

export const InitialLoad = () => {

    const [showLogo, setShowLogo] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [color, setColor] = useState("#000000");
    const [width, setWidth] = useState("auto");
    const [fade, setFade] = useState(false)
    const [isShowing, setIsShowing] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTitle(true);
        }, 500);
        return () => clearTimeout(timer);
      }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowLogo(true);
      }, 1000);
      return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowing(false)
        }, 3500);
        return () => clearTimeout(timer);
    }, [])

        return (
            <Transition
                show={isShowing}
                enter="transform transition duration-[100ms]"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-out duration-500"
                leaveFrom="opacity-100 scale-100" //rotate-0 
                leaveTo="opacity-0 scale-95" //
            >
                <div className={`flex flex-row justify-center items-center space-x-10 h-screen relative mb-[30px]`} id="jumbotron" style={{ backgroundColor: color, width: width, transition: 'width 0.5s ease-out' }}>
                {!showLogo && (<div className="bg-black w-[140px] h-[140px] rounded-md"></div>)}
                <Transition
                    show={showLogo}
                    appear={true}
                    enter="transform transition duration-[400ms]"
                    enterFrom="opacity-0 rotate-[-120deg] scale-50"
                    enterTo="opacity-100 rotate-0 scale-100"
                    className=""
                >
                    <div className="bg-[#FFFF00] w-[140px] h-[140px] rounded-md"></div>
                </Transition>
                <Transition
                    show={showTitle}
                    appear={true}
                    enter="transition ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                >
                    <p className={`shine mb-4`}>
                        Permacast
                    </p>
                </Transition>
            </div> 
        </Transition>
        )
}
