import axios from "axios";
import { useRecoilState } from "recoil";
import { backgroundColor } from "../../atoms";
import { 
    NextEpisode,
    podcastIdStyling,
} from "../../component/episode/eidTools";
import { PodcastBanner } from "../../component/podcast/pidTools";
import { EXM_READ_LINK, ARWEAVE_READ_LINK } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { findObjectById } from "../../utils/reusables";
import { formatStringByLen } from "../../utils/reusables";

export default function PodcastId({data}) {
    const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);
    //State Calls Here
    console.log("Data: ", data)
    const color = "#818cf8"
    const imgSrc = ARWEAVE_READ_LINK+data.obj?.cover
    const title = data.obj?.podcastName
    const description = data.obj?.description
    const descriptionLong = "This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings."
    const creator = data.obj?.owner.length > 15 ? formatStringByLen(data.obj?.owner, 4, 4) : data.obj?.owner
    const episodeTitle = "American Rhetoric"
    const nextEpisodeTitle = "Episodes"

    return (
        <div className={podcastIdStyling}>
            <PodcastBanner 
                imgSrc={imgSrc}
                title={title}
                description={description}
                color={color}
            />
            {/*Next Episode*/}
            <NextEpisode 
                containerTitle={nextEpisodeTitle} 
                description={descriptionLong} 
                imgSrc={imgSrc}
                creator={creator}
                color={color}
                title={episodeTitle}
            />            
        </div>
    )
}

export async function getServerSideProps(context) {
    // Fetch data from external API
    const { contractAddress } = getContractVariables();
    const { params } = context
    const podcastId = params.pid
    const res = await axios.post(EXM_READ_LINK+contractAddress)
    const podcasts = res.data?.podcasts
    const data = findObjectById(podcasts, podcastId, "pid")

    return { props: { data } }
}
//Get ServerSide Props