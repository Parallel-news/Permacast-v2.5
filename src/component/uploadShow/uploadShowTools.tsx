import { useEffect, useRef, useState } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline";
import { episodeDescStyling, episodeNameStyling } from "../uploadEpisode/uploadEpisodeTools";
import { LanguageOptions, CategoryOptions } from "../../utils/languages";

export default function uploadShowTools() {
    return false
}

// 1. Interfaces
interface ImgCoverInter {
    img: any;
}

// 2. Stylings
export const imgStyling = "h-48 w-48 text-slate-400"
export const photoIconStyling = "h-11 w-11 text-zinc-400"
export const selectDropdownRowStyling = "flex flex-row w-full justify-between"
export const emptyCoverIconTextStyling = "text-lg tracking-wider pt-2 text-zinc-400"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-4"
export const uploadShowStyling = "w-full flex flex-col justify-center items-center space-y-3"
export const coverContainerInputStyling = "opacity-0 z-index-[-1] absolute pointer-events-none"
export const imgCoverStyling = "flex items-center justify-center bg-slate-400 h-48 w-48 rounded-[20px]"
export const selectDropdownStyling="select select-secondary w-[49%] py-2 px-5 text-base font-normal input-styling bg-zinc-800"
export const coverContainerLabelStyling = "cursor-pointer transition duration-300 ease-in-out text-zinc-600 hover:text-white flex md:block md:h-full w-48"
export const emptyCoverIconStyling = "input input-secondary flex flex-col items-center justify-center cursor-pointer bg-zinc-800 h-48 w-48 rounded-[20px] outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-zinc-600"

// 3. Custom Functions

// 4. Components
export const ShowForm = () => {
    return (
        <div className={showFormStyling}>
            {/*First Row*/}
            <div className="flex flex-row w-full">
                <div className="w-[25%] flex justify-center">
                    <CoverContainer />
                </div>
                <div className="flex flex-col w-[50%] space-y-3">
                    {/*Episode Name*/}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="showName" placeholder={"Show Name"} />
                    {/*Episode Description*/}
                    <textarea className={episodeDescStyling + " h-32"} required title="Between 1 and 5000 characters" name="showShowNotes" placeholder={"Description"}></textarea>
                    {/*Author*/}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Author" type="text" name="showName" placeholder={"Author"} />
                    {/*Email*/}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Email" type="text" name="showName" placeholder={"Email"} />
                    {/*Genre and Language*/}
                    <SelectDropdownRow />
                    {/*Explicit and Audio/Video Selector*/}
                    <MiscRow />
                </div>
                <div className="w-[25%]"></div>
            </div>
            
        </div>
    )
}

export const CoverContainer = () => {
    const podcastCoverRef = useRef();
    const [img, setImg] = useState("");
    const [coverActive, setCoverActive] = useState<boolean>(false)
    
    return (
        <>
        <input
            required
            type="file"
            accept="image/*"
            className={coverContainerInputStyling}
            ref={podcastCoverRef}
            onChange={(e) => ""}
            name="podcastCover"
            id="podcastCover"
        />
        <label
            htmlFor="podcastCover"
            className={coverContainerLabelStyling}
        >
            {/*@ts-ignore*/}
            {podcastCoverRef.current?.files?.[0] ? <ImgCover img={img} /> : <EmptyCover />}
      </label>
      </>
    )
    //handleChangeImage(e)
}

export const EmptyCover = () => {
    return (
        <div className={emptyCoverIconStyling}>
          {/*Image Logo*/}
            <PhotoIcon className={photoIconStyling} />
          {/*Cover Image Text*/}
            <div className={emptyCoverIconTextStyling}>
              Cover Image
            </div>
        </div>
    )
}

export const ImgCover = (props: ImgCoverInter) => {
    return (
        <div className={imgCoverStyling}>
            <img src={props.img} className={imgStyling} />
        </div>
    )
}

export const SelectDropdownRow = () => {
    return (
        <div className={selectDropdownRowStyling}>
            <select
                className={`${selectDropdownStyling} mr-[2%]`}
                id="podcastCategory"
                name="category"
                onChange={(e) => {  
                    console.log(e.target.value)
                    //setPodcastCategory_(e.target.value);
                }}
            >
                <option>Arts</option>
                <option>Business</option>
            </select>
            <select
                className={selectDropdownStyling}
                id="podcastLanguage"
                name="language"
                onChange={(e) => {
                    console.log(e)
                    //setPodcastLanguage_(e.target.value);
                }}
            >
                <option>English</option>
                <option>Chinese</option>
            </select>
        </div>
    )
}

export const MiscRow = () => {
    return (
        <div className={selectDropdownRowStyling}>
            <ExplicitInput />
        </div>
    )
}

export const ExplicitInput = () => {
    return (
    <label className="flex items-center mr-5">
        <input
            id="podcastExplicit"
            type="checkbox"
            className="checkbox mr-2 border-2 border-zinc-600"
            onChange={() => {
                return false
                //setPodcastExplicit_(!podcastExplicit_)
            }}
        />
        <span className="label-text cursor-pointer text-zinc-400 font-semibold">
            Contains Explicit Content
        </span>
    </label>
    )
}
