import { GetServerSideProps } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RssSubmit from "../../component/reusables/RssSubmit";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid"
import { useState } from "react";
import { Loading } from "@nextui-org/react";

const iconStyling = "w-6 h-6 text-zinc-800"
const rssContainer = "h-full w-full flex flex-col justify-start items-center space-y-10"
const rssInputContainer = "w-[80%] md:w-[60%] flex flex-row space-x-2 flex items-center"
const rssInputStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"

import { styled } from '@stitches/react';

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
    //<Loading type="spinner" size="lg" color="currentColor" />
    //<ArrowSmallRightIcon className={iconStyling} />
    return (
        <div className={rssContainer}>
            <p className="text-white text-3xl">Import RSS</p>
            <div className={rssInputContainer}>
                <input type="text" className={rssInputStyling} placeholder="RSS Feed Url"/>
                <RssSubmit 
                    icon={submittingLink ? <Loading type="spinner" size="lg" color="currentColor" /> : <ArrowSmallRightIcon className={iconStyling} /> }
                    color="bg-green-500"
                    dimensions="h-10 w-11"
                    onClick={() => setSubmittingLink(prev => !prev)}
                />
            </div>
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