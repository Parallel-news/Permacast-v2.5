import { useTranslation } from "next-i18next";

import { EPISODE_SLIPPAGE } from "@/constants/index";

import { rssEpisode } from "@/interfaces/rss";

import { calculateSizeCost, getGigabyteCost, getReadableSize } from "@/utils/arseeding";
 
import { Icon } from "@/component/icon";
import CommonTooltip from "@/component/reusables/tooltip";

interface RssEpisodeUI extends rssEpisode {
  number: number;
  isUploaded?: boolean;
};

const tooltipIcon = `bg-green-500 rounded-full w-5 h-5 text-white shrink-0 p-1 `;

const RssEpisodeItem = ({ title, length, number, isUploaded }: RssEpisodeUI) => {
  const { t } = useTranslation();
  const { data: gigabyteCost } = getGigabyteCost();

  const size = getReadableSize(Number(length));
  const cost = (calculateSizeCost(gigabyteCost, Number(length)) + EPISODE_SLIPPAGE).toFixed(2);

  return (
    <div className="bg-zinc-800 default-animation rounded-xl px-5 py-3 w-full text-white flex justify-between">
      <div className="line-clamp-2">#{number}: {title}</div>
      <div className="ml-4 flex shrink-0 gap-x-2">
        {isUploaded && (
          <CommonTooltip
            id={`episodeExistsTip-${number}`}
            triggerJSX={<Icon className={tooltipIcon} icon="CHECK" />}
            tooltipJSX={t("rss.episode-already-saved")}
          />
        )}
        <div>{size || ""}</div>
        <div>{cost || "0"} AR</div>
      </div>
    </div>
  );
};

export default RssEpisodeItem;