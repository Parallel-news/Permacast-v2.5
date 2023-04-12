import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EXM_READ_LINK } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import React from "react";
import { EXMState, Podcast } from "../../interfaces";
import { findPodcast } from "../../utils/filters";
import { NextPage } from "next";

const PodcastSet = React.lazy(()=> import("./reusables"))


const PodcastId: NextPage<{ podcast: Podcast }> = ({ podcast }) => {
    return(
        <PodcastSet 
            podcast={podcast}
        />
    )
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