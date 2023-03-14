import axios from "axios";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { backgroundColor } from "../../../../atoms";
import { 
    EpisodeBanner,
    EpisodeDescription,
    NextEpisode,
    podcastIdStyling
 } from "../../../../component/episode/eidTools";
import { EXM_READ_LINK, ARWEAVE_READ_LINK } from "../../../../constants";
import { getContractVariables } from "../../../../utils/contract";
import { findObjectById, formatStringByLen } from "../../../../utils/reusables";

export default function EpisodeId({data}) {

    const [, setBackgroundColor_] = useRecoilState(backgroundColor);
    const ts = new Date(data?.obj.uploadedAt);
    const formattedDate = ts.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    //Serverside Results
    const desc = data?.obj.description
    const title = data?.obj.episodeName
    const imgSrc = ARWEAVE_READ_LINK+data?.cover
    const color = "#818cf8"
    const episodeNum = data?.index+1
    const date = formattedDate
    const creator = data?.obj.uploader.length > 15 ? formatStringByLen(data?.obj.uploader, 4, 4) : data?.obj.uploader
    const creatorPfp = ""
    const episodeTitle = "American Rhetoric"

    useEffect(() => {
        setBackgroundColor_(color)
    }, [])

    return (
        <div className={podcastIdStyling}>
            {/*Episode Cover & Info*/}
            <EpisodeBanner 
                title={title}
                imgSrc={imgSrc}
                color={color}
                episodeNum={episodeNum}
                date={date}
            />
            {/*Episode Description*/}
            <EpisodeDescription
                text={desc} 
            />
            {/*Next Episode*/}
            <NextEpisode 
                description={desc} 
                imgSrc={""}
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
    const episodeId = params.eid
    const podcastId = params.pid
    const res = await axios.post(EXM_READ_LINK+contractAddress)
    const podcasts = res.data?.podcasts
    const foundPodcasts = findObjectById(podcasts, podcastId, "pid")
    const podcastData = {
        cover: foundPodcasts.obj.cover

    }
    const foundEpisode = findObjectById(foundPodcasts.obj.episodes, episodeId, "eid")
    const data = { ...podcastData, ...foundEpisode }


    return { props: { data } }
}