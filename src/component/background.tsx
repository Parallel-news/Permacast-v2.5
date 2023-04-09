import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { useRecoilState } from "recoil";
import { backgroundColorAtom, currentThemeColorAtom, podcastColorAtom, userBannerImageAtom } from '../atoms/index';
import { dimColorString } from "../utils/ui";
import { DEFAULT_BACKGROUND_COLOR } from "../constants/ui";
import { ARSEED_URL } from "../constants";

interface BackgroundInterface {
  children?: ReactNode;
}

const Background: React.FC<BackgroundInterface> = ({ children }) => {

  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [currentThemeColor, _] = useRecoilState(currentThemeColorAtom);
  const [backgroundColor, setbackgroundColor] = useRecoilState(backgroundColorAtom);
  const [podcastColor, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [userBannerImage, setUserBannerImage] = useRecoilState(userBannerImageAtom);

  const useDefaultBackground = [
    "/",
    "/search",
    "/upload-podcast",
    "/upload-episode"
  ];

  useEffect(() => {
    console.log("background.tsx useEffect");
    if (!pathname.includes("/creator")) setUserBannerImage('');
    if (useDefaultBackground.includes(pathname)) setbackgroundColor(dimColorString(currentThemeColor, 0.4));
    else if (pathname.includes("/creator")) {
      if (userBannerImage.length > 0) {
        console.log('userBannerImage ', userBannerImage)
        setbackgroundColor(dimColorString(currentThemeColor, 0))
        return
      };
      setbackgroundColor(dimColorString(currentThemeColor, 0.6))
    } else setbackgroundColor(dimColorString(podcastColor, 0.5));
  }, [pathname, podcastColor]);


  const styles = {backgroundImage: `linear-gradient(transparent, black, black)`};

  return (
    <div className="w-screen h-3/4 absolute overflow-hidden default-animation-slow pointer-events-none" style={{backgroundColor: backgroundColor, zIndex: -1}}>
      {userBannerImage && (
        <div className="absolute">
          <Image src={ARSEED_URL + userBannerImage} width={1350} height={450} alt="Profile banner" className="opacity-40 w-screen md:w-[93.5vw] h-[180px] md:h-[30vw]" />
          <div className="absolute w-full h-full z-[1] top-0" style={{backgroundImage: `linear-gradient(transparent, transparent, black)`}}></div>
        </div>
      )}
      <div className="w-full h-full z-[1]" style={styles}></div>
    </div>
  );
};

export default Background;
