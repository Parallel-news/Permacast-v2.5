import { useTranslation } from "next-i18next";
import { FC } from "react";
import { useRecoilState } from "recoil";
import { Dropdown, DropdownButtonProps } from "@nextui-org/react"
import { EyeSlashIcon, Bars3BottomRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { chronStatusAtom, hide0EpisodesAtom } from "../../atoms";
import { flexCenter } from "../../component/creator/featuredCreators";
import { ExtendedDropdownButtonProps } from "../../component/reusables/dropdown";

const ViewDropDown: FC = () => {

  const { t } = useTranslation();

  const [chronStatus, setChronStatus] = useRecoilState<number>(chronStatusAtom);
  const [hide0Episodes, setHide0Episodes] = useRecoilState<boolean>(hide0EpisodesAtom);

  const filterStyling = `w-12 h-12 text-zinc-600 cursor-pointer hover:bg-zinc-700 rounded-full default-no-outline-ringed default-animation px-2 `;
  const className = 'text-white w-4 h-4 ';
  const flexGap2 = flexCenter + `gap-x-2 w-full`;

  const SortByUploadDateButton = () => (
    <button className={flexGap2} onClick={() => {
      // Timeout so text doesnt change mid-click
      setTimeout(() => setChronStatus(prev => prev + 1), 500)
    }}>
      <ClockIcon {...{ className }} />
      {chronStatus % 2 ? t("feed-page.showOldest") : t("feed-page.showNewest")}
    </button>
  );

  const Hide0EpisodePodcastsButton = () => (
    <button className={flexGap2} onClick={() => (
      setTimeout(() => setHide0Episodes(prev => !prev), 500)
    )}>
      <EyeSlashIcon {...{ className }} />
      {hide0Episodes ? t("feed-page.show0EpisodePodcasts") : t("feed-page.hide0EpisodePodcasts")}
    </button>
  )
  const menuItems = [
    { key: "showNewest", name: "Show Newest", jsx: <SortByUploadDateButton /> },
    { key: "hide0Episodes", name: "Hide 0 episode Podcasts", jsx: <Hide0EpisodePodcastsButton /> }
  ];

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Bars3BottomRightIcon className={filterStyling} />
      </Dropdown.Trigger>
      <Dropdown.Menu
        aria-label="Dynamic Actions"
        items={menuItems}
        className="bg-zinc-900 w-20"
      >
        {(item: ExtendedDropdownButtonProps) => (
          <Dropdown.Item
            key={item.key}
            className='bg-zinc-900 hover:bg-zinc-700 w-60 text-white'
          >
            {item.jsx}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ViewDropDown;