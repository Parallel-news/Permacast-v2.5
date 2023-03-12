import Image from "next/image"
import { DescriptionButton } from "../../component/reusables/buttons"
import { HeartIcon, ArrowDownTrayIcon, ArrowTopRightOnSquareIcon, PlayIcon } from '@heroicons/react/24/solid';

export default function PodcastId() {
    return (
        <div className="w-[75%]">
            <EpisodeBanner />
        </div>
        
    )
}

const EpisodeBanner = () => {
    return (
        <div className="flex flex-row w-full h-60 space-x-16">
            <Image
                src="/aa.jpg"
                alt="Episode Cover"
                height={25}
                width={225}
                className="object-cover rounded-3xl"
            />
            <EpisodeInfo />
        </div>
    )
}

const EpisodeInfo = () => {
    return (
        <div className="flex flex-col justify-center space-y-4">
            <p className="text-white text-[40px] font-medium pb-0 flex items-end">All Core Devs: Meeting 9</p>
            <EpisodeInfoSub />
            <EpisodeInfoButtons />
        </div>
    )
}

const EpisodeInfoSub = () => {
    return(
        <div className="flex flex-row items-center space-x-3">
            <EpisodeNumber 
                episodeNum="1"
                color="#6366f1"
            />
            <p className="text-gray-500 text-[11px] font-bold">May 10, 2022</p>
        </div>
    )
}

const EpisodeInfoButtons = () => {
    return (
        <div className="flex flex-row space-x-6">
            <DescriptionButton 
                icon={<PlayIcon className="w-6 h-6" />}
                text={""}
                color="#6366f1"
            />
            <DescriptionButton
                icon={<HeartIcon className="mr-2 w-4 h-4" />} 
                text={"Tip"}
                color="#6366f1" 
            />
            <DescriptionButton
                icon={<ArrowDownTrayIcon className="mr-2 w-4 h-4 stroke-2" />} 
                text={"Download"}
                color="#6366f1"
            />
            <DescriptionButton
                icon={<ArrowTopRightOnSquareIcon className="mr-2 w-4 h-4 stroke-2" />} 
                text={"Share"}
                color="#6366f1"
            />
        </div>
    )
}

interface EpisodeNumberInter {
    episodeNum: string;
    color: string;
}

const EpisodeNumber = (props: EpisodeNumberInter) => {
    return (
        <p className="rounded-2xl bg-gray-400/30 p-2 py-1 text-[10px]" style={{color: props.color}}>Episode {props.episodeNum}</p>
    )
}