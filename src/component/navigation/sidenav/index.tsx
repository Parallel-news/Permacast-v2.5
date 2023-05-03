import Link from "next/link";
import { useRouter } from 'next/router';
import { FC } from "react";
import { useRecoilState } from "recoil";
import { SIDENAV_BUTTON } from '../../../styles/constants';

import { HomeIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { HelpDropdown, LanguageDropdown, NavButton, UploadDropdown } from "../sidenavButtons";
import { Cooyub } from "../../reusables/icons";
import { currentThemeColorAtom, loadingPage } from "../../../atoms";


export const IconSizeStyling = `w-9 h-9 `;
export const SideNavStyling = `hidden md:flex items-center flex-col gap-y-9 h-full pt-10 w-[100px] text-zinc-400 z-50 `;

export const Sidenav: FC = () => {

  const [currentThemeColor, ] = useRecoilState(currentThemeColorAtom);
  const [,_setLoadingPage] = useRecoilState(loadingPage)

  const router = useRouter();

  const isHome = router.pathname === "/";
  const isViewPodcasts = router.pathname === "/feed"
  const isUploadPodcast = router.pathname === "/upload-podcast";
  const isUploadEpisode = router.pathname === "/upload-episode";
  const isUpload = isUploadPodcast || isUploadEpisode;
  const engageLoading = () => _setLoadingPage(true)
  // const isFeed = router.pathname === "feed";

  return (
    <div className={SideNavStyling}>
      <Link href="/" className={SIDENAV_BUTTON} onClick={isHome ? ()=>"" : engageLoading}>
        <Cooyub svgStyle={IconSizeStyling} rectStyle={IconSizeStyling} fill={currentThemeColor} />
      </Link>
      <NavButton url="/" condition={isHome} icon={<HomeIcon onClick={isHome ? ()=>"" : engageLoading} />}  />
      <NavButton url="/feed" condition={isViewPodcasts} icon={<RectangleStackIcon className={IconSizeStyling} onClick={engageLoading} />} />
      {/* TODO: re-use the dropdown from mobile view */}
      <LanguageDropdown />
      <UploadDropdown routeMatches={isUpload} />
      <HelpDropdown />
    </div>
  );
};
