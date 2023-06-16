import Link from "next/link";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

import useNavOnclick from "@/hooks/useNavOnclick";

import { A_URL_ATTRS, HELP_LINKS } from "@/constants/index";

import LANGUAGES, { LanguageOptionInterface } from "@/utils/languages";

import { Icon } from "@/component/icon";
import { Dropdown, ExtendedDropdownButtonProps } from "@/component/reusables";


interface NavWrapperProps {
  href: string;
  disabled: boolean;
  icon: ReactNode;
};

type NavLinkProps = Omit<NavWrapperProps, 'disabled'>;

interface UploadDropdownProps {
  routeMatches: boolean;
};

const innerItemStyling = `w-full flexXCenter px-1.5 py-4 `;
const dropdownMenuClass = `absolute z-50 left-0 w-40 origin-top-left rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-[2px] border-zinc-400 default-animation `;
const openMenuButtonClass = `z-0 sidenav-button `;

export const DisabledButton = ({ icon }: { icon: ReactNode }) => (
  <button className={`sidenav-button`} disabled={true}>
    {icon}
  </button>
);

export const NavLink = ({ href, icon }: NavLinkProps) => (
  <Link {...{ href }} className="sidenav-button">{icon}</Link>
);

export const NavButton = ({ href, disabled, icon }: NavWrapperProps) => {
  const { onC: onClick } = useNavOnclick();

  return disabled ? <DisabledButton {...{ icon }} /> : <NavLink {...{ href, icon, onClick }} />;
};

export const LanguageDropdown = () => {
  const router = useRouter();

  const { onC: onClick } = useNavOnclick();

  const changeLanguage = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale })
  };

  const handleLanguageChange = (language: string) => {
    onClick(false);
    changeLanguage(language);
  };

  const openMenuButton = <Icon className={`w-9 h-9 `} icon="LANGUAGE" />;

  const items: ExtendedDropdownButtonProps[] = LANGUAGES.map((l: LanguageOptionInterface) => ({
    key: l.name,
    jsx: <button className={innerItemStyling} onClick={() => handleLanguageChange(l.code)}>{l.name}</button>
  }));

  return (
    <div id="language-dropdown">
      <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass }} />
    </div>
  );
};

export const HelpDropdown = () => {

  const openMenuButton = <Icon className="w-9 h-9" icon="QUESTION" />;
  const innerItemClass = `w-full flexXCenter px-2 py-4 `;

  const items: ExtendedDropdownButtonProps[] = HELP_LINKS.map((item) => ({
    key: item.name,
    jsx: <a {...{ A_URL_ATTRS }} href={item.href} className={`flexFullCenterGapX ` + innerItemClass}>
      <>{item.icon}</>
      <p>{item.name}</p>
    </a>
  }));

  return (
    <div id="help-dropdown">
      <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass }} />
    </div>
  );
};

export const UploadDropdown = ({ routeMatches }: UploadDropdownProps) => {

  const { t } = useTranslation();

  const openMenuButton = <Icon className="w-9 h-9" icon="PLUS" />;


  // todo: add routeMatches to work with different routes
  const className = innerItemStyling;//${routeMatches && 'bg-zinc-800 text-white'} ` ;

  const items: ExtendedDropdownButtonProps[] = [
    { key: "add-podcast", jsx: <Link {...{ className }} href="/upload-podcast">{t("home.add-podcast")}</Link> },
    { key: "add-episode", jsx: <Link {...{ className }} href="/upload-episode">{t("home.add-episode")}</Link> },
    { key: "import-rss", jsx: <Link {...{ className }} href="/rss">{t("rss.importrss")}</Link> },
  ];

  return (
    <div id="upload-dropdown">
      <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass }} />
    </div>
  );
};
