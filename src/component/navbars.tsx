import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import { Disclosure } from "@headlessui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SIDENAV_BUTTON } from '../styles/constants';

import {
  HomeIcon,
  RectangleStackIcon,
  LanguageIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Cooyub } from "./reusables/icons";
import ArConnect from "./arconnect";
import { Searchbar } from "./searchbar";
import LANGUAGES from "../utils/languages";
import { UploadCount } from "./upload_count";
import { useRecoilState } from "recoil";
import { isFullscreen } from "../atoms";

export function Sidenav() {
  const { t } = useTranslation('common');
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeLanguage = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale })
  };

  const [showUploadOptions,setUploadOptions] = useState(false);
  const [isFullscreen_, setIsFullscreen_] = useRecoilState(isFullscreen);

  const isHome = router.pathname === "/";
  const isUploadPodcast = router.pathname === "/upload-podcast";
  const isFeed = router.pathname === "feed";

  interface INavButton {
    url:       string;
    condition: boolean;
    icon:      JSX.Element;
  }

  const NavButton: FC<INavButton> = ({url, condition, icon}) => {
    return (
      <>
        {condition ? (
          <button disabled className="text-white rounded-full">
            {icon}
          </button>
        ): (
          <Link href={url} className="w-9 h-9">
            <button
              className={SIDENAV_BUTTON}
              onClick={() => {
                setIsFullscreen_(false)
              }}
            >
              {icon}
            </button>
          </Link>
        )}
      </>
    )
  }

  const LanguageDropdown: FC = () => {
    return (
      <div className="dropdown dropdown-hover mb-[-6px]">
        <button
          tabIndex={0}
          className={SIDENAV_BUTTON + " w-9 hover:text-zinc-200"}
        >
          <LanguageIcon />
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-zinc-900 rounded-box w-36"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <span 
                onClick={() => {
                  setIsFullscreen_(false)
                  changeLanguage(l.code)
                }}
              >{l.name}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="h-full pt-[42px]">
      <div className="grid rows-5 gap-9 text-zinc-300">
        <button className={SIDENAV_BUTTON}>
          <Cooyub svgStyle="w-9 h-9" rectStyle="w-9 h-9" fill="#ffff00" />
        </button>

        <NavButton url="/" condition={isHome} icon={<HomeIcon />} />
        <div className="tooltip text-zinc-700" data-tip="Coming soon!">
          <RectangleStackIcon />
        </div>
        <LanguageDropdown />
        <NavButton url={'/upload-podcast'} condition={isUploadPodcast} icon={<PlusIcon />} />
        {/* <UploadCount /> */}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://t.me/permacast"
          className={SIDENAV_BUTTON}
        >
          <QuestionMarkCircleIcon />
        </a>
      </div>
    </div>
  );
}

export function NavBar() {
  const { t } = useTranslation();

  return (
    <>
      <div className="md:hidden">
        <NavBarMobile />
      </div>
      <div className="hidden md:block">
        <div className="flex">
          <div className="w-4/5">
            <Searchbar />
          </div>
          <div className="ml-8 w-72 flex flex-col bg-zinc-900 dropdown rounded-full">
            <label tabIndex={0} className="btn-default ">{t("navbar.wallets")}</label>
            <ul tabIndex={0} className="w-full dropdown-content menu p-2 rounded-box mt-12 bg-zinc-800 overflow-hidden">
              <li className="mt-2">
                <ConnectButton showBalance={true} />
              </li>
              <li className="mt-2">
                <ArConnect />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export function NavBarMobile() {
  const { t, i18n } = useTranslation();
  // const  = (i) => history.push("/" + i);
  // let history = useHistory();
  // let location = useLocation();

  const changeLanguage = (lng) => {
    // i18n.changeLanguage(lng);
  };

  return (
    <div className="text-white">
      <div className="flex gap-x-8 justify-center">
        <Disclosure as="nav" className="rounded-box w-full">
          {({ open }) => (
            <>
              <div className="navbar flex items-center">
                <div className="flex-1">
                  <div className="flex w-full items-center ">
                    <div
                      className="block h-5 w-5 mr-2 text-[rgb(255,255,0)]"
                    ></div>
                    <div className="w-full mx-2">
                      <Searchbar />
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
              <Disclosure.Panel>
                <div className="px-2 pt-2 pb-3 space-y-1 border border-zinc-800 rounded-lg">
                  <div className="dropdown dropdown-hover block px-3 py-2 rounded-md">
                    <label tabIndex={0}>
                      <LanguageIcon className="h-5 w-5" aria-hidden="true" />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-zinc-900 rounded-box w-32"
                    >
                      {LANGUAGES.map((l) => (
                        <li key={l.code}>
                          <span onClick={() => changeLanguage(l.code)}>
                            {l.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Disclosure.Button
                    as="div"
                    className="block px-3 py-2 rounded-md"
                  >
                    <div onClick={() => ""}>{t("navbar.home")}</div>
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="https://t.me/permacast"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block px-3 py-2 rounded-md"
                  >
                    {t("navbar.help")}
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    className="block px-3 py-2 rounded-md cursor-pointer"
                  >
                    <span onClick={() => console.log('')}>
                      {t("navbar.new")}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    className="block px-3 py-2 rounded-md cursor-pointer"
                  >
                    <div onClick={() => ("uploadpodcast")}>
                      {t("uploadshow.addpodcast")}
                    </div>
                  </Disclosure.Button>

                  <Disclosure.Button as="div" className="block py-2 rounded-md">
                    <ArConnect />
                  </Disclosure.Button>
                  <ConnectButton showBalance={true} />
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
