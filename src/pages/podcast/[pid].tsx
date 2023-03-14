import axios from "axios";
import { useRecoilState } from "recoil";
import { backgroundColor } from "../../atoms";
import { 
    Episodes,
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
    const episodes = data.obj?.episodes

    return (
        <div className={podcastIdStyling}>
            <PodcastBanner 
                imgSrc={imgSrc}
                title={title}
                description={description}
                color={color}
            />
            {/*Episode Track*/}
            <Episodes
                containerTitle={nextEpisodeTitle} 
                imgSrc={imgSrc}
                color={color}
                episodes={episodes}
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

    const dummyObj = {
        "eid": "27a0a679f9222bc9dd7eda10d6577002716c90140665f5aff1bc2836fb734492e3632eb787236c9197273224a39607b005c38d8151c7dacc4a673a6dffa45627",
        "episodeName": "The Payback",
        "description": "init 777 where I would go and find myself a little lamb that I can cook later with some good seasoning and eat init 777 where I would go and find myself a little lamb that I can cook later with some good seasoning and eat",
        "contentTx": "6DGL3pxXomRkcgbuUAKqXCdtFSgUuiXYcB9vM8OeFZc",
        "size": 17445368,
        "type": "video/mp4",
        "uploader": "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0",
        "uploadedAt": 1669794153000,
        "isVisible": true
    }

    data.obj.episodes.push(dummyObj)
    data.obj.episodes.push(dummyObj)
    data.obj.episodes.push(dummyObj)
    data.obj.episodes.push(dummyObj)
    data.obj.episodes.push(dummyObj)
    data.obj.episodes.push(dummyObj)
    return { props: { data } }
}
//Get ServerSide Props