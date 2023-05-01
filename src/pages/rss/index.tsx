import { GetServerSideProps } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RssSubmit from "../../component/reusables/RssSubmit";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid"
import { useState } from "react";
import { Loading } from "@nextui-org/react";
import { convertLinktoBase64, isValidUrl } from "../../utils/reusables";
import axios from "axios";

const iconStyling = "w-6 h-6 text-zinc-800"
const rssContainer = "h-full w-full flex flex-col justify-start items-center space-y-10"
const rssInputContainer = "w-[80%] md:w-[60%] flex flex-row space-x-2 flex items-center"
const rssInputStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"

import { styled } from '@stitches/react';
import { RSS_IMPORT_LINK, TOAST_DARK } from "../../constants";
import { toast } from "react-hot-toast";

const MyLoading = styled(Loading, {
    '--my-loading-color': '#27272a', // Replace $myColor with your desired color value
});

function CustomLoading() {
  return (
    <div>
      <MyLoading type="spinner" size="lg" css={{ color: 'var(--my-loading-color)' }} />
    </div>
  );
}

export default function rss() {

    const [step, setStep] = useState(0)
    const [submittingLink, setSubmittingLink] = useState(false)
    const [rssLink, setRssLink] = useState<string>("")
    const [rssLinkError, setRssLinkError] = useState<string>("")
    const [fetchError, setFetchError] = useState<string>("")

    async function submitLink() {
        setSubmittingLink(true)
        setRssLinkError("")
        console.log(rssLink)
        //Check if fied is empty
        if(!rssLink.length) return setRssLinkError("Please fill out field.")
        if(!isValidUrl(rssLink)) return setRssLinkError("Please enter a valid URL")
        //Turn link into base64
        const base64 = convertLinktoBase64(rssLink)
        console.log(base64)
        let rssFeed;
        try {
            rssFeed = await axios.get(RSS_IMPORT_LINK+base64)
        } catch(e) {
            toast.error(fetchError, {style: TOAST_DARK})
            return false
        }
        console.log(rssFeed)
        setSubmittingLink(false)
    }

    return (
        <div className={rssContainer}>
            <p className="text-white text-3xl">Import RSS</p>
            <div className={rssInputContainer}>
                <input 
                    type="text" 
                    className={rssInputStyling} 
                    placeholder="RSS Feed Url" 
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