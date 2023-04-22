import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { Bars3Icon, LanguageIcon } from "@heroicons/react/24/solid";

import Searchbar from "../../searchbar";
import LANGUAGES, { LanguageOptionInterface } from "../../../utils/languages";
import { LanguageButton } from "../../reusables/LanguageButton";
import Dropdown, { 
  ExtendedDropdownButtonProps,
  openMenuButtonClass,
  dropdownMenuClass,
  menuItemClass
} from "../../reusables/dropdown";
import ArConnect from "../../wallets/arconnect";
import WalletSelectorButton from "../../wallets";


export const dropdownItemFullFill = `w-full h-full flex `;

export const LanguageDropdown: FC = () => {
  const items = LANGUAGES.map((l: LanguageOptionInterface) => ({
    key: l.name, jsx: <LanguageButton {...{ className: dropdownItemFullFill, l }} />,
  }));

  const openMenuButton = <LanguageIcon className="h-5 w-5" aria-hidden="true" />;
  const openMenuButtonClass = `rounded-lg min-w-min bg-zinc-900 justify-start ` + dropdownItemFullFill;
  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export const NavigationDropdown: FC = () => {
  const { t } = useTranslation();

  const items: ExtendedDropdownButtonProps[] = [
    {jsx: <Link href="/">{t(`navbar.home`)}</Link>, key: "home"},
    {jsx: <Link href="/upload-podcast">{t(`uploadshow.addpodcast`)}</Link>, key: "upload-podcast"},
    {jsx: <Link href="/upload-episode">{t(`podcast.newepisode`)}</Link>, key: "upload-episode"},
    {jsx: <ArConnect />, key: "arconnect", customClass: `px-0 h-8 overflow-y-hidden bg-zinc-900 hover:bg-zinc-900 `},
    {jsx: <LanguageDropdown />, key: "language-dropdown", customClass: `px-0 bg-zinc-900 hover:bg-zinc-900 `}
  ];

  const openMenuButton = <Bars3Icon className="h-5 w-5" aria-hidden="true" />;

  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export const NavBar: FC = () => {
  return (
    <div className="mb-10 ">
      <div className="md:hidden">
        <NavBarMobile />
      </div>
      <div className="hidden md:block">
        <div className="flex">
          <div className="w-4/5">
            <Searchbar />
          </div>
          <div className="ml-2 w-80">
            <WalletSelectorButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export const NavBarMobile: FC = () => {
  return (
    <div className="flex items-center gap-x-2 mt-5">
      <Searchbar />
      <NavigationDropdown />
    </div>
  );
};
