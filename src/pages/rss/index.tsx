import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState } from "recoil";

import { Transition } from "@headlessui/react";
import { ArrowSmallRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid"
import { Loading } from "@nextui-org/react";

import { loadingPage, allPodcasts } from "../../atoms";
import { Podcast, rssEpisode } from "../../interfaces";
import { getContractVariables } from "../../utils/contract";
import RssSubmit from "../../component/reusables/RssSubmit";
import { convertLinktoBase64, isValidUrl } from "../../utils/reusables";
import { ARSEED_URL, EXM_READ_LINK, NO_SHOW, RSS_IMPORT_LINK, RSS_META_LINK, TOAST_DARK } from "../../constants";
import { ImportedEpisodes } from "../../component/uploadShow/importedEpisodes";
import { MOCK_RSS_FEED_EPISODES } from "../../utils/mockdata/rssfeed";


const ValMsg = React.lazy(() => import("../../component/reusables").then(module => ({default: module.ValMsg})))
const ShowForm = React.lazy(() => import("../../component/uploadShow/uploadShowTools").then(module => ({ default: module.ShowForm })));

const iconStyling = "w-6 h-6 text-zinc-800"
const rssContainer = "h-full w-full flex flex-col justify-start items-center space-y-3"
const rssInputContainer = "w-[80%] md:w-[60%] flex flex-row space-x-2 flex items-center"
const rssInputStyling = "w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white default-animation "

const FULL_TESTING = 0;
const TESTING_URL = "https://feeds.libsyn.com/247424/rss";

interface RSSDownloadError {
    error: string;
};

export default function rss({yourShows}) {

    const [step, setStep] = useState(0)
    const [submittingLink, setSubmittingLink] = useState(false)
    const [rssLink, setRssLink] = useState<string>(FULL_TESTING ? TESTING_URL : "")
    const [rssLinkError, setRssLinkError] = useState<string>("")
    const [fetchError, setFetchError] = useState<string>("")
    const [podcastFormSubmitted, setPodcastFormSubmitted] = useState<boolean>(false)
    const [rssFeed, setRssFeed] = useState<rssEpisode[]>([]);
    const [newPodcasts, setNewPodcasts] = useState<Podcast[]>([])
    // temp
    const [index, setIndex] = useState<number>(0);
    const [pid, setPid] = useState<string>("")
    const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage)

    const [allPodcastsState, setAllPodcastsState] = useRecoilState<Podcast[]>(allPodcasts);

    const [coverUrl, setCoverUrl] = useState<string>('');

    const { t } = useTranslation();

    useEffect(() => {
        _setLoadingPage(false)
    }, []);

    useEffect(() => {
        if (pid) {
            const cover = allPodcastsState.find(show => show.pid === pid)?.cover;
            if (cover) {
                console.log("cover: ", cover)
                setCoverUrl(ARSEED_URL + cover);
            };
            setStep(2);
        };
    }, [pid]);
    
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

        const base64 = convertLinktoBase64(rssLink);
        let rssFeed: rssEpisode[] = [];
        let rssMetadata;
        // Fetch Episodes
        try {
            const download = FULL_TESTING ? MOCK_RSS_FEED_EPISODES: (await axios.get(RSS_IMPORT_LINK+base64)).data;
            if (download?.error) throw new Error("Incorrect url");
            rssFeed = download.episodes;
            setRssFeed(download.episodes);
        } catch(e) {
            setFetchError("rss.norssepisode")
            setSubmittingLink(false)
            toast.error("Incorrect Link", {style: TOAST_DARK})
            return false
        }
        // Fetch Metadata
        try {
            rssMetadata = (await axios.get(RSS_META_LINK+base64)).data;
            // attempt to unpack, fail if the standard is not followed
            const { title, description, author, email, isExplicit, language, categories, cover } = rssMetadata;
        } catch(e) {
            setFetchError("rss.norsspodcast")
            setSubmittingLink(false)
            toast.error(fetchError, {style: TOAST_DARK})
            return false
        }
        setCoverUrl(rssMetadata.cover);
        setRssMeta(prevState => {
            const updatedPodcasts = prevState.map(podcast => {
              return {
                ...podcast,
                podcastName: rssMetadata.title,
                description: rssMetadata.description,
                author: rssMetadata.author,
                email: rssMetadata.email,
                explicit: rssMetadata.isExplicit === "false" ? "no": "yes",
                language: rssMetadata.language,
                categories: [rssMetadata.categories],
                cover: rssMetadata.cover,
              };
            });
            return updatedPodcasts;
        });

        setSubmittingLink(false);
        setStep(1);
        console.log("RSS FEED: ", rssFeed)
    };

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
                    
                    <form className={rssInputContainer} 
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitLink( )}
                        }
                    >
                        <input 
                            type="text" 
                            className={rssInputStyling} 
                            placeholder={t("rss.rssfeedurl")} 
                            value={rssLink} 
                            onChange={(e) => setRssLink(e.target.value)}
                        />
                        <RssSubmit 
                            icon={submittingLink ? <Loading type="spinner" size="lg" color="currentColor" /> : <ArrowSmallRightIcon className={iconStyling} /> }
                            color="bg-[rgb(255,255,0)]"
                            dimensions="h-10 w-11"
                            onClick={() => submitLink(  )}
                        />
                    </form>
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
                <button
                    className="bg-zinc-800 text-white rounded-full h-10 w-10 flex items-center justify-center"
                    onClick={() => setStep(0)}
                >
                    <ChevronLeftIcon className="h-6 w-6 mr-1" />
                </button>
                <ShowForm 
                    podcasts={yourShows}
                    edit={true}
                    selectedPid={pid}
                    rssData={rssMeta}
                    redirect={false}
                    allowSelect={true}
                    submitted={setPodcastFormSubmitted}
                    setUploadedPID={setPid}
                    setUploadedIndex={setIndex}
                    returnedPodcasts={setNewPodcasts}
                />
            </Transition>

            {/*Step 3: Show Episode List*/}
            <Transition
                show={step === 2}
                appear={true}
                enter="transform transition duration-[500ms]"
                enterFrom="opacity-0 scale-75"
                enterTo="opacity-100 scale-100"
                leave="transform transition duration-[500ms]"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-75 scale-75"
            >
                <button 
                    className="bg-zinc-800 text-white rounded-full h-10 w-10 flex items-center justify-center"
                    onClick={() => {
                        setPid('');
                        setStep(1)
                    }}
                >
                    <ChevronLeftIcon className="h-6 w-6 mr-1" />
                </button>
                <ImportedEpisodes
                    index={index}
                    coverUrl={coverUrl}
                    pid={pid}
                    rssEpisodes={rssFeed}
                />
            </Transition>
            {/*
            UNDER CONSTRUCTION
            1. (DONE) Upload form and retrieve pid
            2. (DONE) Once pid is retrieved, open episode column
            3. (DONE) Have episode UI appear with a submit
            4. Check if enough AR in account 
            5. Conduct upload but check if description is present and needs to be uploaded.

            
            */}
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
---THIS IS THE EPISODE BOX-----
<div className="w-[75%]">
    <EpisodeRssContainer 
        rightTitle={<p className="text-white/75 text-2xl">Episode 1: Introduction</p>}
        leftTitle={<p className="text-white/75 text-2xl">{"22 mb"+"         "+"0.1 AR"}</p>}
    />
