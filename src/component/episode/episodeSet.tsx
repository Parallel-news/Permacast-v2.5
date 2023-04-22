import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { backgroundColorAtom } from "../../atoms";
import { detectTimestampType, hasBeen10Min } from "../../utils/reusables";
import { FullEpisodeInfo } from "../../interfaces";
import { determinePodcastURL, fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import { ARSEED_URL, MESON_ENDPOINT } from "../../constants";
import { podcastIdStyling } from "./eidTools";
import { TipModal } from "../tipModal";
import { ShareButtons } from "../shareButtons";
import { trimChars } from "../../utils/filters";

const EpisodeBanner = React.lazy(() => import("./eidTools").then(module => ({ default: module.EpisodeBanner })));
const EpisodeDescription = React.lazy(() => import("./eidTools").then(module => ({ default: module.EpisodeDescription })));
const Episodes = React.lazy(() => import("./eidTools").then(module => ({ default: module.Episodes })));
const FeaturedPodcastPlayButton = React.lazy(() => import("../home/featuredPodcastPlayButton"))

interface EpisodeSetInter {
    data: any
}

export default function EpisodeSet(props: EpisodeSetInter) {

    const {data } = props

    const [, setBackgroundColor_] = useRecoilState(backgroundColorAtom);
    const [loadTipModal, setLoadTipModal] = useState<boolean>(false)
    const [loadShareModal, setLoadShareModal] = useState<boolean>(false)
    const [color, setColor] = useState<string>("")
    const [baseUrl, setBaseUrl] = useState<string>("")

    const [themeColor, setThemeColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('');
    let index;
    
    if (data) {
        // Find Episode Number
        for(let i = 0; i < data.episodes.length; i++) {
            //@ts-ignore
            if(data.episodes[i].eid === data.obj.eid) {
                index = i
            }
        }
        //Serverside Results
        detectTimestampType(data?.obj.uploadedAt)
        let ts = new Date(detectTimestampType(data?.obj.uploadedAt) === "milliseconds" ? data?.obj.uploadedAt : data?.obj.uploadedAt* 1000);
        const day = ts.getDate().toString().padStart(2, '0'); // get the day and add leading zero if necessary
        const month = (ts.getMonth() + 1).toString().padStart(2, '0'); // get the month (adding 1 because getMonth() returns 0-indexed) and add leading zero if necessary
        const year = ts.getFullYear().toString(); // get the year
        const formattedDate = `${day}/${month}/${year}`;
        const d = data?.obj
        console.log("DDD: ", d)
        const date = formattedDate

        // Assemble Player Data
        const podcastInfo = data.podcast
        console.log("podcastInfo: ", podcastInfo)
        const episodes = data?.episodes
        const cover = data.cover
        // Create Data for Next Episode
        //let nextEpisodeInfo: FullEpisodeInfo = {episode: {}, podcast: {}};
        let nextEpisodeInfo = {
            episode: null,
            podcast: {
                cover: '',
                minifiedCover: '',
                label: '',
                author: '',
                podcastName: '',
                pid: '',
            }
        } as FullEpisodeInfo
        
        if(data?.episodes[index+1]) {
            nextEpisodeInfo["episode"] = data?.episodes[index+1]
            let podcastShort = nextEpisodeInfo["podcast"]
            podcastShort.cover = cover
            podcastShort.minifiedCover = cover
            podcastShort.label = data.podcast.label
            podcastShort.author = data.podcast.author
            podcastShort.podcastName = data.podcast.podcastName
            podcastShort.pid = data.podcast.pid
        } 

        const playerInfo = { playerColorScheme: themeColor, buttonColor: themeColor, accentColor: textColor, title: data.obj.episodeName, artist: data.author, cover, src: data.obj.contentTx };
        const playButton = <FeaturedPodcastPlayButton {...{ playerInfo, podcastInfo, episodes }} />
        useEffect(() => {
            if(typeof window !== 'undefined') setBaseUrl(window.location.protocol + "//"+window.location.hostname+(window.location.port ? ":" + window.location.port : ""))
            const fetchColor = async () => {
                const dominantColor = await fetchDominantColor(data.cover);
                const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba)
                setColor(textColor) 
                setBackgroundColor_(coverColor)
                setThemeColor(coverColor);
                setTextColor("rgb(255, 255, 255)");
            }
            fetchColor();
        }, []);
        console.log("OWNER: ", data?.obj.owner)
        return (
            <div className={podcastIdStyling}>
            {/*Episode Cover & Info*/}
            <EpisodeBanner 
                title={d.episodeName}
                imgSrc={ARSEED_URL + data?.cover}
                color={color}
                episodeNum={index+1}
                date={date}
                setLoadTipModal={() => setLoadTipModal(true)}
                setLoadShareModal={() => setLoadShareModal(true)}
                mediaLink={hasBeen10Min(data?.obj.uploadedAt) ? MESON_ENDPOINT+ data.obj.contentTx : ARSEED_URL + data.obj.contentTx}
                podcastOwner={podcastInfo.owner}
                playButton={playButton}
                podcastName={data?.podcastName}
                pid={podcastInfo?.pid}
                eid={d.eid}
            />
            {/*Episode Description*/}
            <EpisodeDescription
                text={d.description}
            />
            {/*Next Episode*/}
            {data?.episodes[index+1] && (
                <Episodes
                    containerTitle={"Next Episode"} 
                    imgSrc={ARSEED_URL + data?.cover}
                    color={'rgb(255, 255, 255)'}
                    episodes={[nextEpisodeInfo]}
                    podcastId={data?.obj.pid}
                />
            )}
            {loadTipModal && (
                <TipModal
                    to={data?.podcastName}
                    toAddress={data?.owner} 
                    isVisible={loadTipModal}
                    setVisible={setLoadTipModal}
                />
            )}
            {loadShareModal && (
                <ShareButtons
                    isVisible={loadShareModal} 
                    setVisible={setLoadShareModal}
                    title={d.episodeName + " - " +data.podcastName}
                    url={`${baseUrl}/episode/${determinePodcastURL(data?.label, data?.pid)}/${trimChars(data?.obj.eid)}`}
                />
            )}
        </div>
        )
    }
}