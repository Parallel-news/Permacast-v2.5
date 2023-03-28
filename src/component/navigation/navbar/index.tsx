import { useTranslation } from "next-i18next";
import { Disclosure } from "@headlessui/react";

import {
  LanguageIcon, Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import ArConnect from "../../arconnect";
import { Searchbar } from "../../searchbar";
import LANGUAGES from "../../../utils/languages";
import { useRecoilState } from "recoil";
import { arweaveAddress } from "../../../atoms";
import { EverPayBalance } from "../../../utils/everpay/EverPayBalance";
import { FC } from "react";

export const NavBar: FC = () => {
  const { t } = useTranslation();
  const [arweaveAddress_, ] = useRecoilState(arweaveAddress);
  const everPayStyling = "flex justify-center items-center text-sm text-white focus:outline-white wallet-button font-semibold bg-zinc-900 hover:bg-zinc-700 default-animation rounded-full w-[12%] mx-2";
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
          <div className="ml-8 w-64">
            <ArConnect />
          </div>
          {/* TODO: Re-write */}
          {arweaveAddress_ && arweaveAddress_.length > 0 && (
          <EverPayBalance
            textClassname={everPayStyling}
          />
          )}
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
      <div className="flex gap-x-12 justify-center">
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
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};
