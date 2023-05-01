import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { GetServerSideProps } from "next";
import { Loading } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { Transition } from "@headlessui/react";
import RssSubmit from "../../component/reusables/RssSubmit";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid"
import { convertLinktoBase64, isValidUrl } from "../../utils/reusables";
import { RSS_IMPORT_LINK, RSS_META_LINK, TOAST_DARK } from "../../constants";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const iconStyling = "w-6 h-6 text-zinc-800"
const rssContainer = "h-full w-full flex flex-col justify-start items-center space-y-10"
const rssInputContainer = "w-[80%] md:w-[60%] flex flex-row space-x-2 flex items-center"
const rssInputStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"

export default function rss() {

    const [step, setStep] = useState(0)
    const [submittingLink, setSubmittingLink] = useState(false)
    const [rssLink, setRssLink] = useState<string>("")
    const [rssLinkError, setRssLinkError] = useState<string>("")
    const [fetchError, setFetchError] = useState<string>("")

    const { t } = useTranslation();

    async function submitLink() {
        setSubmittingLink(true)
        setRssLinkError("")

        if(!rssLink.length) return setRssLinkError("Please fill out input.")
        if(!isValidUrl(rssLink)) return setRssLinkError("Please enter a valid URL")

        const base64 = convertLinktoBase64(rssLink)
        let rssFeed;
        let rssMetadata;
        // Fetch Episodes
        try {
            rssFeed = await axios.get(RSS_IMPORT_LINK+base64)
        } catch(e) {
            setFetchError(t("rss.norssepisode"))
            toast.error(fetchError, {style: TOAST_DARK})
            return false
        }
        // Fetch Metadata
        try {
            rssMetadata = await axios.get(RSS_META_LINK+base64)
        } catch(e) {
            setFetchError(t("rss.norsspodcast"))
            toast.error(fetchError, {style: TOAST_DARK})
            return false
        }
        console.log(rssFeed)
        console.log(rssMetadata)
        setSubmittingLink(false)
        setStep(1)
    }

    return (
        <>
            <Transition
                show={step === 0}
                appear={true}
                enter="transform transition duration-[500ms]"
                enterFrom="opacity-0 scale-75"
                enterTo="opacity-100 scale-100"
                leave="transform transition duration-[500ms]"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-75 scale-75"
            >
                <div className={rssContainer}>
                    <p className="text-white text-3xl">{t("rss.importrss")}</p>
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
                    <p>{rssLinkError}</p>
                </div>
            </Transition>
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
                <p>Step 2</p>
            </Transition>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale } = context;
    const query = context.query.query || '';
  
    return {
      props: {
        query,
        ...(await serverSideTranslations(locale, ['common']))
      },
    };
  };