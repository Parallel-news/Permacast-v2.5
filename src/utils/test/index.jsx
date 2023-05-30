import React, { useState, useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import TipButton from "../../component/reusables/tip";
import { switchFocus } from "../../atoms";
import { MESON_ENDPOINT } from "../../constants";

export default function Episode(props) {
  const { podcastId, episodeNumber } = [2,3]
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);
  const [episode, setEpisode] = useState();
  const [nextEpisode, setNextEpisode] = useState();
  const [loading, setLoading] = useState(true);
  const [rgb, setRgb] = useState({});

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [videoShows_, setVideoShows_] = useState([]);

  useEffect(() => {
    setEpisode();

    // setVideoShows_(
    //   primaryData_.podcasts.filter((obj) => {
    //     return obj.pid === props.match.params.podcastId;
    //   })[0].episodes
    // );
    const playerObj_ = document.getElementById("hidden-player");
    if (!(playerObj_ === null)) {
      playerObj_.src =
      MESON_ENDPOINT + episode?.contentTx;
    }
    // console.log(episode)
  
    // playerObj_.pause();
    // console.log(playerObj_)
  }, []);
    // console.log(playerObj_);

  // playerObj_.src = "https://arweave.net/" + secondaryData_.episodes.filter((obj) => {
  //   return obj.eid === episodeNumber;
  // })[0].contentTx

  return (
    <div>
      {episode ? (
        <div>
          <div
            className={`w-full mb-6 bg-black rounded-[2px] transition-all ${
              switchFocus_
                ? "opacity-0 h-[0px] duration-200"
                : "opacity-100 h-[607.50px] duration-200"
            }`}
          >
            <video
              id="hidden-player"
              class="video-js"
              controls
              preload="auto"
              poster={"https://arweave.net/"}
              data-setup="{}"
              className="rounded-[4px] w-full h-full"
            >
              <source
                src={
                  "https://arweave.net/6DGL3pxXomRkcgbuUAKqXCdtFSgUuiXYcB9vM8OeFZc"
                }
                type="video/*"
              ></source>
              <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                  href="https://videojs.com/html5-video-support/"
                  target="_blank"
                >
                  supports HTML5 video
                </a>
              </p>
            </video>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={"https://arweave.net/"}
              className="w-40 h-40 cursor-pointer"
              // onClick={() => history.push(`/podcast/${podcastId}`)}
            />
            <div className="mt-8 md:mt-0 md:ml-8 flex flex-col">
              <div className="text-center md:text-left text-3xl font-medium text-gray-200 select-text">
                {episode?.episodeName}
              </div>
              <div className="flex flex-row justify-center md:justify-start items-center mt-2">
                <div
                  className="px-3 py-1 text-xs mr-2 rounded-full bg-black/30"
                  style={{
                    backgroundColor: rgb?.backgroundColor,
                    rgb: rgb?.color,
                  }}
                >
                  {t("episode.number")}{" "}
                </div>
                <div className={"text-sm text-gray-200"}>
                  {new Date(
                    episode?.createdAt ? episode.createdAt * 1000 : 1
                  ).toDateString() + ""}
                </div>
              </div>
              <div className="mt-5 flex flex-col md:flex-row items-center gap-x-4">
                <div className="flex flex-row items-center gap-x-2">
                  <div className="-ml-1.5 rounded-full pointer scale-[0.8] bg-black/30">
                    <PlayButton episode={episode} />
                  </div>
                  <TipButton />
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <a
                    href={`${MESON_ENDPOINT}${episode.contentTx}`}
                    className="flex items-center rounded-full btn btn-sm normal-case text-sm font-medium border-0"
                    style={{
                      backgroundColor: rgb?.backgroundColor,
                      color: rgb?.color,
                    }}
                    download
                  >
                    <Icon className="w-4 h-4 mr-2" icon="ARROWDOWNTRAY"/>
                    {t("episode.download")}
                  </a>
                  <button
                    className="flex items-center rounded-full btn btn-sm normal-case text-sm font-medium border-0"
                    style={{
                      backgroundColor: rgb?.backgroundColor,
                      color: rgb?.color,
                    }}
                    onClick={() => {
                      setCopied(true);
                      setTimeout(() => {
                        if (!copied) setCopied(false);
                      }, 2000);
                      // navigator.clipboard.writeText(window.location.href);
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" icon="ARROWUPTRAY"/>
                    {copied ? t("episode.copied") : t("episode.share")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-gray-400 mt-8 select-text">
            {episode?.description
              ? episode.description
              : t("episode.nodescription")}
          </div>
          {nextEpisode && (
            <div>
              <div className="text-3xl text-gray-300 my-8">
                {t("episode.nextepisode")}
              </div>

              <div className="p-2.5 border rounded-xl border-zinc-600">
                {/* <Track
                  episode={nextEpisode}
                  episodeNumber={
                    primaryData_.podcasts
                      .filter((obj) => {
                        return obj.pid === podcastId;
                      })[0]
                      .episodes.findIndex((obj) => {
                        return obj.eid === episodeNumber;
                      }) + 2
                  }
                /> */}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>{/* TODO FIGURE THIS OUT */}</>
      )}
    </div>
  );
}

// pages/blog/[slug].js
export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      '/episode/pid/eid',
      // Object variant:
      // { params: { slug: 'second-post' } },
    ],
    fallback: true,
  }
}

// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  }
}
