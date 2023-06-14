import Link from "next/link";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
import { useRecoilState } from "recoil";

import LANGUAGES from "@/utils/languages";
import { isFullscreenAtom } from "@/atoms/index";
import { PermaSpinner } from "@/component/reusables/PermaSpinner";
import { A_URL_ATTRS, HELP_LINKS, SPINNER_COLOR } from "@/constants/index";
import { Icon } from "@/component/icon";
import { Dropdown, ExtendedDropdownButtonProps } from "../reusables";

interface INavButton {
  url: string;
  condition: boolean;
  icon: JSX.Element;
};

interface UploadDropdownProps {
  routeMatches: boolean;
};

interface LinkWithProgressProps {
  loading?: boolean;
  onClick?: () => void;
  href: string;
  hrefText: string;
};

const buttonSelectedStyling = `disabled:text-white hover:text-zinc-200 text-zinc-400 rounded-full w-9 h-9`;
const spinnerClass = `w-full flexCenter `;
const dropdownBase = `dropdown-content menu p-2 shadow bg-zinc-900 rounded-box `;
const dropdownContentStyling = dropdownBase + `min-w-[144px] max-w-[200px] `;
const DropdownMenuStyling = dropdownBase + `w-36 `;
const DropdownParentStyling = `dropdown dropdown-hover mb-[-6px] `;

export const NavButton = ({ url, condition, icon }: INavButton) => {
  const [isFullscreen, setIsFullscreen] = useRecoilState(isFullscreenAtom);

  const buttonContent = (
    <button
      className={buttonSelectedStyling}
      disabled={condition}
      onClick={() => setIsFullscreen(false)}
    >
      {icon}
    </button>
  );

  return condition ? buttonContent : <Link href={url} className="w-9 h-9">{buttonContent}</Link>;
};

export const LanguageDropdown = () => {
  const router = useRouter();

  const [isFullscreen, setIsFullscreen] = useRecoilState(isFullscreenAtom);

  const changeLanguage = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale })
  };

  return (
    <div className={DropdownParentStyling}>
      <button
        tabIndex={0}
        className={" w-9 hover:text-zinc-200"}
      >
        <Icon className="" icon="LANGUAGE" strokeWidth="0" fill="currentColor" />
      </button>
      <ul 
        tabIndex={0}
        className={DropdownMenuStyling}
      >
        {LANGUAGES.map((l) => (
          <li key={l.code}>
            <span
              onClick={() => {
                setIsFullscreen(false)
                changeLanguage(l.code)
              }}
            >{l.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


// ! TODO FIX THIS
export const HelpDropdown = () => {
  
  // const items: ExtendedDropdownButtonProps[] = HELP_LINKS.map((item, index) => ({
  //   key: item.name,
  //   jsx: <a {...{A_URL_ATTRS}} key={index} href={item.url} className={`flexFullCenter gap-x-2`}>
  //     <>{item.icon}</>
  //     <p>{item.name}</p>
  //   </a>
  // }));
  const items  = [];


  const openMenuButton = <Icon className="" icon="QUESTION" />;
  const openMenuButtonClass = `flexFullCenter bg-zinc-900 h-12 w-12 rounded-3xl default-animation rounded-full w-full z-0 `;
  const dropdownMenuClass = `absolute z-50 left-0 mt-2 w-24 origin-top-left rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-[2px] border-zinc-400 default-animation `;
  const menuItemClass = `border-0 p-[10px] hover:bg-zinc-800 hover:text-white default-animation `;

  return <></>//<Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};


export const BasicLoaderSpinner = () => (
  <PermaSpinner
    spinnerColor={SPINNER_COLOR}
    size={10}
    divClass={spinnerClass}
  />
);

export const LinkWithProgress = ({ loading, onClick, href, hrefText }: LinkWithProgressProps) => (
  <div className="m-0 p-0">
    {<Link {...{ href, onClick }} className="w-full p-4">{hrefText}</Link>}
  </div>
);

export const UploadDropdown = ({ routeMatches }: UploadDropdownProps) => {

  const { t } = useTranslation();

  const className = routeMatches ? " w-9 hover:text-white " : `w-9 h-9` + " hover:text-zinc-100";

  return (
    <div className={DropdownParentStyling}>
      <button
        tabIndex={0}
        className={className}
      >
        <Icon icon="PLUS" className="" fill="currentColor" />
      </button>
      <ul
        tabIndex={0}
        className={dropdownContentStyling}
      >
        <li>
          <LinkWithProgress href="/upload-podcast" hrefText={t("home.add-podcast")} />
        </li>
        <li>
          <LinkWithProgress href="/upload-episode" hrefText={t("home.add-episode")} />
        </li>
        <li>
          <LinkWithProgress href="/rss" hrefText={t("rss.importrss")} />
        </li>
      </ul>
    </div>
  );
};
