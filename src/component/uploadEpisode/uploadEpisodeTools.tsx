import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { FiFile } from 'react-icons/fi';
import { FADE_IN_STYLE, FADE_OUT_STYLE } from '../../constants';
import { Blur } from '../reusables/Blur';

export default function uploadEpisode() {
    return false
}

// 1. Interfaces

// 2. Styling
export const trayIconStyling="h-5 w-5 mr-2"
export const inputEpisodeMediaStyling = "opacity-0 absolute z-[-1]"
export const episodeFaFileStyling = "w-7 h-6 cursor-pointer rounded-lg mx-2"
export const episodeMediaStyling = "bg-zinc-800 rounded-xl cursor-pointer w-full"
export const episodeFormStyling = "w-[50%] flex flex-col justify-center items-center space-y-4"
export const uploadEpisodeStyling = "flex flex-col justify-center items-center m-auto space-y-3"
export const uploadButtonStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
export const episodeNameStyling = "input input-secondary w-full py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
export const labelEpisodeMediaStyling = "flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-1 py-2 px-3 w-full cursor-pointer w-full"
export const episodeDescStyling =  "input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"

export const selectPodcastStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8 w-full"
// 3. Custom Functions
const onFileUpload = () => {
    return false
    //params e.target.files?.[0]
}


// 4. Components
export const EpisodeForm = () => {
    return(
        <div className={episodeFormStyling}>
            {/*Select Podcast*/}
            <SelectPodcast />
            {/*Episode Name*/}
            <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="episodeName" placeholder={"Episode Name"} />
            {/*Episode Description*/}
            <textarea className={episodeDescStyling} required title="Between 1 and 5000 characters" name="episodeShowNotes" placeholder={"Description"}></textarea>
            {/*Episode Media*/}
            <EpisodeMedia />
            {/*Upload Button*/}
            <UploadButton />
        </div>
    )
}

export const EpisodeMedia = () => {
    return (
        <div className={episodeMediaStyling}>
            <input className={inputEpisodeMediaStyling} id="file" required type="file" onChange={(e) => onFileUpload()} name="episodeMedia" />
            <label htmlFor="file" className={labelEpisodeMediaStyling}>
                <FiFile className={episodeFaFileStyling} />
                <div>
                    Episode Media
                </div>
            </label>
        </div>
    )
}

export const UploadButton = () => {
    return (
        <button
            className={uploadButtonStyling}
            type="submit"
        >
            <ArrowUpTrayIcon className={trayIconStyling} />
            Upload
      </button>
    )
}

export const SelectPodcast = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    return (
        <>
            <button className={selectPodcastStyling+ " relative"} onClick={() => setIsVisible(prev => !prev)}>
                Select Podcast
            </button>
            {isVisible ?
                <Blur /> 
            :
            ""
            }
             
        </>
    )
}

export const PodcastSelectOption = () => {
    return (
        <li>
            <button type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                <div className="inline-flex items-center">
                    <svg aria-hidden="true" className="h-3.5 w-3.5 rounded-full mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="flag-icon-css-cn" viewBox="0 0 512 512"><defs><path id="a" fill="#ffde00" d="M1-.3L-.7.8 0-1 .6.8-1-.3z"/></defs><path fill="#de2910" d="M0 0h512v512H0z"/><use width="30" height="20" transform="matrix(76.8 0 0 76.8 128 128)" xlinkHref="#a"/><use width="30" height="20" transform="rotate(-121 142.6 -47) scale(25.5827)" xlinkHref="#a"/><use width="30" height="20" transform="rotate(-98.1 198 -82) scale(25.6)" xlinkHref="#a"/><use width="30" height="20" transform="rotate(-74 272.4 -114) scale(25.6137)" xlinkHref="#a"/><use width="30" height="20" transform="matrix(16 -19.968 19.968 16 256 230.4)" xlinkHref="#a"/></svg>
                    China
                </div>
            </button>
        </li>
    )
}

export const SelectPodcastModal = () => {

}

