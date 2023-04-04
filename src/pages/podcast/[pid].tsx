import axios from "axios";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRecoilState } from "recoil";
import { backgroundColorAtom, loadTipModal } from "../../atoms";
import { 
    Episodes,
    ErrorTag,
    nextEpisodeTitleStyling,
    podcastIdStyling,
} from "../../component/episode/eidTools";
import { PodcastBanner } from "../../component/podcast/pidTools";
import { EXM_READ_LINK, PAYLOAD_RECEIVED, NO_PODCAST_FOUND, ARSEED_URL } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { findObjectById } from "../../utils/reusables";
import { TipModal } from "../../component/tipModal";
import { useEffect, useState } from "react";
import { ShareButtons } from "../../component/shareButtons";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import { useTranslation } from "next-i18next";
import FeaturedPodcastPlayButton from "../../component/home/featuredPodcastPlayButton";
import { FullEpisodeInfo } from "../../interfaces";
import Track from "../../component/reusables/track";
import Loading from "../../component/reusables/loading";

export default function PodcastId({data, status, fullEpisodeInfo}) {

    const { t } = useTranslation();

    const [backgroundColor, setBackgroundColor] = useRecoilState(backgroundColorAtom);
    const [loadTipModal, setLoadTipModal] = useState<boolean>(false)
    const [loadShareModal, setLoadShareModal] = useState<boolean>(false)
    const [baseUrl, setBaseUrl] = useState<string>("")
    const [color, setColor] = useState<string>("")

    const [themeColor, setThemeColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('');

    if(data) {
        //State Calls Here
        const imgSrc = ARSEED_URL + data.obj?.cover
        const title = data.obj?.podcastName
        const description = data.obj?.description
        const nextEpisodeTitle = "Episodes"
        

        const podcastInfo = data.obj
        const episodes = data.obj?.episodes
        const cover = data.obj.cover
        const playerInfo = { playerColorScheme: themeColor, buttonColor: themeColor, accentColor: textColor, title: episodes[0]?.episodeName, artist: data.obj.author, cover, src: episodes.length ? episodes?.[0]?.contentTx : undefined };

        let playButton;
        if(episodes.length) {
            playButton = <FeaturedPodcastPlayButton {...{ playerInfo, podcastInfo, episodes }} />
        } else {
            playButton = <></>
        }
        
        useEffect(() => {
            if(typeof window !== 'undefined') setBaseUrl(window.location.protocol + "//"+window.location.hostname+(window.location.port ? ":" + window.location.port : ""))
            const fetchColor = async () => {
                const dominantColor = await fetchDominantColor(data.obj?.cover);
                const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba)
                setColor(textColor) 
                setBackgroundColor(coverColor)
                setThemeColor(coverColor);
                setTextColor(textColor);
            }
            fetchColor()
        }, [])

        return (
            <>
                <Head>
                        <title>{`Show | Permacast`}</title> 
                        <meta name="description" content={`By ${data.obj.author}`} />
                        <meta name="twitter:image" content={(data.obj.cover !== "") ? `https://arweave.net/${data.obj.cover}` : "https://ar.page/favicon.png"} />
                        <meta name="twitter:title" content={`${data.obj.podcastName} | Permacast`} />
                        <meta name="twitter:url" content={`https://permacast.dev/`}></meta>
                        <meta name="twitter:description" content={`By ${data.obj.author}`} />
                        <meta name="og:card" content="summary" />
                        <meta name="description" content={`By ${data.obj.author}`} />
                        <meta name="og:image" content={(data.obj.cover !== "") ? `https://arweave.net/${data.obj.cover}` : "https://ar.page/favicon.png"} />
                        <meta name="og:title" content={`${data.obj.podcastName} | Permacast`} />
                        <meta name="og:url" content={`https://permacast.dev/`} />
                        <meta name="og:description" content={`By ${data.obj.author}`} /> 

                </Head>
                <div className={podcastIdStyling}>
                    <PodcastBanner 
                        imgSrc={imgSrc}
                        title={title}
                        description={description}
                        color={color}
                        setLoadTipModal={() => setLoadTipModal(true)}
                        podcastId={data.obj?.pid}
                        podcastOwner={data.obj?.owner}
                        setLoadShareModal={() => setLoadShareModal(true)}
                        playButton={playButton}
                    />
                    {/*Title Track*/}
                    <p className={nextEpisodeTitleStyling+ " pt-10"}>Episodes</p>
                    {/*Episode Track*/}
                    {fullEpisodeInfo.map((episode: FullEpisodeInfo, index: number) => (
                    <div className="hidden md:block" key={index}>
                        <Track {...{episode}} includeDescription includePlayButton  />
                    </div>
                    )) || <Loading />}
                    </div>
                {loadTipModal && (
                    <TipModal
                        to={data?.obj.podcastName}
                        toAddress={data?.obj.owner} 
                        isVisible={loadTipModal}
                        setVisible={setLoadTipModal}
                    />
                )}
                {loadShareModal && (
                    <ShareButtons
                        isVisible={loadShareModal} 
                        setVisible={setLoadShareModal}
                        title={data?.obj.podcastName + " - "}
                        url={`${baseUrl}/podcast/${data.obj?.pid}`}
                    />
                )}
            </>
        )
    } else if(status === NO_PODCAST_FOUND) {
        return(
            <ErrorTag 
                msg={NO_PODCAST_FOUND}
            />
        )

    } else {
        return(
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
    const podcastId = params.pid
    const res = await axios.post(EXM_READ_LINK+contractAddress)
    const podcasts = res.data?.podcasts
    const foundPodcasts = findObjectById(podcasts, podcastId, "pid")
    // Podcast Found
    if(foundPodcasts) {
        const data = foundPodcasts
        const status = PAYLOAD_RECEIVED
        const episodes = foundPodcasts.obj.episodes
        let fullEpisodeInfo = []
        for (let i = 0; i < episodes.length; i++) {
            fullEpisodeInfo[i] = {}
            const episode = foundPodcasts.obj.episodes[i]
            const podcast = foundPodcasts.obj
            fullEpisodeInfo[i] = {episode, podcast}
        }


        return { props: { data, status, fullEpisodeInfo, ...translations  } }
    // Podcasts Not Found
    } else {
        const status = NO_PODCAST_FOUND
        const data = null
        const fullEpisodeInfo = null
        return { props: { data, status, fullEpisodeInfo, ...translations  } }  
    }   
}
