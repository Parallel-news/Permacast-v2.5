import { useEffect, useRef, useState } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline";

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
export const emptyCoverIconTextStyling = "text-lg tracking-wider pt-2 text-zinc-400"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-4"
export const imgCoverStyling = "flex items-center justify-center bg-slate-400 h-48 w-48 rounded-[20px]"
export const emptyCoverIconStyling = "input input-secondary flex flex-col items-center justify-center cursor-pointer bg-zinc-800 h-48 w-48 rounded-[20px] outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-zinc-600"

// 3. Custom Functions

// 4. Components
export const ShowForm = () => {
    return (
        <div className={showFormStyling}>
            {/*Select Cover*/}
            <CoverContainer />
        </div>
    )
}

export const CoverContainer = () => {
    const podcastCoverRef = useRef();
    const [img, setImg] = useState("");
    const [coverActive, setCoverActive] = useState<boolean>(false)

    console.log("ref: ", podcastCoverRef)
    
    return (
        <>
        <input
            required
            type="file"
            accept="image/*"
            className="opacity-0 z-index-[-1] absolute pointer-events-none"
            ref={podcastCoverRef}
            onChange={(e) => ""}
            name="podcastCover"
            id="podcastCover"
        />
        <label
        htmlFor="podcastCover"
        className="cursor-pointer transition duration-300 ease-in-out text-zinc-600 hover:text-white flex md:block md:h-full w-48"
      >
        {/*@ts-ignore*/}
        {podcastCoverRef.current?.files?.[0] ? (
            <ImgCover 
                img={img}
            />
        ) : (
            <EmptyCover />
        )}
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
