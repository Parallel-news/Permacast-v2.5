import { PlayIcon } from "@heroicons/react/24/outline";
import { FC } from 'react'
import Track from "./track.jsx";
import { useTranslation } from "next-i18next";
import TipButton from "./reusables/tip";
import { FaRss, FaRegGem } from "react-icons/fa";
import { PlusIcon } from "@heroicons/react/24/solid";
import UploadEpisode from "./uploadEpisode";
import UploadVideo from "./uploadVideo";
import { CheckAuthHook, getButtonRGBs } from "../utils/ui.js";
import { useRecoilState } from "recoil";

import { globalModalOpen, switchFocus } from "../atoms";

interface PodcastHeaderInterface {
  thePodcast:          any;
  isOwner:             boolean;
  loading:             boolean;
  currentPodcastColor: string;
}

const PodcastHeader:FC<PodcastHeaderInterface> = ({
  thePodcast,
  isOwner,
  loading,
  currentPodcastColor,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useRecoilState(globalModalOpen);

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);

  const loadRss = () => {
    window.open("rss" + "thePodcast.podcastId", "_blank");
  };
  return (
    <div className={``}>
      {/* {secondaryData_ && Object.keys(secondaryData_).length > 0 && ( */}
      {true && (
        <div className="pb-14 flex flex-col justify-center md:flex-row md:items-center w-full">
          {/* <img
            className="w-40 cursor-pointer rounded-sm mx-auto md:mx-0 md:mr-8"
            src={"https://arweave.net/" + secondaryData_?.cover}
            alt={secondaryData_.podcastName}
          />
          <div className="col-span-2 my-3 text-zinc-100 w-full md:w-4/6 md:mr-2">
            <div className="text-center md:text-left text-xl font-semibold tracking-wide select-text line-clamp-1 hover:line-clamp-none">
              {secondaryData_?.podcastName}
            </div>
            <div className="line-clamp-5 hover:line-clamp-none select-text">
              {secondaryData_?.description}
            </div>
          </div> */}
          <div className="mx-auto md:mx-0 md:ml-auto md:mr-9">
            <div className="flex items-center justify-between">
              <button
                className="btn btn-primary btn-sm normal-case rounded-full border-0"
                style={getButtonRGBs(currentPodcastColor)}
                onClick={() => loadRss()}
              >
                <FaRss className="mr-2 w-3 h-3" />
                <span className="font-normal">RSS</span>
              </button>
              {!isOwner && (
                <div className="ml-4">
                  <TipButton />
                </div>
              )}
              {/* {secondaryData_ && isOwner && (
                <button
                  className="btn btn-outline btn-sm normal-case rounded-full border-0 flex cursor-pointer font-normal ml-4"
                  style={getButtonRGBs(currentPodcastColor)}
                  onClick={() => setIsOpen(true)}
                >
                  <PlusIcon className="mr-2 w-4 h-4" />{" "}
                  {t("podcast.newepisode")}
                </button>
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastHeader