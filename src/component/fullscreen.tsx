import { FC, useEffect, useState } from 'react';
import { useTranslation } from "next-i18next";
import { useRecoilState } from 'recoil';
import { currentEpisodeAtom, currentPodcastAtom } from '../atoms';
import Image from 'next/image';
import { ARSEED_URL } from '../constants';
import { WhiteLargeFont } from './creator';
import { MoonLoader } from 'react-spinners';

interface BackgroundImageProps {
  cover: string;
  episodeName: string;
};

interface FullscreenStaticImageProps {
  cover?: string;
  episodeName: string;
  currentEpisodeIndex: number;
};

export const BackgroundCoverImageStyling = `absolute h-full w-full blur-lg opacity-30 object-cover `;
export const FullscreenInnerContentStyling = `mt-28 absolute w-full text-center select-text `;
export const LargeGrayTextStyling = `text-xl text-gray-300 `;
export const FullscreenOuterStyling = `absolute h-full w-full z-20 bg-black overflow-y-hidden `;
export const FullscreenVideoWrapperStyling = `flex items-center justify-center w-full h-screen `;
export const FullscreenEpisodeTextStyling = `absolute bottom-[110px] left-[0px] md:bottom-[75px] default-animation w-[100%] `;

export const BackgroundImage: FC<BackgroundImageProps> = ({ cover, episodeName }) => (
  <Image
    width={1000}
    height={1000}
    className={BackgroundCoverImageStyling}
    src={ARSEED_URL + cover}
    alt={episodeName}
  />
);

export const FullscreenEpisodeText: FC<{ currentEpisodeIndex: number, episodeName: string }> = ({ currentEpisodeIndex, episodeName }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={WhiteLargeFont + " mt-5"}>
        {t("fullscreen.episode")} #{currentEpisodeIndex + 1}
      </div>
      <div className={LargeGrayTextStyling + "mt-2"}>{episodeName}</div>
    </>
  );
};

export const FullscreenStaticImage: FC<FullscreenStaticImageProps> = ({ cover, episodeName, currentEpisodeIndex }) => {
  const { t } = useTranslation();

  return (
    <div className={FullscreenInnerContentStyling}>
      <Image
        className="w-[25%] mx-auto"
        src={ARSEED_URL + cover}
        alt={episodeName}
        width={1000}
        height={1000}
      />
      <FullscreenEpisodeText {...{ currentEpisodeIndex, episodeName }} />
    </div>
  );
};

export const FullscreenVideo: FC<FullscreenStaticImageProps> = ({ episodeName, currentEpisodeIndex }) => {

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 4000);
  }, []);

  return (
    <div className={FullscreenVideoWrapperStyling}>
      {/*DETECT*/}
      {!loaded && (<MoonLoader />)}
      <div id="video-player" className="relative w-full h-0 aspect-w-16 aspect-h-9"></div>
      {loaded && (
        <div className={FullscreenEpisodeTextStyling + "hover:opacity-100 opacity-0 hover:bg-black/40 px-12 pb-6 lg:pb-10" }>
          <FullscreenEpisodeText {...{ currentEpisodeIndex, episodeName }} />
        </div>
      )}
    </div>
  );
};


const Fullscreen: FC = () => {
  const { t } = useTranslation();

  const [currentPodcast] = useRecoilState(currentPodcastAtom);
  const [currentEpisode] = useRecoilState(currentEpisodeAtom);

  const { cover, episodes } = currentPodcast;
  const { eid, episodeName, type } = currentEpisode;

  const currentEpisodeIndex = episodes.findIndex((episode) => episode.eid === eid);
  const isAudio = type.includes("audio");
  const isVideo = type.includes("video");

  return (
    <div className={FullscreenOuterStyling}>
      <BackgroundImage {...{ cover, episodeName }} />
      {isAudio && <FullscreenStaticImage {...{ cover, episodeName, currentEpisodeIndex }} />}
      {isVideo && <FullscreenVideo {...{ episodeName, currentEpisodeIndex }} />}
    </div>
  );
};

export default Fullscreen;
