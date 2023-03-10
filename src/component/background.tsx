import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { backgroundColor, podcastColor, themeColor } from '../atoms/index';
import { dimColor } from "../utils/ui";

interface BackgroundInterface {
  children: ReactNode;
}

const Background: React.FC<BackgroundInterface> = ({ children }) => {

  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [themeColor_, _] = useRecoilState(themeColor);
  const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);
  const [podcastColor_, setPodcastColor_] = useRecoilState(podcastColor)

  const useDefaultBackground = [
    "/",
    "/search",
    "/upload-podcast",
  ]

  useEffect(() => {
    // console.log("background.tsx useEffect");
    if (useDefaultBackground.includes(pathname)) setBackgroundColor_(dimColor(themeColor_, 0.2));
    else setBackgroundColor_(dimColor(podcastColor_, 0.4))
  }, [pathname])

  // finish the animation for this transition later on
  const styles = {transition: 'opacity 2.5s ease', backgroundImage: `linear-gradient(${backgroundColor_}, black)`};

  return (
    <div className="w-screen overflow-scroll" style={true ? styles : {}}>
      {children}
    </div>
  )
}

export default Background;
