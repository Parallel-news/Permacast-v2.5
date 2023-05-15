import { useState } from "react"
import { RetrieveNftObject } from "../types"
import { useNftInfo, createNftCollection } from "../api/get-nft-info"
import { useArconnect } from "react-arconnect";

export default function NftButton({ pid } : RetrieveNftObject) {

    const [fetchNft, setFetchNft] = useState<boolean>(false)
    const { address, getPublicKey, createSignature } = useArconnect();

    const nftQuery = useNftInfo({
        enabled: fetchNft,
        pid: "3ji8N2OL1fZnVhzLceDxPwqOEptpiQVDpQo_T5w6BVA"
    })

    const buttonStyling = "flex items-center justify-center rounded-full w-[40px] h-[40px] text-white bg-white/25 font-bold"
    
    return (
        <>
            <button className={buttonStyling} onClick={() => createNftCollection({pid, getPublicKey, createSignature})}>
                NFT
            </button>
            <p>{`Loading: ${nftQuery.isFetching}`}</p>
            <p>{`Data: ${nftQuery.data}`}</p>
        </>
    )
}