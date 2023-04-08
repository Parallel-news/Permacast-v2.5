import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { useRecoilState } from "recoil";
import { backgroundColorAtom, currentThemeColorAtom, podcastColorAtom, userBannerImageAtom } from '../atoms/index';
import { dimColorString } from "../utils/ui";
import { DEFAULT_BACKGROUND_COLOR } from "../constants/ui";

interface BackgroundInterface {
  children?: ReactNode;
}

const Background: React.FC<BackgroundInterface> = ({ children }) => {

  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [currentThemeColor, _] = useRecoilState(currentThemeColorAtom);
  const [backgroundColor, setbackgroundColor] = useRecoilState(backgroundColorAtom);
  const [podcastColor, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [userImage, setUserImage] = useRecoilState(userBannerImageAtom);

  const useDefaultBackground = [
    "/",
    "/search",
    "/upload-podcast",
    "/upload-episode"
  ];

  useEffect(() => {
    console.log("background.tsx useEffect");
    if (useDefaultBackground.includes(pathname)) setbackgroundColor(dimColorString(currentThemeColor, 0.4));
    else if (pathname.includes("/creator")) setbackgroundColor(dimColorString(currentThemeColor, 0));
    else setbackgroundColor(dimColorString(podcastColor, 0.5));
  }, [pathname, podcastColor]);


  const styles = {backgroundImage: `linear-gradient(transparent, black, black)`};

  return (
    <div className="w-screen h-3/4 absolute overflow-hidden default-animation-slow pointer-events-none" style={{backgroundColor: backgroundColor, zIndex: -1}}>
      {userImage && (
        <div className="absolute">
          <Image src="/user.avif" width={1350} height={450} alt="Profile banner" className="opacity-25 w-screen h-[450px] " />
          <div className="absolute w-full h-full z-[1] top-0" style={{backgroundImage: `linear-gradient(transparent, transparent, black)`}}></div>
        </div>
      )}
      <div className="w-full h-full z-[1]" style={styles}></div>
    </div>
  );
};

export default Background;
