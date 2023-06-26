import { useRef, useState } from "react";
import { Podcast } from "../../interfaces";
import {BiChevronLeft, BiChevronRight} from 'react-icons/bi'
import FeaturedPodcast, { featuredPocastCarouselStyling } from "../home/featuredPodcast";

interface podcastCarouselInter {
    podcasts: Podcast[]
}

export default function FeaturedPodcastCarousel(props: podcastCarouselInter) {

    const rowRef = useRef<HTMLDivElement>(null);
    const [isMoved, setIsMoved] = useState(false);
    const btnStyling = "absolute top-0 bottom-0 bg-gray-500/50 rounded-full m-auto z-50 h-6 w-6 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"

    const handleClick = (e: string) => { 
        setIsMoved(true);
        if (rowRef.current) {
            const { scrollLeft, clientWidth} = rowRef.current;
            const scrollTo = e === "left" ?
            scrollLeft - clientWidth 
            : 
            scrollLeft + clientWidth

            rowRef.current.scrollTo({left: scrollTo, behavior: 'smooth'})
        }
    }

    return (
        <div className=" group relative">
          <BiChevronLeft height={10} color="#fff" width={10}  
            className={`${btnStyling} left-2 
                ${!isMoved && "hidden"}`}
                onClick={() => handleClick("left")}
            />
            <div className={featuredPocastCarouselStyling+ " group relative "} ref={rowRef}>
                {props.podcasts.map((podcast: Podcast, index: number) => (
                <FeaturedPodcast {...podcast } key={index} />
                ))}
            </div>
            <BiChevronRight  height={10} color="#fff" width={10} 
                className={`${btnStyling} right-2`}
              onClick={() => handleClick("right")}
            />
        </div>
    )
}