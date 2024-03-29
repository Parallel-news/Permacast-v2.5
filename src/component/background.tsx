import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { useRecoilState } from "recoil";

import { backgroundColorAtom, currentThemeColorAtom, podcastColorAtom, userBannerImageAtom } from '../atoms/index';
import { dimColorString } from "../utils/ui";
import { ARSEED_URL } from "../constants";
import { DEFAULT_BACKGROUND_COLOR } from "../constants/ui";

interface BackgroundInterface {
  children?: ReactNode;
}

export const useDefaultBackgroundPaths = [
  "/",
  "/rss",
  "/feed",
  "/search",
  "/upload-podcast",
  "/upload-episode",
];

const Background: React.FC<BackgroundInterface> = ({ children }) => {

  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [currentThemeColor, _] = useRecoilState(currentThemeColorAtom);
  const [backgroundColor, setbackgroundColor] = useRecoilState(backgroundColorAtom);
  const [podcastColor, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [userBannerImage, setUserBannerImage] = useRecoilState(userBannerImageAtom);


  useEffect(() => {
    if (!pathname.includes("/creator")) setUserBannerImage('');
    if (useDefaultBackgroundPaths.includes(pathname)) setbackgroundColor(dimColorString(currentThemeColor, 0.4));
    else if (pathname.includes("/edit-podcast") || pathname.includes("/edit-episode")) setbackgroundColor(dimColorString(podcastColor, 0.6));
    else if (pathname.includes("/creator")) {
      if (userBannerImage.length > 0) {
        setbackgroundColor(dimColorString(currentThemeColor, 0))
      } else setbackgroundColor(dimColorString(podcastColor, 0.6));
    } else setbackgroundColor(dimColorString(podcastColor, 0.5));
  }, [pathname, podcastColor, userBannerImage]);


  const styles = { backgroundImage: `linear-gradient(transparent, ${DEFAULT_BACKGROUND_COLOR}, ${DEFAULT_BACKGROUND_COLOR})` };

  return (
    <div className="w-screen h-3/4 absolute overflow-hidden default-animation-slow pointer-events-none" style={{ backgroundColor: backgroundColor, zIndex: -1 }}>
      {userBannerImage && (
        <div className="absolute">
          <Image
            src={ARSEED_URL + userBannerImage}
            width={1350}
            height={450}
            priority={true}
            alt="Profile banner"
            className="opacity-40 w-screen md:w-[93.5vw] h-[180px] md:h-[30vw]"
          />
          <div className="absolute w-full h-full z-[1] top-0" style={{ backgroundImage: `linear-gradient(transparent, transparent, transparent, transparent, transparent, ${DEFAULT_BACKGROUND_COLOR})` }}></div>
        </div>
      )}
      <div className="w-full h-full z-[1]" style={styles}></div>
    </div>
  );
};

export default Background;
