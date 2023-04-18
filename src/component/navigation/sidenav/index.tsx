import Link from "next/link";
import { useRouter } from 'next/router';
import { FC } from "react";
import { useRecoilState } from "recoil";
import { SIDENAV_BUTTON } from '../../../styles/constants';

import { HomeIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { HelpDropdown, LanguageDropdown, NavButton, UploadDropdown } from "../sidenavButtons";
import { ComingSoonTooltip } from "../../reusables/tooltip";
import { Cooyub } from "../../reusables/icons";
import { currentThemeColorAtom } from "../../../atoms";


export const IconSizeStyling = `w-9 h-9 `;
export const SideNavStyling = `hidden md:flex items-center flex-col gap-y-9 h-full pt-10 w-[100px] text-zinc-400 z-50 `;

export const Sidenav: FC = () => {

  const [currentThemeColor, setCurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  const router = useRouter();

  const isHome = router.pathname === "/";
  const isViewPodcasts = router.pathname === "/feed"
  const isUploadPodcast = router.pathname === "/upload-podcast";
  const isUploadEpisode = router.pathname === "/upload-episode";
  const isUpload = isUploadPodcast || isUploadEpisode;
  // const isFeed = router.pathname === "feed";

  return (
    <div className={SideNavStyling + "bg-black"}>
      <Link href="/" className={SIDENAV_BUTTON}>
        <Cooyub svgStyle={IconSizeStyling} rectStyle={IconSizeStyling} fill={currentThemeColor} />
      </Link>
      <NavButton url="/" condition={isHome} icon={<HomeIcon />} />
      <NavButton url="/feed" condition={isViewPodcasts} icon={<RectangleStackIcon className={IconSizeStyling} />} />
      {/* TODO: re-use the dropdown from mobile view */}
      <LanguageDropdown />
      <UploadDropdown routeMatches={isUpload} />
      <HelpDropdown />
    </div>
  );
};
