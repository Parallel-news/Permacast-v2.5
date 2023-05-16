import { useState } from "react"
import { RetrieveNftObject } from "../types"
import { useCreateCollection } from "../api/get-nft-info"
import { useArconnect } from "react-arconnect";

export default function NftButton({ pid } : RetrieveNftObject) {

    const [fetchNft, setFetchNft] = useState<boolean>(false)
    const { address, getPublicKey, createSignature } = useArconnect();

    const collectionMutation = useCreateCollection()

    const buttonStyling = "flex items-center justify-center rounded-full w-[40px] h-[40px] text-white bg-white/25 font-bold"
    
    return (
        <>
            <button className={buttonStyling} onClick={() => {
                  collectionMutation.mutate({
                    pid: pid,
                    getPublicKey: getPublicKey,
                    createSignature: createSignature
                  })
            }}>
                NFT
            </button>
            {`Loading: ${collectionMutation.isLoading}    `}
            {`Data: ${collectionMutation.data}    `}
            {`Error: ${collectionMutation.error}    `}
        </>
    )
}