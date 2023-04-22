import React from "react";

const PodcastButtons = React.lazy(() => import("./reusables").then(module => ({ default: module.PodcastButtons })));
const PodcastInfo = React.lazy(() => import("./reusables").then(module => ({ default: module.PodcastInfo })));
const PodcastInfoMobile = React.lazy(() => import("./reusables").then(module => ({ default: module.PodcastInfoMobile })));

// 1. Interfaces
export interface PodcastBannerInter  {
    color: string;
    setLoadTipModal: (v: any) => void;
    setLoadShareModal: (v: any) => void;
    podcastId: string;
    podcastOwner: string;
    playButton: JSX.Element;
    title: string;
    imgSrc: string;
    description: string;
}

// 2. Stylings
export const podcastInfoDescStyling = "text-neutral-400 text-[12px]"
export const podcastInfoMobileStyling = "flex flex-col xl:flex-row items-center space-x-16 justify-start xl:justify-start xl:hidden"
export const podcastInfoStyling = "items-center space-x-16 justify-start xl:justify-start hidden xl:flex xl:flex-row"
export const podcastInfoTitleStyling = "text-3xl font-semibold select-text items-start justify-start"

export const podcastBannerStyling = "flex flex-col xl:flex-row w-full justify-between space-y-8 xl:space-y-0 text-center xl:text-left w-full"
export const podcastInfoTitleDivStyling = "flex flex-col ml-0 m-0 mr-[64px]"

// 3. Custom Functions

//4. Custom Components
export const PodcastBanner = (props: PodcastBannerInter) => {
    return (
        <div className={podcastBannerStyling}>
            <PodcastInfo 
                imgSrc={props.imgSrc}
                title={props.title}
                description={props.description}
                color={props.color}
            />
            <PodcastInfoMobile 
                imgSrc={props.imgSrc}
                title={props.title}
                description={props.description}
                color={props.color}
            />

            <PodcastButtons 
                color={props.color}
                setLoadTipModal={props.setLoadTipModal}
                podcastId={props.podcastId}
                podcastOwner={props.podcastOwner}
                setLoadShareModal={props.setLoadShareModal}
                playButton={props.playButton}
            />
        </div>
    )
}