</div>
*/


/*
{
    "function": "editPodcastMetadata",
    "name": "Bankless",
    "desc": "PUWvo3-gtQPaKyOly1Hl4BZsnwIa_2lWaBg77vIJPEU",
    "author": "Bankless",
    "lang": "en",
    "isExplicit": "no",
    "categories": "Business",
    "email": "s@s.com",
    "cover": "kalS4NNpdnJGiHyNZcKeczmBEkhSW0bgKCQMW92MjGE",
    "minifiedCover": "D3DN9Ga0qC1Jq_Cq4aoaRLVyiksFAsVLbMXOWYAgL0A",
    "label": "",
    "jwk_n": "ore9C3L6mJeAfkC7Qpw9E4n8HwaD9HZ00CUKm1ThimUURysKShr_KSkpTYXbW6v8ZM6s8ANRCZ1OzI6PlzoK9ix5jiyd-Pt-uHVA-jyyUc2NPR3GVh6IAtO5t40-1yEDw15J20m0uF_DSzmFfeJ8gS6SZpUNBwXqyhK7qoRanFIVpHacmePrKDigtSpsXn9lIjjsOBMNw1X7KwpkpoSIF76LZ-YFQy9sndfPbmENSfXkU0d7y2fSgopNCVafoQnRS9K9fvYsVz-zptwjHpNqPs-ZhcoApnXpcC6Vy3iQ5i1erHKfJYz5aOVneTD0jUu39hOQ8gCWyMW84kZRPlzctCrMA31f-IFZeblTl1EsE3_iHrkptkq_jG0TxpEzfSjO43W0vvEuriLSUmA-hRBQao5iNPktC4qMBUsNdcHUdSkeOq_YpKKsXYLTfhy2FAHpE3R1KC4dCC_fFSUAHxHSbT4yciR-cF4tuGJPHswUZmfJ4lDdWoKEgNi_968MwUsvXPdo5SCvnrLL_zL-Hr_O3yz4oHoy1RWMLZJ-jphBGOuY8EBjreJQ556Lgnwjmh4NPf_zGw2rDm852QoFY3P2peafqtriUQO3wySYR29Ieu8cZWiwbQ5A-s1HhhsvAGbKjWwAOg2dDKQKzO75AavWqxY5DsgLM4va0Pq7xDZyY48",
    "txid": "0x22e3c3f6e3df4729a30b477fce1e88011a5fddf2e42f26d17a7a406b78611b57",
    "sig": "iNIEAriLVnJ2rBOcvTNhBzt2KoxZJ2hpDOW/7qJLka2Ju/vh6IBL1cZo2BaU37Wbl0qzDw+hcEi8/iSoDZesitDN8jsBamcOmKpjj1NF/SRvuKTv2wYAh63nZgVMUisk6SghjZUoQ/D7OGXmzh6esb6M8ylRtGGSehiHUS+qPI860pr+UJjazUi57Q8C1JEWa96m1N6yhR3eqUVdmQ9WJ1dtTDg+vQ7cuQKglNKdBdUcHFK3P+jQagnhpS4I4e2jMcU/cI4Hafu/tT5JNEe9xquVSnZV7fMabGC3NaiDT1FoSAS9AHsK+LyDEFgBtv5eTc2ifhiiACkWzBqb0CLiOo9lbUAPOg6NMoRveDJFb7KKaiMzQk2ZpQtj1bhNGKdO9HUatT3wcYFxGIAHYs9BijX56fXXRP2fEjevYh/9p8jWAiyuvnXqksaAUwaNvY0m2JiBEn7/8iBixM/kxncO2B8y5EFgOHco4yGh/Llf4X1QvmOsp7DoEoLral4n92hhAHuO1JOIhM5auCp+cTyMVe85DekVXKvNI47LTLEIlIMZFz3DQsW0VX7Nam68cmHfnRsskxddr5LLlhfp6/HKqp0AYvU6q8jh65/mreznxEh63WNW3f09F26QBJwplIz2wriPxiHx9B0DSDStg4KmMBwe8NeOD1rYE7jrR/DXrL0=",
    "isVisible": true
}




*/
