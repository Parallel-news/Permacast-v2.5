import { useState } from "react"
import { GenericNftButtonObject, RetrieveNftObject } from "../types"
import { useCreateCollection } from "../api/get-nft-info"
import NftModal from "./modal";


export function NftButton({ pid } : RetrieveNftObject) {
    
    const [showModal, setShowModal] = useState(false)

    const collectionMutation = useCreateCollection()

    const buttonStyling = "flex items-center justify-center rounded-full w-[40px] h-[40px] text-white bg-white/20 font-bold p-1"
    
    return (
        <>
            <button className={buttonStyling} onClick={async () => {
                /*
                  collectionMutation.mutate({
                    pid: pid,
                    getPublicKey: getPublicKey,
                    createSignature: createSignature
                  })
                */
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

export const GenericNftButton = ({ text, onClick } : GenericNftButtonObject) => {
    const btnStyling = "bg-[#FFFF00] rounded-md h-22 w-32 p-1 text-black text-lg hover:scale-95 transform transition-all duration-100"
    return (
        <button className={btnStyling} onClick={onClick}>
            {text}
        </button>
    )
}