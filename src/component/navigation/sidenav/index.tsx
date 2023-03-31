import { FC } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
import { SIDENAV_BUTTON } from '../../../styles/constants';

import {
  HomeIcon,
  RectangleStackIcon
} from "@heroicons/react/24/outline";
import { Cooyub } from "../../reusables/icons";
import { HelpDropdown, LanguageDropdown, NavButton, UploadDropdown } from "../sidenavButtons";
import { ComingSoonTooltip } from "../../reusables/tooltip";

export const IconSizeStyling = `w-9 h-9 `;
export const SideNavStyling = `hidden md:flex flex-col items-center gap-y-9 h-full pt-10 w-[100px] text-zinc-400 z-50 `;

export const Sidenav: FC = () => {

  const { t } = useTranslation();
  const router = useRouter();

  const isHome = router.pathname === "/";
  const isUploadPodcast = router.pathname === "/upload-podcast";
  const isUploadEpisode = router.pathname === "/upload-episode";
  const isUpload = isUploadPodcast || isUploadEpisode;
  // const isFeed = router.pathname === "feed";

  return (
    <div className={SideNavStyling + "bg-black"}>
      <button className={SIDENAV_BUTTON}>
        <Cooyub svgStyle={IconSizeStyling} rectStyle={IconSizeStyling} fill="#ffff00" />
      </button>
      <NavButton url="/" condition={isHome} icon={<HomeIcon />} />
      <ComingSoonTooltip placement="right">
        <RectangleStackIcon className={IconSizeStyling + "text-zinc-600 cursor-not-allowed"} />
      </ComingSoonTooltip>
      <LanguageDropdown />
      <UploadDropdown routeMatches={isUpload} />
      <HelpDropdown />
    </div>
  );
};
