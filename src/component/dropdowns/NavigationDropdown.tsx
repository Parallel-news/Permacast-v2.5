import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { Bars3Icon, LanguageIcon } from "@heroicons/react/24/solid";

import Dropdown, {
  ExtendedDropdownButtonProps,
  openMenuButtonClass,
  dropdownMenuClass,
  menuItemClass
} from "../reusables/dropdown";
import ArConnect from "../wallets/arconnect";
import LanguageDropdown from "./LanguageDropdown";

const NavigationDropdown: FC = () => {
  const { t } = useTranslation();

  const items: ExtendedDropdownButtonProps[] = [
    { jsx: <Link href="/">{t(`navbar.home`)}</Link>, key: `home` },
    { jsx: <Link href="/upload-podcast">{t(`uploadshow.addpodcast`)}</Link>, key: `upload-podcast` },
    { jsx: <Link href="/upload-episode">{t(`podcast.newepisode`)}</Link>, key: `upload-episode` },
    { jsx: <ArConnect />, key: "arconnect", customClass: `px-0 h-8 overflow-y-hidden bg-zinc-900 hover:bg-zinc-900 ` },
    { jsx: <LanguageDropdown />, key: `language-dropdown`, customClass: `px-0 bg-zinc-900 hover:bg-zinc-900 ` }
  ];

  const openMenuButton = <Bars3Icon className="h-5 w-5" aria-hidden="true" />;

  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default NavigationDropdown;