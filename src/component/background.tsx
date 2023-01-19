import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { backgroundColor, themeColor } from '../atoms/index';

interface BackgroundInterface {
  children: ReactNode;
}

const Background: React.FC<BackgroundInterface> = ({ children }) => {

  const router = useRouter()
  const { pathname, asPath, query } = router;
  const [themeColor_, _] = useRecoilState(themeColor);
  const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);

  // TODO re-write this later on
  const color = (pathname.includes("podcast") && pathname.toLowerCase() !== '/uploadpodcast')
  const check = () => pathname === "/";

  const useDefaultBackground = [
    "/uploadpodcast",
    "/search",
  ]

  useEffect(() => {
    // console.log("background.tsx useEffect");
    if (useDefaultBackground.includes(pathname)) setBackgroundColor_('');
    console.log(pathname)
  }, [pathname])

  // finish the animation for this transition later on
  const transition = {transition: 'opacity 2.5s ease', backgroundImage: `linear-gradient(${color}, black)`};

  return (
    <div className="w-screen overflow-scroll" style={true ? transition : {}}>
      {children}
    </div>
  )
}

export default Background