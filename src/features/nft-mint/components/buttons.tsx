import NftModal from "./modal"
import { useState } from "react"
import { GenericNftButtonObject, GetPid } from "../types"


export function NftButton({ pid } : GetPid) {
    
    const [showModal, setShowModal] = useState(false)

    const buttonStyling = "flex items-center justify-center rounded-full w-[40px] h-[40px] text-white bg-white/20 font-bold p-1"
    
    return (
        <>
            <button className={buttonStyling} onClick={async () => {
                setShowModal(true)
            }}>
                NFT
            </button>
            <NftModal
                pid={pid}
                isOpen={showModal}
                setIsOpen={setShowModal}
            />
        </>
    )
}

export const GenericNftButton = ({ text, onClick, disabled } : GenericNftButtonObject) => {
    const btnStyling = "bg-[#FFFF00] rounded-md h-22 w-32 p-1 text-black text-lg disabled:bg-gray-600"
    return (
        <button className={btnStyling} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    )
}