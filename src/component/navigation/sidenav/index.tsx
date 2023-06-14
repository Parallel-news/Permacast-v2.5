import Link from "next/link";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";

import { currentThemeColorAtom, loadingPage } from "@/atoms/index";
import { Cooyub } from "@/component/reusables/icons";
import { Icon } from "@/component/icon";
import { HelpDropdown, LanguageDropdown, NavButton, UploadDropdown } from "../sidenavButtons";



const cubeSize = `w-9 h-9`;
const IconSizeStyling = `w-12 h-12 `;
const SideNavStyling = `hidden md:flex flex-col items-center gap-y-9 h-full pt-10 w-[100px] text-zinc-400 z-50 `;

export const Sidenav = () => {

  const router = useRouter();

  const [currentThemeColor,] = useRecoilState(currentThemeColorAtom);
  const [, _setLoadingPage] = useRecoilState(loadingPage);


  const isHome = router.pathname === "/";
  const isFeed = router.pathname === "/feed"
  const isUploadPodcast = router.pathname === "/upload-podcast";
  const isUploadEpisode = router.pathname === "/upload-episode";
  const isRSSImport = router.pathname === "/rss";
  const isUpload = isUploadPodcast || isUploadEpisode || isRSSImport;
  
  const engageLoading = () => _setLoadingPage(true);
  

  const d = `border-0 hover:text-zinc-100 text-zinc-400/90`;

  return (
    <div className={SideNavStyling}>
      <Link href="/" className={d} onClick={engageLoading}>
        <Cooyub svgStyle={cubeSize} rectStyle={cubeSize} fill={currentThemeColor} />
      </Link>
      <NavButton
        url="/"
        condition={isHome}
        icon={<Icon icon="HOME" className="w-9 h-9" onClick={engageLoading} />}
      />
      <NavButton
        url="/feed"
        condition={isFeed}
        icon={
          <Icon icon="RECTANGLESTACK"
            className={IconSizeStyling}
            onClick={engageLoading}
          />
        }
      />
      {/* TODO: re-use the dropdown from mobile view */}
      <LanguageDropdown />
      <UploadDropdown routeMatches={isUpload} />
      <HelpDropdown />
    </div>
  );
};
