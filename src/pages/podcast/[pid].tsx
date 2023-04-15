import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ARSEED_URL, EXM_READ_LINK } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { EXMState, Podcast } from "../../interfaces";
import { findPodcast } from "../../utils/filters";

const PodcastSet = React.lazy(() => import("../../component/podcast/podcastSet"))

const PodcastId: NextPage<{ podcast: Podcast }> = ({ podcast }) => {
    if (podcast) {
        //State Calls Here
        const { podcastName, author, cover } = podcast;
        const imgSrc = ARSEED_URL + cover;

        return(
            <>
                <Head>
                    <title>{`${podcastName} | Permacast`}</title>
                    <meta name="description" content={`By ${author}`} />
                    <meta name="twitter:card" content="summary_large_image"></meta>
                    <meta name="twitter:image" content={(cover !== "") ? imgSrc : "https://permacast.app/favicon.ico"} />
                    <meta name="twitter:title" content={`${podcastName} | Permacast`} />
                    <meta name="twitter:url" content={`https://permacast.app/`}></meta>
                    <meta name="twitter:description" content={`By ${author}`} />
                    
                    <meta property="og:type" content="article" />
                    <meta name="description" content={`By ${author}`} />
                    <meta name="og:image" content={(cover !== "") ? imgSrc : "https://permacast.app/favicon.ico"} />
                    <meta name="og:title" content={`${podcastName} | Permacast`} />
                    <meta name="og:url" content={`https://permacast.app/`} />
                    <meta name="og:description" content={`By ${author}`} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:image:alt" content="Show Cover" />
                </Head>
                <PodcastSet 
                    podcast={podcast}
                />
            </>
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
    const EXM: EXMState = (await axios.post(EXM_READ_LINK + contractAddress)).data;
    const { podcasts } = EXM;

    let podcast = findPodcast(podcastId, podcasts);
    if(!podcast) {
        podcast = null
    }

    return { props: { podcast, ...translations } };
}

export default PodcastId;