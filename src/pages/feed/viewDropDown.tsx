import { useTranslation } from "next-i18next";
import { FC } from "react";
import { useRecoilState } from "recoil";
import { EyeSlashIcon, Bars3BottomRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { chronStatusAtom, hide0EpisodesAtom } from "../../atoms";
import { Dropdown, dropdownMenuClass as dropdownClassPrev, menuItemClass, ExtendedDropdownButtonProps } from "../../component/reusables";

const ViewDropDown: FC = () => {

  const { t } = useTranslation();

  const [chronStatus, setChronStatus] = useRecoilState<number>(chronStatusAtom);
  const [hide0Episodes, setHide0Episodes] = useRecoilState<boolean>(hide0EpisodesAtom);

  const iconClassName = `text-white w-5 h-5 `;
  const flexGap2 = `flexCenter gap-x-2 w-full `;

  const SortByUploadDateButton: FC = () => (
    <button className={flexGap2} onClick={() => {
      // Timeout so text doesnt change mid-click
      setTimeout(() => setChronStatus(prev => prev + 1), 500)
    }}>
      <ClockIcon className={iconClassName} />
      {chronStatus % 2 ? t("feed-page.showOldest") : t("feed-page.showNewest")}
    </button>
  );

  const Hide0EpisodePodcastsButton: FC = () => (
    <button className={flexGap2} onClick={() => (
      setTimeout(() => setHide0Episodes(prev => !prev), 500)
    )}>
      <EyeSlashIcon className={iconClassName} />
      {hide0Episodes ? t("feed-page.show0EpisodePodcasts") : t("feed-page.hide0EpisodePodcasts")}
    </button>
  );

  const items: ExtendedDropdownButtonProps[] = [
    { key: "showNewest", jsx: <SortByUploadDateButton /> },
    { key: "hide0Episodes", jsx: <Hide0EpisodePodcastsButton /> }
  ];

  const openMenuButton = <Bars3BottomRightIcon className="h-5 w-5" aria-hidden="true" />;
  const openMenuButtonClass = `rounded-lg min-w-min bg-zinc-900 justify-start `;
  const dropdownMenuClass = dropdownClassPrev + `text-sm w-96 `;

  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default ViewDropDown;