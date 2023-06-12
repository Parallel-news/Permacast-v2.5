import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState } from "recoil";

import { loadingPage } from "@/atoms/index";
import { ARSEED_URL, ERROR_TOAST_TIME, PERMA_TOAST_SETTINGS, RSS_IMPORT_LINK, RSS_META_LINK } from "@/constants/index";
import { PODCAST_TEMPLATE } from "@/constants/ui";
import { Podcast } from "@/interfaces/index";
import { rssEpisode } from "@/interfaces/rss";

import { getPodcastData } from "@/features/prefetching";
import { convertLinktoBase64, isValidUrl } from "@/utils/reusables";

const Icon = React.lazy(() => import("@/component/icon").then(module => ({ default: module.Icon })));
const ImportedEpisodes = React.lazy(() => import("@/component/uploadShow/importEpisodes"));
const RssSubmit = React.lazy(() => import("@/component/reusables/RssSubmit").then(module => ({ default: module.default })));
const ShowForm = React.lazy(() => import("@/component/uploadShow/uploadShowTools").then(module => ({ default: module.ShowForm })));
const Transition = React.lazy(() => import("@headlessui/react").then(module => ({ default: module.Transition })));
const ValMsg = React.lazy(() => import("@/component/reusables").then(module => ({ default: module.ValMsg })))

const rssContainer = "whFull flexColYCenter justify-start space-y-3"
const rssInputContainer = "w-[80%] md:w-[60%] space-x-2 flexYCenter"
const rssInputStyling = "w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white default-animation "


export default function rss() {

  const { t } = useTranslation();

  const queryPodcastData = getPodcastData();

  const [coverUrl, setCoverUrl] = useState<string>('')
  const [fetchError, setFetchError] = useState<string>("")
  const [index, setIndex] = useState<number>(0)
  const [newPodcasts, setNewPodcasts] = useState<Podcast[]>([])
  const [pid, setPid] = useState<string>("")
  const [podcastFormSubmitted, setPodcastFormSubmitted] = useState<boolean>(false)
  const [rssFeed, setRssFeed] = useState<rssEpisode[]>([])
  const [rssLink, setRssLink] = useState<string>("")
  const [rssLinkError, setRssLinkError] = useState<string>("")
  const [step, setStep] = useState(0)
  const [submittingLink, setSubmittingLink] = useState(false)

  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage)

  useEffect(() => {
    _setLoadingPage(false)
  }, []);

  useEffect(() => {
    if (pid) {
      const podcasts = queryPodcastData?.data?.podcasts || [];
      const cover = podcasts.find((podcast: Podcast) => podcast.pid === pid)?.cover;
      if (cover) {
        console.log("cover: ", cover)
        setCoverUrl(ARSEED_URL + cover);
      };
      setStep(2);
    };
  }, [pid]);

  const [rssMeta, setRssMeta] = useState<Podcast[]>([PODCAST_TEMPLATE]);

  async function submitLink() {
    setSubmittingLink(true)
    setRssLinkError("")

    if (!rssLink.length) {
      setRssLinkError("rss.emptyinput");
      setSubmittingLink(false);
      return false;
    }

    if (!isValidUrl(rssLink)) {
      setRssLinkError("rss.invalidurl");
      setSubmittingLink(false);
      return false;
    }

    if (!rssLink.startsWith("http")) {
      setRssLinkError("rss.http-not-supported");
      setSubmittingLink(false);
      return false;
    }

    const base64 = convertLinktoBase64(rssLink);
    let rssFeed: rssEpisode[] = [];
    let rssMetadata;
    // Fetch Episodes
    try {
      const download = (await axios.get(RSS_IMPORT_LINK + base64)).data;
      if (download?.error) throw new Error("Incorrect url");
      rssFeed = download || [];
      setRssFeed(download);
    } catch (e) {
      setFetchError("rss.norssepisode")
      setSubmittingLink(false)
      toast.error("Incorrect Link", PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
      return false
    }

    // Fetch Metadata
    try {
      rssMetadata = (await axios.get(RSS_META_LINK + base64)).data;
      console.log('rssMetadata', rssMetadata)
      // attempt to unpack, fail if the standard is not followed
      const { title, description, author, email, isExplicit, language, categories, cover } = rssMetadata;
    } catch (e) {
      setFetchError("rss.norsspodcast")
      setSubmittingLink(false)
      toast.error(fetchError, PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
      return false
    }
    setCoverUrl(rssMetadata.cover);
    setRssMeta(prevState => {
      const updatedPodcasts = prevState.map(podcast => {
        return {
          ...podcast,
          podcastName: rssMetadata.title || '',
          description: rssMetadata.description || '',
          author: rssMetadata.author || '',
          email: rssMetadata.email || '',
          explicit: rssMetadata.isExplicit === "false" ? "no" : "yes",
          language: rssMetadata.language || '',
          categories: [rssMetadata.categories],
          cover: rssMetadata.cover || '',
        };
      });
      return updatedPodcasts;
    });

    setSubmittingLink(false);
    setStep(1);
    console.log("RSS FEED: ", rssFeed)
  };

  return (
    <div className="flexCol justify-center w-full space-y-7">

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
              submitLink()
            }}
          >
            <input
              type="text"
              className={rssInputStyling}
              placeholder={t("rss.rssfeedurl")}
              value={rssLink}
              onChange={(e) => setRssLink(e.target.value)}
            />
            <RssSubmit
              isSubmitting={submittingLink}
              color="bg-[rgb(255,255,0)]"
              dimensions="h-10 w-11"
              onClick={() => submitLink()}
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
          <Icon className="h-6 w-6 mr-1" icon="CHEVLEFT" />
        </button>
        <ShowForm
          podcasts={queryPodcastData.data?.podcasts || []}
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
          <Icon className="h-6 w-6 mr-1" icon="CHEVLEFT" />
        </button>
        <ImportedEpisodes
          index={index}
          coverUrl={coverUrl}
          pid={pid}
          RSSLink={rssLink}
          rssEpisodes={rssFeed}
        />
      </Transition>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    },
  };
};
