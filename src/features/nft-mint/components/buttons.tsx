import NftModal from "./modal"
import { useState } from "react"
import { useArconnect } from "react-arconnect";
import { GenericNftButtonObject, RetrieveNftObject } from "../types"
import { useCreateCollection, useMintEpisode } from "../api/get-nft-info"


export function NftButton({ pid } : RetrieveNftObject) {
    
    const { address, getPublicKey, createSignature } = useArconnect();
    const [showModal, setShowModal] = useState(false)
    const collectionMutation = useCreateCollection()
    const mintEpisodeMutation = useMintEpisode()

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
                /*
                mintEpisodeMutation.mutate({
                    eid: "ee8dc79f1b195df1d355cbad61e0d01845c6e37cb00cca773b93b50636d46ea74d97f43781fa9d5d5221c29e2e18e126b697c3c75c8149516f8f8c7041d78200",
                    target: "0x320F23780c98f1cbA153dA685e67c4F02aC78bd1",
                    getPublicKey: getPublicKey,
                    createSignature: createSignature
                })
                */
                setShowModal(true)
            }}>
                NFT
            </button>
            {`Is Loading: ${mintEpisodeMutation.isLoading}`}
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