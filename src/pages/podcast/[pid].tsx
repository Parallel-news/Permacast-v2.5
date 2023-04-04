import axios from "axios";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRecoilState } from "recoil";
import { backgroundColorAtom } from "../../atoms";
import {
    ErrorTag,
    nextEpisodeTitleStyling,
    podcastIdStyling,
} from "../../component/episode/eidTools";
import { PodcastBanner } from "../../component/podcast/pidTools";
import { EXM_READ_LINK, ARSEED_URL } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { TipModal } from "../../component/tipModal";
import { useEffect, useState } from "react";
import { ShareButtons } from "../../component/shareButtons";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import FeaturedPodcastPlayButton from "../../component/home/featuredPodcastPlayButton";
import { EXMState, FullEpisodeInfo, Podcast } from "../../interfaces";
import Track from "../../component/reusables/track";
import Loading from "../../component/reusables/loading";
import { convertPodcastsToEpisodes, findPodcast, matchFirstChars, trimChars } from "../../utils/filters";
import { NextPage } from "next";


const PodcastId: NextPage<{ podcast: Podcast }> = ({ podcast }) => {

    const [backgroundColor, setBackgroundColor] = useRecoilState(backgroundColorAtom);
    const [loadTipModal, setLoadTipModal] = useState<boolean>(false)
    const [loadShareModal, setLoadShareModal] = useState<boolean>(false)
    const [baseUrl, setBaseUrl] = useState<string>("")
    const [color, setColor] = useState<string>("")

    const [themeColor, setThemeColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('');

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
                setColor(textColor);
                setBackgroundColor(coverColor)
                setThemeColor(coverColor);
                setTextColor(textColor);
            }
            fetchColor();
        }, []);

        return (
            <>
                <Head>
                    <title>{`${podcastName} | Permacast`}</title>
                    <meta name="description" content={`By ${author}`} />
                    <meta name="twitter:image" content={(cover !== "") ? imgSrc : "https://permacast.app/favicon.ico"} />
                    <meta name="twitter:title" content={`${podcastName} | Permacast`} />
                    <meta name="twitter:url" content={`https://permacast.app/`}></meta>
                    <meta name="twitter:description" content={`By ${author}`} />
                    <meta name="og:card" content="summary" />
                    <meta name="description" content={`By ${author}`} />
                    <meta name="og:image" content={(cover !== "") ? imgSrc : "https://permacast.app/favicon.ico"} />
                    <meta name="og:title" content={`${podcastName} | Permacast`} />
                    <meta name="og:url" content={`https://permacast.app/`} />
                    <meta name="og:description" content={`By ${author}`} />
                </Head>
                <div className={podcastIdStyling}>
                    <PodcastBanner
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
                    <p className={nextEpisodeTitleStyling + " pt-10"}>Episodes</p>
                    {/*Episode Track*/}
                    {fullEpisodeInfo.map((episode: FullEpisodeInfo, index: number) => (
                        <div key={index}>
                            <Track {...{ episode }} includeDescription includePlayButton />
                        </div>
                    )) || <Loading />}
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

export async function getServerSideProps(context) {
    // translations
    const { locale } = context;

    const translations = await serverSideTranslations(locale, ['common']);
    // Fetch data from external API
    const { contractAddress } = getContractVariables();
    const { params } = context
    const podcastId = params.pid
    const EXM: EXMState = (await axios.post(EXM_READ_LINK + contractAddress)).data;
    const { podcasts } = EXM;

    const podcast = findPodcast(podcastId, podcasts);

    return { props: { podcast, ...translations } };
}

export default PodcastId;