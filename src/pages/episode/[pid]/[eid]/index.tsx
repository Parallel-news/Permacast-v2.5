import axios from "axios";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { backgroundColorAtom, loadTipModal } from "../../../../atoms";
import { 
    EpisodeBanner,
    EpisodeDescription,
    Episodes,
    ErrorTag,
    podcastIdStyling,
 } from "../../../../component/episode/eidTools";
import { EXM_READ_LINK, NO_PODCAST_FOUND, PAYLOAD_RECEIVED, NO_EPISODE_FOUND, ARSEED_URL } from "../../../../constants";
import { getContractVariables } from "../../../../utils/contract";
import { detectTimestampType, findObjectById, formatStringByLen } from "../../../../utils/reusables";
import { TipModal } from "../../../../component/tipModal";
import { ShareButtons } from "../../../../component/shareButtons";
import { determinePodcastURL, fetchDominantColor, getCoverColorScheme, rgba2hex, RGBAstringToObject, RGBobjectToString } from "../../../../utils/ui";
import { useTranslation } from "next-i18next";
import FeaturedPodcastPlayButton from "../../../../component/home/featuredPodcastPlayButton";
import { findEpisode, findPodcast, trimChars } from "../../../../utils/filters";

export default function EpisodeId({data, status}) {

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
        const date = formattedDate
        const creator = data?.obj.uploader.length > 15 ? formatStringByLen(data?.obj.uploader, 4, 4) : data?.obj.uploader

        // Assemble Player Data
        const podcastInfo = data.podcast
        const episodes = data?.episodes
        const cover = data.cover
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
                setTextColor(textColor);
            }
            fetchColor();
        }, []);

        return (
            <>
                <Head>
                    <title>{`${data.podcastName} | Permacast`}</title> 
                    <meta name="description" content={`By ${data.podcastName}`} />
                    <meta name="twitter:image" content={(data.cover !== "") ? ARSEED_URL + data.cover : "https://permacast.app/favicon.png"} />
                    <meta name="twitter:title" content={`${data.obj.episodeName} | Permacast`} />
                    <meta name="twitter:url" content={`https://permacast.app/`}></meta>
                    <meta name="twitter:description" content={`By ${data.podcastName}`} />
                    <meta name="og:card" content="summary" />
                    <meta name="description" content={`By ${data.podcastName}`} />
                    <meta name="og:image" content={(data.cover !== "") ? ARSEED_URL + data.cover : "https://permacast.app/favicon.png"} />
                    <meta name="og:title" content={`${data.obj.episodeName} | Permacast`} />
                    <meta name="og:url" content={`https://permacast.app/`} />
                    <meta name="og:description" content={`By ${data.podcastName}`} /> 
                </Head>
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
                        mediaLink={ARSEED_URL + data.obj.contentTx}
                        podcastOwner={data?.obj.owner}
                        playButton={playButton}
                    />
                    {/*Episode Description*/}
                    <EpisodeDescription
                        text={d.description}
                    />
                    {/*Next Episode*/}
                    <Episodes
                        containerTitle={"Next Episode"} 
                        imgSrc={ARSEED_URL + data?.cover}
                        color={'rgb(255, 255, 255)'}
                        episodes={[]}
                        podcastId={data?.obj.pid}
                    />
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
            </>
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
    // translations
    const { locale } = context;  
    const translations = await serverSideTranslations(locale, ['common']);
  
    // Fetch data from external API
    const { contractAddress } = getContractVariables();
    const { params } = context
    const episodeId = params.eid
    const podcastId = params.pid
    const res = await axios.post(EXM_READ_LINK+contractAddress)
    const podcasts = res.data?.podcasts
    const foundPodcast = findPodcast(podcastId, podcasts)
    // Podcast Exists
    if (foundPodcast) {
        const podcastData = {
            cover: foundPodcast.cover,
            podcastName: foundPodcast.podcastName,
            owner: foundPodcast.owner,
            author: foundPodcast.author,
            pid: foundPodcast.pid,
            episodes: foundPodcast.episodes,
            podcast: foundPodcast
        }
        const foundEpisode = findEpisode(episodeId, foundPodcast.episodes)
        // Episode Exist
        if (foundEpisode) {
            const podcastName = foundPodcast.podcastName
            const data = { ...podcastData, obj: foundEpisode, podcastName}
            const status = PAYLOAD_RECEIVED
            return { props: { data, status, ...translations } }
        // Episode Doesnt Exist
        } else {
            const data = null
            const status = NO_EPISODE_FOUND
            return { props: { data, status, ...translations } } 
        }
    // Podcast Doesnt Exist
    } else {
        const data = null
        const status = NO_PODCAST_FOUND
        return { props: { data, status, ...translations } } 
    }
}
