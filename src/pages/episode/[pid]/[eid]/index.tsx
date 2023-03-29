import axios from "axios";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { backgroundColor, loadTipModal } from "../../../../atoms";
import { 
    EpisodeBanner,
    EpisodeDescription,
    Episodes,
    ErrorTag,
    podcastIdStyling,
 } from "../../../../component/episode/eidTools";
import { EXM_READ_LINK, ARWEAVE_READ_LINK, NO_PODCAST_FOUND, PAYLOAD_RECEIVED, NO_EPISODE_FOUND } from "../../../../constants";
import { getContractVariables } from "../../../../utils/contract";
import { findObjectById, formatStringByLen } from "../../../../utils/reusables";
import { TipModal } from "../../../../component/tipModal";
import { ShareButtons } from "../../../../component/shareButtons";

export default function EpisodeId({data, status}) {
    const [, setBackgroundColor_] = useRecoilState(backgroundColor);
    const [loadTipModal, setLoadTipModal] = useState<boolean>(false)
    const [loadShareModal, setLoadShareModal] = useState<boolean>(false)
    const [baseUrl, setBaseUrl] = useState<string>("")
    if(data) {
        useEffect(() => {
            setBackgroundColor_(color)
        }, [])
        //Serverside Results
        const ts = new Date(data?.obj.uploadedAt);
        const formattedDate = ts.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const d = data?.obj
        console.log("big: ", data)
        const color = "#818cf8"
        const nextEpisodeTitle = "Next Episode"
        const date = formattedDate
        const creator = data?.obj.uploader.length > 15 ? formatStringByLen(data?.obj.uploader, 4, 4) : data?.obj.uploader
        const episodes = d.episodes
        console.log("Data : ", data)

        useEffect(() => {
            if(typeof window !== 'undefined') setBaseUrl(window.location.protocol + "//"+window.location.hostname+(window.location.port ? ":" + window.location.port : ""))
        }, [])

        return (
            <>
                <Head>
                    <title>{`Episode | Permacast`}</title> 
                    <meta name="description" content={`By ${data.podcastName}`} />
                    <meta name="twitter:image" content={(data.cover !== "") ? `https://arweave.net/${data.cover}` : "https://ar.page/favicon.png"} />
                    <meta name="twitter:title" content={`${data.obj.episodeName} | Permacast`} />
                    <meta name="twitter:url" content={`https://permacast.dev/`}></meta>
                    <meta name="twitter:description" content={`By ${data.podcastName}`} />
                    <meta name="og:card" content="summary" />
                    <meta name="description" content={`By ${data.podcastName}`} />
                    <meta name="og:image" content={(data.cover !== "") ? `https://arweave.net/${data.cover}` : "https://ar.page/favicon.png"} />
                    <meta name="og:title" content={`${data.obj.episodeName} | Permacast`} />
                    <meta name="og:url" content={`https://permacast.dev/`} />
                    <meta name="og:description" content={`By ${data.podcastName}`} /> 

                </Head>
                <div className={podcastIdStyling}>
                    {/*Episode Cover & Info*/}
                    <EpisodeBanner 
                        title={d.episodeName}
                        imgSrc={ARWEAVE_READ_LINK+data?.cover}
                        color={color}
                        episodeNum={data?.index+1}
                        date={date}
                        setLoadTipModal={() => setLoadTipModal(true)}
                        setLoadShareModal={() => setLoadShareModal(true)}
                        mediaLink={ARWEAVE_READ_LINK+data.obj.contentTx}
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
                        podcastId={data?.obj.pid}
                    />
                    <button onClick={() => setLoadShareModal(prev => !prev)}>
                        Show
                    </button>
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
                            title={"Check this out "}
                            url={`${baseUrl}/episode/${data?.pid}/${data?.obj.eid}`}
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
    const foundPodcasts = findObjectById(podcasts, podcastId, "pid")
    // Podcast Exists
    if(foundPodcasts) {
        const podcastData = {
            cover: foundPodcasts.obj.cover,
            podcastName: foundPodcasts.obj.podcastName,
            owner: foundPodcasts.obj.owner,
            pid: foundPodcasts.obj.pid
        }
        const foundEpisode = findObjectById(foundPodcasts.obj.episodes, episodeId, "eid")
        // Episode Exist
        if(foundEpisode) {
            const podcastName = foundPodcasts.obj.podcastName
            const data = { ...podcastData, ...foundEpisode, podcastName}
            const status = PAYLOAD_RECEIVED
            return { props: { data, status } }
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
