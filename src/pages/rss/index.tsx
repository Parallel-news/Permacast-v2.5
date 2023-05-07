import axios from "axios";
import { useRecoilState } from "recoil";
import { toast } from "react-hot-toast";
import { GetServerSideProps } from "next";
import { loadingPage } from "../../atoms";
import { Podcast } from "../../interfaces";
import { Loading } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { getContractVariables } from "../../utils/contract";
import RssSubmit from "../../component/reusables/RssSubmit";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid"
import { convertLinktoBase64, isValidUrl } from "../../utils/reusables";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EpisodeRssContainer from "../../component/reusables/episodeRssContainer";
import { EXM_READ_LINK, NO_SHOW, RSS_IMPORT_LINK, RSS_META_LINK, TOAST_DARK } from "../../constants";

const ValMsg = React.lazy(() => import("../../component/reusables").then(module => ({default: module.ValMsg})))
const ShowForm = React.lazy(() => import("../../component/uploadShow/uploadShowTools").then(module => ({ default: module.ShowForm })));

const iconStyling = "w-6 h-6 text-zinc-800"
const rssContainer = "h-full w-full flex flex-col justify-start items-center space-y-3"
const rssInputContainer = "w-[80%] md:w-[60%] flex flex-row space-x-2 flex items-center"
const rssInputStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"

export default function rss({yourShows}) {

    const [step, setStep] = useState(0)
    const [submittingLink, setSubmittingLink] = useState(false)
    const [rssLink, setRssLink] = useState<string>("")
    const [rssLinkError, setRssLinkError] = useState<string>("")
    const [fetchError, setFetchError] = useState<string>("")
    const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage)

    const { t } = useTranslation();

    useEffect(() => {
        _setLoadingPage(false)
    }, [])

    const [rssMeta, setRssMeta] = useState<Podcast[]>([{
        pid: "",
        label: "",
        contentType: "",
        createdAt: 0,
        owner: "",
        podcastName: "", //check
        author: "", //check
        email: "",
        description: "", // markdown file tx on arseeding
        language: "", // check
        explicit: "", //check
        categories: [], // check
        maintainers: [],
        cover: "", // cover
        isVisible: true,
        episodes: [],
        minifiedCover: ""
      }]);

    async function submitLink() {
        setSubmittingLink(true)
        setRssLinkError("")

        if(!rssLink.length) {
            setRssLinkError("rss.emptyinput");
            setSubmittingLink(false);
            return false;
        }

        if(!isValidUrl(rssLink)) { 
            setRssLinkError("rss.invalidurl"); 
            setSubmittingLink(false); 
            return false;
        }

        const base64 = convertLinktoBase64(rssLink)
        let rssFeed;
        let rssMetadata;
        // Fetch Episodes
        try {
            rssFeed = await axios.get(RSS_IMPORT_LINK+base64)
        } catch(e) {
            setFetchError("rss.norssepisode")
            setSubmittingLink(false)
            toast.error(fetchError, {style: TOAST_DARK})
            return false
        }
        // Fetch Metadata
        try {
            rssMetadata = await axios.get(RSS_META_LINK+base64)
        } catch(e) {
            setFetchError("rss.norsspodcast")
            setSubmittingLink(false)
            toast.error(fetchError, {style: TOAST_DARK})
            return false
        }
        //console.log(rssFeed)
        //console.log(rssMetadata)

        setRssMeta(prevState => {
            const updatedPodcasts = prevState.map(podcast => {
              return {
                ...podcast,
                podcastName: rssMetadata.data.title,
                description: rssMetadata.data.description,
                author: rssMetadata.data.author,
                explicit: rssMetadata.data.isExplicit === "false" ? "no": "yes",
                language: rssMetadata.data.language,
                categories: [rssMetadata.data.categories],
                cover: rssMetadata.data.cover
              };
            });
            return updatedPodcasts;
        });

        setSubmittingLink(false)
        setStep(1)
    }
    console.log("rssMeta: ", rssMeta)
    return (
        <div className="flex flex-col justify-center w-full space-y-7">
            {/*Step 1: Fetch RSS Data*/}
            <p className="text-white text-3xl m-auto">{t("rss.importrss")}</p>
            <Transition
                show={step === 0}
                appear={true}
                enter="transform transition duration-[100ms]"
                enterFrom="opacity-0 scale-75"
                enterTo="opacity-100 scale-100"
                leave="transform transition duration-[100ms]"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-75 scale-75"
            >
                <div className={rssContainer}>
                    
                    <div className={rssInputContainer}>
                        <input 
                            type="text" 
                            className={rssInputStyling} 
                            placeholder={t("rss.rssfeedurl")} 
                            value={rssLink} 
                            onChange={(e) => setRssLink(e.target.value)}
                        />
                        <RssSubmit 
                            icon={submittingLink ? <Loading type="spinner" size="lg" color="currentColor" /> : <ArrowSmallRightIcon className={iconStyling} /> }
                            color="bg-green-500"
                            dimensions="h-10 w-11"
                            onClick={() => submitLink()}
                        />
                    </div>
                    <ValMsg valMsg={rssLinkError} className="pl-2" />

                </div>
            </Transition>
            {/*Step 2: Show Form*/}
            <Transition
                show={step === 1}
                appear={true}
                enter="transform transition duration-[500ms]"
                enterFrom="opacity-0 scale-75"
                enterTo="opacity-100 scale-100"
                leave="transform transition duration-[500ms]"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-75 scale-75"
            >
                <ShowForm 
                    podcasts={yourShows}
                    edit={true}
                    rssData={rssMeta}
                    redirect={false}
                />
            </Transition>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale } = context;
    const query = context.query.query || '';
    const { contractAddress } = getContractVariables()
    let yourShows = null
    let error = "";
    let pid = ""
    try {
      const res = await axios.get(EXM_READ_LINK+contractAddress)
      yourShows = res.data?.podcasts
    } catch(e) {
      error = NO_SHOW
    }
    return {
      props: {
        query,
        ...(await serverSideTranslations(locale, ['common'])),
        yourShows,
        error,
        pid
      },
    };
  };

/*
<div className="w-[75%]">
    <EpisodeRssContainer 
        rightTitle={<p className="text-white/75 text-2xl">Episode 1: Introduction</p>}
        leftTitle={<p className="text-white/75 text-2xl">{"22 mb"+"         "+"0.1 AR"}</p>}
    />
</div>
*/