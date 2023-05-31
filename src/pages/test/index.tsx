import { useState } from "react";

import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react'
import React from "react";

function Tooltip({ children, tooltipText }) {
    const tipRef = React.createRef();
    function handleMouseEnter() {

        //@ts-ignore
        tipRef.current.style.opacity = 1;
        //@ts-ignore
        tipRef.current.style.marginTop = "20px";
    }
    function handleMouseLeave() {
        //@ts-ignore
        tipRef.current.style.opacity = 0;
        //@ts-ignore
        tipRef.current.style.marginTop = "10px";
    }
    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="absolute whitespace-no-wrap bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-150"
                style={{ left: "3%", opacity: 0 }}
                //@ts-ignore
                ref={tipRef}
            >
                <div
                    className="bg-black h-3 w-3 absolute bg-zinc-800"
                    style={{ left: "-6px", transform: "rotate(45deg)" }}
                />
                {tooltipText}
            </div>
            {children}
        </div>
    );
}

import { useRef } from 'react'
import propTypes from 'prop-types'

const Secondary = ({ children, tooltipText, orientation = 'right' }) => {
    const tipRef = useRef(null)

    const orientations = {
        right: 'right',
        top: 'top',
        left: 'left',
        bottom: 'bottom',
    }

    function handleMouseEnter() {
        tipRef.current.style.opacity = 1
    }

    function handleMouseLeave() {
        tipRef.current.style.opacity = 0
    }

    const setContainerPosition = (orientation) => {
        let classnames

        switch (orientation) {
            case orientations.right:
                classnames = 'top-0 left-full ml-4'
                break
            case orientations.left:
                classnames = 'top-0 right-full mr-4'
                break
            case orientations.top:
                classnames = 'bottom-full translate-x-[-50%] -translate-y-2 left-[1%]' //left-[50%] translate-x-[-50%] -translate-y-2
                break
            case orientations.bottom:
                classnames = 'top-full left-[50%] translate-x-[-50%] translate-y-2'
                break

            default:
                break
        }

        return classnames
    }

    const setPointerPosition = (orientation) => {
        let classnames

        switch (orientation) {
            case orientations.right:
                classnames = 'left-[-6px]'
                break
            case orientations.left:
                classnames = 'right-[-6px]'
                break
            case orientations.top:
                classnames = 'top-full ' //left-[0%] translate-x-[-50%] -translate-y-2
                break
            case orientations.bottom:
                classnames = 'bottom-full left-[50%] translate-x-[-50%] translate-y-2'
                break

            default:
                break
        }

        return classnames
    }

    const classContainer = ` absolute z-10 ${setContainerPosition(
        orientation
    )} bg-gray-600 text-white text-sm px-2 py-1 rounded flex items-center transition-all duration-150 pointer-events-none`

    const pointerClasses = `bg-gray-600 h-3 w-3 absolute z-10 ${setPointerPosition(
        orientation
    )} rotate-45 pointer-events-none`

    return (
        <div className="relative flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className={classContainer} style={{ opacity: 0 }} ref={tipRef}>
                <div className={pointerClasses} />
                {tooltipText}
            </div>
            {children}
        </div>
    )
}

Secondary.propTypes = {
    orientation: propTypes.oneOf(['top', 'left', 'right', 'bottom']),
    tooltipText: propTypes.string.isRequired,
}

export default function Test() {

    return (
        <div className="p-12">
            <Secondary orientation="top" tooltipText="Shop Insights">
                <button>
                    Demo1
                </button>  
            </Secondary>
        </div>
    )
}