import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";

import Dropdown, {
  ExtendedDropdownButtonProps,
  openMenuButtonClass,
  dropdownMenuClass,
  menuItemClass
} from "../reusables/dropdown";
import ArConnect from "../wallets/arconnect";
import LanguageDropdown from "./LanguageDropdown";
import { loadingPage } from "../../atoms";
import { useRecoilState } from "recoil";
import router from "next/router";

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

  const openMenuButton = <Bars3Icon className="h-5 w-5" aria-hidden="true" />;

  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default NavigationDropdown;