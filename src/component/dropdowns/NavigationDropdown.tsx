import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC } from "react";

import Dropdown, {
  ExtendedDropdownButtonProps,
  openMenuButtonClass,
} from "../reusables/dropdown";
import ArConnect from "../wallets/arconnect";
import LanguageDropdown from "./LanguageDropdown";
import { loadingPage } from "../../atoms";
import { useRecoilState } from "recoil";
import router from "next/router";
import { Icon } from "../icon";

const NavigationDropdown: FC = () => {
  const { t } = useTranslation();
  const [, _setLoadingPage] = useRecoilState(loadingPage)

  const engageLoad = () => _setLoadingPage(true)
  
  const isHome = router.pathname === "/";
  const isFeed = router.pathname === "/feed"
  const isUploadPodcast = router.pathname === "/upload-podcast";
  const isUploadEpisode = router.pathname === "/upload-episode";

  const items: ExtendedDropdownButtonProps[] = [
    { jsx: <ArConnect />, key: "arconnect", customClass: `px-0 h-10 py-0 bg-zinc-900 hover:bg-zinc-900 mb-0 mx-0` },
    { jsx: <Link href="/" onClick={isHome ? ()=>"" : engageLoad}>{t(`navbar.home`)}</Link>, key: `home` },
    { jsx: <Link href="/feed" onClick={isFeed ? ()=>"" : engageLoad}>{t(`feed-page.allpodcasts`)}</Link>, key: `feed` },
    { jsx: <Link href="/upload-podcast" onClick={isUploadPodcast ? ()=>"" : engageLoad}>{t(`uploadshow.addpodcast`)}</Link>, key: `upload-podcast` },
    { jsx: <Link href="/upload-episode" onClick={isUploadEpisode ? ()=>"" :engageLoad}>{t(`podcast.newepisode`)}</Link>, key: `upload-episode` },
    { jsx: <LanguageDropdown />, key: `language-dropdown`, customClass: `px-0 bg-zinc-900 hover:bg-zinc-900 h-8 ` }
  ];

  const openMenuButton = <Icon className="h-5 w-5" icon="BAR3BOTTOM" />;
  const menuItemClass = "border-0 p-[10px] hover:bg-zinc-800 hover:text-white"
  const dropdownMenuClass = `absolute z-50 right-0 mt-2 w-56 origin-top-right rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-[2px] border-zinc-400 px-2`

  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default NavigationDropdown;