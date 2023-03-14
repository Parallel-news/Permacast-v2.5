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
import { EXM_READ_LINK } from "../../../../constants";
import { getContractVariables } from "../../../../utils/contract";
import { findObjectByPidAndEid } from "../../../../utils/reusables";

export default function EpisodeId({data}) {
    console.log("DATA: ", data)
    const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);
    //State Calls Here
    const DummyDesc = `The All-American Rejects are an American rock band from Stillwater, Oklahoma, formed in 1999.[4] The band consists of lead vocalist and bassist Tyson Ritter, lead guitarist and backing vocalist Nick Wheeler, rhythm guitarist and backing vocalist Mike Kennerty, and drummer Chris Gaylor. Wheeler and Ritter serve as the band's songwriters; Wheeler is the primary composer and Ritter is the primary lyricist. Although Kennerty and Gaylor are not founding members, they have appeared in all of the band's music videos and on all studio releases except for the band's self-titled debut.`
    const title = "All Core Devs: Meeting 9"
    const imgSrc = "/aa.jpg"
    const color = "#818cf8"
    const episodeNum = "1"
    const date = "May 10, 2022"
    const creator = "@martonlederer"
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
                text={DummyDesc} 
            />
            {/*Next Episode*/}
            <NextEpisode 
                description={DummyDesc} 
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
    const episodeId = params.eid
    const podcastId = params.pid
    const res = await axios.post(EXM_READ_LINK+contractAddress)
    const podcasts = res.data?.podcasts
    const data = findObjectByPidAndEid(podcasts, podcastId, episodeId)
    // Only grab data that contains the pid and eid 
    // Pass data to the page via props
    return { props: { data } }
  }