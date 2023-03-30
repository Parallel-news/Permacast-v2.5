import axios from "axios";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRecoilState } from "recoil";
import { backgroundColor, loadTipModal } from "../../atoms";
import { 
    Episodes,
    ErrorTag,
    podcastIdStyling,
} from "../../component/episode/eidTools";
import { PodcastBanner } from "../../component/podcast/pidTools";
import { EXM_READ_LINK, ARWEAVE_READ_LINK, PAYLOAD_RECEIVED, NO_PODCAST_FOUND } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { findObjectById } from "../../utils/reusables";
import { TipModal } from "../../component/tipModal";
import { useEffect, useState } from "react";
import { ShareButtons } from "../../component/shareButtons";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";

export default function PodcastId({data, status}) {
    const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);
    const [loadTipModal, setLoadTipModal] = useState<boolean>(false)
    const [loadShareModal, setLoadShareModal] = useState<boolean>(false)
    const [baseUrl, setBaseUrl] = useState<string>("")
    const [color, setColor] = useState<string>("")
    /*
    useEffect(() => {
        if(typeof window !== 'undefined') setBaseUrl(window.location.protocol + "//"+window.location.hostname+(window.location.port ? ":" + window.location.port : ""))
    }, [])
    */
    console.log("data: ", data)
    if(data) {
        //State Calls Here
        const imgSrc = ARWEAVE_READ_LINK+data.obj?.cover
        const title = data.obj?.podcastName
        const description = data.obj?.description
        const nextEpisodeTitle = "Episodes"
        const episodes = data.obj?.episodes

        useEffect(() => {
            if(typeof window !== 'undefined') setBaseUrl(window.location.protocol + "//"+window.location.hostname+(window.location.port ? ":" + window.location.port : ""))
            const fetchColor = async () => {
                const dominantColor = await fetchDominantColor(data.obj?.cover);
                const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba)
                setColor(textColor) 
                setBackgroundColor_(coverColor)
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
                        description={ARWEAVE_READ_LINK+description}
                        color={color}
                        setLoadTipModal={() => setLoadTipModal(true)}
                        podcastId={data.obj?.pid}
                        podcastOwner={data.obj?.owner}
                        setLoadShareModal={() => setLoadShareModal(true)}
                    />
                    {/*Episode Track*/}
                    <Episodes
                        containerTitle={nextEpisodeTitle} 
                        imgSrc={imgSrc}
                        color={color}
                        episodes={episodes}
                        podcastId={data.obj?.pid}
                    />            
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
                        title={"Check this out "}
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
        return { props: { data, status, ...translations } }
    // Podcasts Not Found
    } else {
        const status = NO_PODCAST_FOUND
        const data = null
        return { props: { data, status, ...translations } }  
    }   
}