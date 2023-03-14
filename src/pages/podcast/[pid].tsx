import { useRecoilState } from "recoil";
import { backgroundColor } from "../../atoms";
import { 
    NextEpisode,
    podcastIdStyling,
} from "../../component/episode/eidTools";
import { PodcastBanner } from "../../component/podcast/pidTools";

export default function PodcastId() {
    const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);
    //State Calls Here
    const color = "#818cf8"
    const imgSrc = "/aa.jpg"
    const title = "Ethereum: All Core Devs Meetings"
    const description = "This repository archives permanently the meetings of Ethereum core developers meetings."
    const descriptionLong = "This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings."
    const creator = "@martonlederer"
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
                imgSrc={""}
                creator={creator}
                color={color}
                title={episodeTitle}
            />            
        </div>
    )
}

//Get ServerSide Props