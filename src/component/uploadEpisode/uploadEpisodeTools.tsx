import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FiFile } from 'react-icons/fi';
import { FADE_IN_STYLE, FADE_OUT_STYLE } from '../../constants';

export default function uploadEpisode() {
    return false
}

// 1. Interfaces

// 2. Styling
export const trayIconStyling="h-5 w-5 mr-2"
export const episodeTitleStyling = "text-white text-xl mt-4"
export const titleModalStyling = "flex justify-between w-full"
export const inputEpisodeMediaStyling = "opacity-0 absolute z-[-1]"
export const xBtnModalStyling = "text-white text-xl cursor-pointer"
export const episodeFaFileStyling = "w-7 h-6 cursor-pointer rounded-lg mx-2"
export const episodeMediaStyling = "bg-zinc-800 rounded-xl cursor-pointer w-full"
export const selectPodcastModalStyling = "absolute inset-0 flex justify-center items-center"
export const episodeFormStyling = "w-[50%] flex flex-col justify-center items-center space-y-4"
export const containerPodcastModalStyling = "w-[50%] h-[100%] bg-zinc-800 rounded-3xl flex justify-center z-10 p-6"
export const uploadEpisodeStyling = "flex flex-col justify-center items-center m-auto space-y-3 relative"
export const uploadButtonStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
export const selectPodcastStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8 w-full"
export const episodeNameStyling = "input input-secondary w-full py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
export const labelEpisodeMediaStyling = "flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-1 py-2 px-3 w-full cursor-pointer w-full"
export const episodeDescStyling =  "input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"


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
                <SelectPodcastModal 
                    isVisible={isVisible}
                    setVisible={setIsVisible}
                />
            :
            ""
            }
        </>
    )
}

export const PodcastSelectOption = () => {
    return (
        <div>
            <p>Option</p>
        </div>
    )
}

interface SelectPodcastModalInter {
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export const SelectPodcastModal = (props: SelectPodcastModalInter) => {

    const [showModal, setShowModal] = useState<boolean>(false)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowModal(prev => !prev);
        }, 100);
    
        return () => {
            clearTimeout(timeoutId);
        };
    }, [props.isVisible])

    return(
        <div className={selectPodcastModalStyling}>
            <div className={`${containerPodcastModalStyling} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>
                <div className={titleModalStyling}>
                    <div></div>
                    <p className="text-white text-xl">Select Podcast</p>
                    <p className={xBtnModalStyling} onClick={() => props.setVisible(false)}>x</p>
                </div>
            </div>
        </div>
    )
}




