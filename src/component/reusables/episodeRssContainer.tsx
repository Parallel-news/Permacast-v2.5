import { ReactElement } from "react";

interface EpisodeRssContainerInter {
    rightTitle?: ReactElement<any, any>;
    leftTitle?: ReactElement<any, any>;
}

export default function EpisodeRssContainer(props: EpisodeRssContainerInter) {
    const containerStyling = "flex flex-row justify-between items-center bg-zinc-800 rounded-xl w-full h-[60px] py-2 px-6"
    return (
        <div className={containerStyling}>
            {props.rightTitle}
            {props.leftTitle}
        </div>
    )
}