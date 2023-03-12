export default function fun() {
    return false
}

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 */

// 1. Interfaces 
export interface EpisodeNumberInter {
    episodeNum: string;
    color: string;
}

export interface DescriptionContainerInter {
    text: string;
}

export interface EpisodeInfoButtonsInter {
    color: string;
}

export interface EpisodeInfoSubInter {
    date: string;
    color: string;
    episodeNum: string;
}

export interface EpisodeBannerInter extends EpisodeInfoInter {
    imgSrc: string;
}

export interface EpisodeInfoInter extends EpisodeInfoSubInter {
    title: string;
}

// 2. Stylings
export const episodeIconStyling = "mr-2 w-4 h-4"
export const podcastIdStyling = "flex flex-col space-y-8 w-[75%]"
export const episodeInfoButtonsStyling = "flex flex-row space-x-6"
export const episodeDateStyling = "text-gray-500 text-[11px] font-bold"
export const episodeBannerStyling = "flex flex-row w-full h-60 space-x-16"
export const episodeInfoStyling = "flex flex-col justify-center space-y-4"
export const episodeInfoSubStyling = "flex flex-row items-center space-x-3"
export const episodeNumberStyling = "rounded-2xl bg-gray-400/30 p-2 py-1 text-[11px]"
export const episodeTitleStyling = "text-white text-[40px] font-medium pb-0 flex items-end"

// 3. Custom Functions

