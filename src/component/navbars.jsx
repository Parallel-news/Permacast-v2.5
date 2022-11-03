import React, { useState, useEffect, useContext  } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Disclosure } from '@headlessui/react'
import { HomeIcon, RectangleStackIcon, LanguageIcon, PlusIcon, QuestionMarkCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import YellowRec from '../yellow-rec.svg'
import { Cooyub } from './reusables/icons';
import ArConnect from './arconnect';
import { Searchbar } from '../pages/search';
import { appContext } from '../utils/initStateGen';
import LANGUAGES from '../utils/languages';
import { UploadCount } from './upload_count';

export function Sidenav() {
  const { t, i18n } = useTranslation();
  let history = useHistory();
  let location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const appState = useContext(appContext);
  const switchView = i => {
    history.push("/"+i);
  };
  const cond = i => location.pathname === i;

  return (
    <div className="h-full pt-[42px]">
      <div className=" grid rows-5 gap-9 text-zinc-400">
        <button className="w-9 h-9 mb-10 btn btn-ghost btn-sm btn-square hover:text-zinc-200">
          <Cooyub svgStyle="w-9 h-9" rectStyle="w-9 h-9" fill="#ffff00" />
        </button>
        <button className="w-9 h-9 btn btn-ghost btn-sm btn-square hover:text-zinc-200" onClick={() => switchView("")} style={{color: cond("/") ? 'white': ''}} disabled={cond("/") ? true: false}>
          <HomeIcon />
        </button>
        <div className="tooltip" data-tip="Coming soon!">
          <button className="w-9 h-9 btn btn-ghost btn-sm btn-square hover:text-zinc-200" onClick={() => switchView("following")} style={{color: cond("/following") ? 'white': ''}} disabled={cond("/following") ? true: true}>
            <RectangleStackIcon />
          </button>
        </div>
        <div className="dropdown dropdown-hover mb-[-6px]">
          <button tabIndex="0" className="w-9 h-9 btn btn-ghost btn-sm btn-square hover:text-zinc-200">
            <LanguageIcon />
          </button>
          <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-zinc-900 rounded-box w-32">
            {LANGUAGES.map(l => (
              <li key={l.code}>
                <span onClick={() => changeLanguage(l.code)}>{l.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="w-9 h-9 btn btn-ghost btn-sm btn-square hover:text-zinc-200 relative" onClick={() => {switchView("uploadpodcast")}} style={{color: cond("/uploadpodcast") ? 'white': ''}} disabled={cond("/uploadpodcast") ? true: false}>
          <PlusIcon />
          <UploadCount />
        </button>
        <a target="_blank" rel="noreferrer" href="https://t.me/permacast" className="w-9 h-9 btn btn-ghost btn-sm btn-square hover:text-zinc-200">
          <QuestionMarkCircleIcon />
        </a>
      </div>
    </div>
  )
}

export function NavBar() {
  const appState = useContext(appContext);

  return (
    <>
      <div className="md:hidden">
        <NavBarMobile />
      </div>
      <div className="hidden md:block">
        <div className="flex">
          <div className="w-4/5">
            {!appState.loading ? 
              <Searchbar />
              :
            <div className="w-full bg-zinc-800 h-12 rounded-full animate-pulse"></div>
          }
          </div>
          <div className="ml-8 w-72">
            <ArConnect />
          </div>
        </div>
      </div>
    </>
  )
}

export function NavBarMobile() {
  const appState = useContext(appContext);
  const { t, i18n } = useTranslation();
  const switchView = i => history.push("/"+i);
  let history = useHistory();
  let location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const loadWhatsNew = () => Swal.fire({
    title: t("navbar.swal.title"),
    html: t("navbar.swal.html"),
    customClass: {
      title: "font-mono",
      htmlContainer: 'list text-left text-md font-mono'
    }
  })

  return (
    <div className="text-white">
      <div className="flex gap-x-8 justify-center">
        <Disclosure as="nav" className="rounded-box w-full">
        {({ open }) =>
          <>
            <div className="navbar flex items-center">
              <div className="flex-1" href="/">
                <div className="flex w-full items-center ">
                  <img className="block h-5 w-auto mr-2" src={YellowRec} alt="permacast" />
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
                  <label tabIndex="0">
                    <LanguageIcon className="h-5 w-5" aria-hidden="true" />
                  </label>
                  <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-zinc-900 rounded-box w-32">
                    {LANGUAGES.map(l => (
                      <li key={l.code}>
                        <span onClick={() => changeLanguage(l.code)}>{l.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Disclosure.Button
                  as="div"
                  className="block px-3 py-2 rounded-md"
                >
                  <div onClick={() => switchView("")}>
                    {t("navbar.home")}
                  </div>
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="https://t.me/permacast"
                  target="_blank" rel="noreferrer noopener"
                  className="block px-3 py-2 rounded-md"
                >
                  {t("navbar.help")}
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  className="block px-3 py-2 rounded-md cursor-pointer"
                >
                  <span onClick={() => loadWhatsNew()}>
                    {t("navbar.new")}
                  </span>
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  className="block px-3 py-2 rounded-md cursor-pointer"
                >
                  <div onClick={() => switchView("uploadpodcast")}>
                    {t("uploadshow.addpodcast")}
                  </div>
                </Disclosure.Button>
                
                <Disclosure.Button
                  as="a"
                  className="block py-2 rounded-md"
                >
                  <ArConnect />
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>}
        </Disclosure>
      </div>

    </div>
  )
}
