import { FC, useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
import { SIDENAV_BUTTON, SIDENAV_BUTTON_BASE } from '../../styles/constants';
import LANGUAGES from "../../utils/languages";
import { useRecoilState } from "recoil";
import { isFullscreenAtom, loadingPage } from "../../atoms";
import { PermaSpinner } from "../reusables/PermaSpinner";
import { HELP_LINKS, SPINNER_COLOR } from "../../constants";
import { Icon } from "../icon";

interface INavButton {
  url:       string;
  condition: boolean;
  icon:      JSX.Element;
};

interface UploadDropdownProps {
  routeMatches: boolean;
};

interface LinkWithProgressProps {
  loading: boolean;
  onClick: () => void;
  href: string;
  hrefText: string;
};


export const ButtonSelectedStyling = `text-white rounded-full w-9 h-9`;
export const spinnerClass = `w-full flex justify-center `;
export const dropdownContentStyling = `dropdown-content menu p-2 shadow bg-zinc-900 rounded-box min-w-[144px] max-w-[200px] `;
export const DropdownMenuStyling = `dropdown-content menu p-2 shadow bg-zinc-900 rounded-box w-36 `;
export const DropdownParentStyling = `dropdown dropdown-hover mb-[-6px] `;

export const NavButton: FC<INavButton> = ({url, condition, icon}) => {
  const [isFullscreen, setIsFullscreen] = useRecoilState(isFullscreenAtom);

  return (
    <>
      {condition ? (
        <button disabled className={ButtonSelectedStyling}>
          {icon}
        </button>
      ): (
        <Link href={url} className="w-9 h-9">
          <button
            className={SIDENAV_BUTTON}
            onClick={() => setIsFullscreen(false)}
          >
            {icon}
          </button>
        </Link>
      )}
    </>
  );
};

export const LanguageDropdown: FC = () => {
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
        className={SIDENAV_BUTTON + " w-9 hover:text-zinc-200"}
      >
        <Icon className="" icon="LANGUAGE" strokeWidth="0" fill="currentColor"/>
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

export const ForeignURL: FC<{ url: string, children: ReactNode }> = ({ url, children }) => (
  <a
    target="_blank"
    rel="noreferrer"
    href={url}
    className={`flex items-center ` + " gap-x-2"}
  >
    {children}
  </a>
);


export const HelpDropdown: FC = () => {
  return (
    <div className={DropdownParentStyling}>
      <button tabIndex={0} className={SIDENAV_BUTTON}>
        <Icon className="" icon="QUESTION" strokeWidth="1.5" />
      </button>
      <ul
        tabIndex={0}
        className={dropdownContentStyling}
      >
        {HELP_LINKS.map((item, index) => (
          <li key={index}>
            <ForeignURL url={item.url}>
              <div className={`flex items-center ` + "gap-x-2"}>
                {item.icon}
                <p>{item.name}</p>
              </div>
            </ForeignURL>
          </li>
        ))}
      </ul>
    </div>
  );
};


export const BasicLoaderSpinner: FC = () => (
  <PermaSpinner
    spinnerColor={SPINNER_COLOR}
    size={10}
    divClass={spinnerClass}
  />
);
//{loading && <BasicLoaderSpinner className="w-full p-4" />}
export const LinkWithProgress: FC<LinkWithProgressProps> = ({ loading, onClick, href, hrefText }) => (
  <div className="m-0 p-0">
    
    {<Link {...{ href, onClick }} className="w-full p-4">{hrefText}</Link>}
  </div>
);

export const UploadDropdown: FC<UploadDropdownProps> = ({ routeMatches }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [podcastClickLoad, setPodcastClickLoad] = useState<boolean>(false)
  const [episodeClickLoad, setEpisodeClickLoad] = useState<boolean>(false)
  const [rssClickLoad, setRssClickLoad] = useState<boolean>(false)
  const [,_setLoadingPage] = useRecoilState(loadingPage)
  const isUploadPodcast = router.pathname === "/upload-podcast"
  const isUploadEpisode = router.pathname === "/upload-episode"
  const isRss = router.pathname === "/rss"

  const clickSwitch = (type: string) => {
    if(!podcastClickLoad && !episodeClickLoad && !rssClickLoad) {
      if (type === "podcast") setPodcastClickLoad(true)
      if (type === "episode") setEpisodeClickLoad(true)
      if (type === "rss") setRssClickLoad(true)
    } else if(podcastClickLoad) {
      setPodcastClickLoad(false)
      setRssClickLoad(false)
      setEpisodeClickLoad(true)
    } else if(episodeClickLoad) {
      setPodcastClickLoad(true)
      setRssClickLoad(false)
      setEpisodeClickLoad(false)
    } else if(rssClickLoad) {
      setPodcastClickLoad(false)
      setRssClickLoad(true)
      setEpisodeClickLoad(false)
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setPodcastClickLoad(false)
      setEpisodeClickLoad(false)
      setRssClickLoad(false)
    }, 2000)
  }, [podcastClickLoad, episodeClickLoad, rssClickLoad])

  const switchToPodcast = () => {
    clickSwitch("podcast");
    if(!isUploadPodcast) _setLoadingPage(true)
  }
  const switchToEpisode = () => {
    clickSwitch("episode");
    if(!isUploadEpisode) _setLoadingPage(true)
  }

  const switchToRss = () => {
    clickSwitch("rss");
    if(!isRss) _setLoadingPage(true)
  }

  const routeIsMatchingClassName = routeMatches ? SIDENAV_BUTTON + " w-9 hover:text-white ": SIDENAV_BUTTON_BASE + " hover:text-zinc-100";

  return (
    <div className={DropdownParentStyling}>
      <button
        tabIndex={0}
        className={routeIsMatchingClassName}
      >
        <Icon icon="PLUS" className="" strokeWidth="0" fill="currentColor"/>
      </button>
      <ul
        tabIndex={0}
        className={dropdownContentStyling}
      >
        <li>
          <LinkWithProgress href="/upload-podcast" onClick={switchToPodcast} loading={podcastClickLoad} hrefText={t("home.add-podcast")} />
        </li>
        <li>
          <LinkWithProgress href="/upload-episode" onClick={switchToEpisode} loading={episodeClickLoad} hrefText={t("home.add-episode")} />
        </li>
        <li>
          <LinkWithProgress href="/rss" onClick={switchToRss} loading={rssClickLoad} hrefText={t("rss.importrss")} />
        </li>
      </ul>
    </div>
  );
};
