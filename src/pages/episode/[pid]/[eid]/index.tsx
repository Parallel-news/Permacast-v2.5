import axios from "axios";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { backgroundColor } from "../../../../atoms";
import { 
    EpisodeBanner,
    EpisodeDescription,
    Episodes,
    ErrorTag,
    podcastIdStyling
 } from "../../../../component/episode/eidTools";
import { EXM_READ_LINK, ARWEAVE_READ_LINK, NO_PODCAST_FOUND, PAYLOAD_RECEIVED, NO_EPISODE_FOUND } from "../../../../constants";
import { getContractVariables } from "../../../../utils/contract";
import { findObjectById, formatStringByLen } from "../../../../utils/reusables";

export default function EpisodeId({data, status}) {
    console.log("ep data: ", data)
    const [, setBackgroundColor_] = useRecoilState(backgroundColor);
    console.log("status: ", status)

    if(data) {
        useEffect(() => {
            setBackgroundColor_(color)
        }, [])
        //Serverside Results
        const ts = new Date(data?.obj.uploadedAt);
        const formattedDate = ts.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const d = data?.obj
        const color = "#818cf8"
        const nextEpisodeTitle = "Next Episode"
        const date = formattedDate
        const creator = data?.obj.uploader.length > 15 ? formatStringByLen(data?.obj.uploader, 4, 4) : data?.obj.uploader
        const episodes = d.episodes

        return (
            <div className={podcastIdStyling}>
                {/*Episode Cover & Info*/}
                <EpisodeBanner 
                    title={d.episodeName}
                    imgSrc={ARWEAVE_READ_LINK+data?.cover}
                    color={color}
                    episodeNum={data?.index+1}
                    date={date}
                />
                {/*Episode Description*/}
                <EpisodeDescription
                    text={d.description} 
                />
                {/*Next Episode*/}
                <Episodes
                    containerTitle={nextEpisodeTitle} 
                    imgSrc={ARWEAVE_READ_LINK+data?.cover}
                    color={color}
                    episodes={[]}
                />
            </div>
        )
    } else if(status === NO_PODCAST_FOUND || status === NO_EPISODE_FOUND) {
        return (
            <ErrorTag 
                msg={status}
            />
        )
    } else {
        return (
            <ErrorTag 
                msg={"404"}
            />
        )
    }
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
    // Podcast Exists
    if(foundPodcasts) {
        const podcastData = {
            cover: foundPodcasts.obj.cover
    
        }
        const foundEpisode = findObjectById(foundPodcasts.obj.episodes, episodeId, "eid")
        // Episode Exist
        if(foundEpisode) {
            const data = { ...podcastData, ...foundEpisode }
            const status = PAYLOAD_RECEIVED
            return { props: { data, status } }
        // Episode Doesnt Exist
        } else {
            const data = null
            const status = NO_EPISODE_FOUND
            return { props: { data, status } } 
        }
    // Podcast Doesnt Exist
    } else {
        const data = null
        const status = NO_PODCAST_FOUND
        return { props: { data, status } } 
    }
}