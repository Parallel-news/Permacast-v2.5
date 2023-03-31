import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { backgroundColorAtom, currentThemeColorAtom, podcastColorAtom } from '../atoms/index';
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

  const useDefaultBackground = [
    "/",
    "/search",
    "/upload-podcast",
  ];

  useEffect(() => {
    // console.log("background.tsx useEffect");
    if (useDefaultBackground.includes(pathname)) setbackgroundColor(dimColorString(currentThemeColor, 0.4));
    else setbackgroundColor(dimColorString(podcastColor, 0.5));
  }, [pathname, podcastColor]);


  const styles = {backgroundImage: `linear-gradient(transparent, black, black)`};

  return (
    <div className="w-screen h-3/4 absolute overflow-hidden default-animation-slow " style={{backgroundColor: backgroundColor, zIndex: -1}}>
      <div className="absolute w-full h-full z-[2]" style={styles}></div>
    </div>
  )
}

export default Background;
