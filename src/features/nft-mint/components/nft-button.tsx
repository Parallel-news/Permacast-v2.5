import { useState } from "react"
import { RetrieveNftObject } from "../types"
import { useQuery } from "@tanstack/react-query"
import { fetchCollectionInfo, usePosts } from "../api/get-nft-info"


export default function NftButton({ pid } : RetrieveNftObject) {

    const [fetchNft, setFetchNft] = useState<boolean>(false)
    const nftQuery = useQuery({
        queryKey: ['nftInfo'],
        queryFn: () => fetchCollectionInfo({pid: "3ji8N2OL1fZnVhzLceDxPwqOEptpiQVDpQo_T5w6BVA"}),
        enabled: fetchNft
    });

    const { status, data, error, isFetching } = usePosts();

    const buttonStyling = "flex items-center justify-center rounded-full w-[40px] h-[40px] text-white bg-white/25 font-bold"
    


    return (
        <>
            <button className={buttonStyling} onClick={() => setFetchNft(true)}>
                NFT
            </button>
            <p>{`Loading: ${nftQuery.isFetching}`}</p>
            <p>{`Data: ${nftQuery.data}`}</p>
        </>
    )
}