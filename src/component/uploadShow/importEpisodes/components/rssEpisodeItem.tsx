import { useTranslation } from "next-i18next";

import { EPISODE_SLIPPAGE } from "@/constants/index";

import { rssEpisode } from "@/interfaces/rss";

import { calculateSizeCost, getGigabyteCost, getReadableSize } from "@/utils/arseeding";
 
import { Icon } from "@/component/icon";
import CommonTooltip from "@/component/reusables/tooltip";


const base = `rounded-full w-5 h-5 text-white shrink-0 p-1`;
const tooltipCheckIcon = `bg-green-500 ` + base;
const tooltipCrossIcon = `bg-red-600 ` + base;

// https://podcasternews.com/feed/

const RssEpisodeItem = ({ title, length, order, isUploaded, error }: rssEpisode) => {

  const { t } = useTranslation();
  const { data: gigabyteCost } = getGigabyteCost();

  const size = getReadableSize(Number(length));
  const cost = (calculateSizeCost(gigabyteCost, Number(length)) + EPISODE_SLIPPAGE).toFixed(2);

  return (
    <div className="bg-zinc-800 default-animation rounded-xl px-5 py-3 w-full text-white flexBetween">
      <div className="line-clamp-2">#{order}: {title}</div>
      <div className="ml-4 flexYCenterGapX shrink-0 cursor-pointer">
        {isUploaded && (
          <CommonTooltip
            id={`episodeExists-${order}`}
            triggerJSX={<Icon className={tooltipCheckIcon} icon="CHECK" />}
            tooltipJSX={t("rss.episode-already-saved")}
          />
        )}
        {error && (
          <CommonTooltip
            id={`episodeError-${order}`}
            triggerJSX={<Icon className={tooltipCrossIcon} icon="XMARK" />}
            tooltipJSX={error}
          />
        )}
        <div>{size || ""}</div>
        <div>{cost || "0"} AR</div>
      </div>
    </div>
  );
};

export default RssEpisodeItem;