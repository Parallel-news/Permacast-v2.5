import axios from "axios";
import Head from "next/head";
import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EXM_READ_LINK, NO_PODCAST_FOUND, PAYLOAD_RECEIVED, NO_EPISODE_FOUND, ARSEED_URL, MESON_ENDPOINT } from "../../../../constants";
import { getContractVariables } from "../../../../utils/contract";
import { hasBeen10Min } from "../../../../utils/reusables";
import { findEpisode, findPodcast } from "../../../../utils/filters";
import { checkContentTypeFromUrl } from "../../../../utils/fileTools";
import { useRecoilState } from "recoil";
import { loadingPage } from "../../../../atoms";

const ErrorTag = React.lazy(() => import("../../../../component/episode/eidTools").then(module => ({ default: module.ErrorTag })));
const EpisodeSet = React.lazy(() => import("../../../../component/episode/episodeSet"))

export default function EpisodeId({data, status, mimeType}) {

    const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage)
    useEffect(() => {
        _setLoadingPage(false)
    }, [data])

    if (data) {
        return (
            <>
                <Head>
                    <title>{`${data.podcastName} | Permacast`}</title> 
                    <meta name="description" content={`By ${data.podcastName}`} />
                    <meta name="twitter:card" content="player"></meta>
                    <meta name="twitter:image" content={(data.cover !== "") ? ARSEED_URL + data.cover : "https://permacast.app/favicon.png"} />
                    <meta name="twitter:title" content={`${data.obj.episodeName} | Permacast`} />
                    <meta name="twitter:description" content={`By ${data.podcastName}`} />
                    <meta name="twitter:player:width" content="640"></meta>
                    <meta name="twitter:player:height" content="360"></meta>
                    <meta name="twitter:player" content={hasBeen10Min(data?.obj.uploadedAt) ? MESON_ENDPOINT+ data.obj.contentTx : ARSEED_URL + data.obj.contentTx}></meta>
                    <meta name="twitter:url" content={`https://permacast.app/`}></meta>

                    <meta property="og:type" content="video" />
                    <meta property="og:image" content={(data.cover !== "") ? ARSEED_URL + data.cover : "https://permacast.app/favicon.png"} />
                    <meta property="og:title" content={`${data.obj.episodeName} | Permacast`} />
                    <meta property="og:url" content={hasBeen10Min(data?.obj.uploadedAt) ? MESON_ENDPOINT+ data.obj.contentTx : ARSEED_URL + data.obj.contentTx} />
                    <meta property="og:description" content={`By ${data.podcastName}`} />
                    <meta property="og:video" content={hasBeen10Min(data?.obj.uploadedAt) ? MESON_ENDPOINT+ data.obj.contentTx : ARSEED_URL + data.obj.contentTx}></meta>
                    <meta property="og:video:type" content={mimeType} />
                    <meta property="og:video:width" content="640" />
                    <meta property="og:video:height" content="360" />
                </Head>
                <EpisodeSet 
                    data={data}
                />
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
            const mimeType = await checkContentTypeFromUrl(hasBeen10Min(foundEpisode.uploadedAt) ? MESON_ENDPOINT+ foundEpisode.contentTx : ARSEED_URL + foundEpisode.contentTx)
            const podcastName = foundPodcast.podcastName
            const data = { ...podcastData, obj: foundEpisode, podcastName}
            const status = PAYLOAD_RECEIVED
            return { props: { data, status, mimeType, ...translations } }
        // Episode Doesnt Exist
        } else {
            const data = null
            const status = NO_EPISODE_FOUND
            const mimeType = ""
            return { props: { data, status, mimeType, ...translations } } 
        }
    // Podcast Doesnt Exist
    } else {
        const data = null
        const status = NO_PODCAST_FOUND
        return { props: { data, status, ...translations } } 
    }
}
