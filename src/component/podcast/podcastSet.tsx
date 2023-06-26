import { useRecoilState } from "recoil";
import { backgroundColorAtom } from "../../atoms";

import { ARSEED_URL } from "../../constants";
import React, { useEffect, useState } from "react";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import {  FullEpisodeInfo, Podcast } from "../../interfaces";
import { convertPodcastsToEpisodes, findPodcast, trimChars } from "../../utils/filters";
import { useTranslation } from "next-i18next";
import { TipModal } from "../../component/tipModal";
import { ShareButtons } from "../../component/shareButtons";
import { useArconnect } from "react-arconnect";

const PodcastBanner = React.lazy(() => import("../../component/podcast/pidTools").then(module => ({ default: module.PodcastBanner })));
const ErrorTag = React.lazy(() => import("../../component/episode/eidTools").then(module => ({ default: module.ErrorTag })));
const FeaturedPodcastPlayButton = React.lazy(()=> import("../../component/home/featuredPodcastPlayButton"))
const Loading = React.lazy(()=> import("../../component/reusables/loading"))
const Track = React.lazy(()=> import("../../component/reusables/track"))

const nextEpisodeTitleStyling = "text-2xl text-neutral-300/90 font-semibold"
const podcastIdStyling = "flex flex-col space-y-4 w-[100%] mb-[200px]"

interface podcastInter {
    podcast: Podcast
}

export default function PodcastSet(props: podcastInter) {
    const {podcast} = props

    const { address } = useArconnect()

    const [, setBackgroundColor] = useRecoilState(backgroundColorAtom);
    const [loadTipModal, setLoadTipModal] = useState<boolean>(false)
    const [loadShareModal, setLoadShareModal] = useState<boolean>(false)
    const [baseUrl, setBaseUrl] = useState<string>("")
    const [color, setColor] = useState<string>("")

    const [themeColor, setThemeColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('');

    const { t } = useTranslation();

    if (podcast) {
        //State Calls Here
        const { podcastName, author, episodes, cover, pid, owner, description } = podcast;
        const fullEpisodeInfo = convertPodcastsToEpisodes([podcast]);
        const imgSrc = ARSEED_URL + cover;
        const playerInfo = { playerColorScheme: themeColor, buttonColor: themeColor, accentColor: textColor, title: episodes[0]?.episodeName, artist: author, cover, src: episodes.length ? episodes?.[0]?.contentTx : undefined };

        useEffect(() => {
            if (typeof window !== 'undefined') setBaseUrl(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : ""));
            const fetchColor = async () => {
                const dominantColor = await fetchDominantColor(cover);
                const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba);
                setColor("rgb(255, 255, 255)")
                setBackgroundColor(coverColor)
                setThemeColor("rgb(255, 255, 255)")
                setTextColor("rgb(255, 255, 255)")
            }
            fetchColor();
        }, []);

        return (
            <>
                <div className={podcastIdStyling}>
                    <PodcastBanner
                        podcast={podcast}
                        imgSrc={imgSrc}
                        title={podcastName}
                        description={description}
                        color={color}
                        setLoadTipModal={() => setLoadTipModal(true)}
                        podcastId={pid}
                        podcastOwner={owner}
                        setLoadShareModal={() => setLoadShareModal(true)}
                        playButton={
                            episodes.length > 0 ?
                                <FeaturedPodcastPlayButton {...{ playerInfo, podcastInfo: podcast, episodes: fullEpisodeInfo }} />
                                :
                                <></>
                        }
                    />
                    {/*Title Track*/}
                    <p className={nextEpisodeTitleStyling + " pt-10"}>{t("episode.number")}</p>
                    {/*Episode Track*/}
                    {fullEpisodeInfo.map((episode: FullEpisodeInfo, index: number) => {
                        if(!episode.episode.isVisible && episode.episode.uploader === address) {
                            return (
                                <div key={index}>
                                    <Track {...{ episode }} includeDescription includePlayButton includeContentType />
                                </div>
                            )
                        } else if(episode.episode.isVisible) {
                            return (
                                <div key={index}>
                                    <Track {...{ episode }} includeDescription includePlayButton includeContentType />
                                </div>
                            )
                        } else {
                            return <></> 
                        }

                    }) || <Loading />}
                </div>
                {loadTipModal && (
                    <TipModal
                        to={podcastName}
                        toAddress={owner}
                        isVisible={loadTipModal}
                        setVisible={setLoadTipModal}
                    />
                )}
                {loadShareModal && (
                    <ShareButtons
                        isVisible={loadShareModal}
                        setVisible={setLoadShareModal}
                        title={podcastName + " - "}
                        url={`${baseUrl}/podcast/${trimChars(pid)}`}
                    />
                )}
            </>
        )
    }
    return <ErrorTag msg={"404"}/>    
}