import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

import { currentThemeColorAtom } from "@/atoms/index";

import { Cooyub } from "@/component/reusables/icons";
import { Icon } from "@/component/icon";
import {
  HelpDropdown,
  LanguageDropdown,
  NavButton,
  UploadDropdown,
} from "./sidenavButtons";

const size36x2 = `w-9 h-9`;
const SideNavStyling = `hidden md:flex flex-col items-center gap-y-9 h-full pt-10 w-[100px] text-zinc-400 z-50 `;

export const Sidenav = () => {
  const router = useRouter();

  const [currentThemeColor] = useRecoilState(currentThemeColorAtom);

  const isHome = router.pathname === "/";
  const isFeed = router.pathname === "/feed";
  const isUploadPodcast = router.pathname === "/upload-podcast";
  const isUploadEpisode = router.pathname === "/upload-episode";
  const isRSSImport = router.pathname === "/rss";
  const isUpload = isUploadPodcast || isUploadEpisode || isRSSImport;

  return (
    <div className={SideNavStyling}>
      <NavButton
        href="/"
        disabled={isHome}
        icon={
          <Cooyub
            svgStyle={size36x2}
            rectStyle={size36x2}
            fill={currentThemeColor}
          />
        }
      />
      <NavButton
        href="/"
        disabled={isHome}
        icon={<Icon icon="HOME" className={size36x2} />}
      />
      <NavButton
        href="/feed"
        disabled={isFeed}
        icon={<Icon icon="RECTANGLESTACK" className={size36x2} />}
      />
      <LanguageDropdown />
      <UploadDropdown routeMatches={isUpload} />
      <HelpDropdown />
    </div>
  );
};
