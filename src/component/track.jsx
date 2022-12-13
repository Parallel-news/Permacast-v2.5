import { useEffect, useContext, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Cooyub } from "./reusables/icons";
import { appContext } from "../utils/initStateGen";
import { getButtonRGBs } from "../utils/ui";
import PlayButton from "./reusables/playButton";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import { primaryData, secondaryData, switchFocus } from "../atoms";
import { useRecoilState } from "recoil";

export default function Track({
  episode,
  episodeNumber = 1,
  includeDescription = false,
  includePlayButton = true,
  color = "",
}) {
  const appState = useContext(appContext);
  const history = useHistory();
  const {
    contentTx,
    episodeName,
    creatorName,
    description,
    podcastId,
    objectType,
    creatorAddress,
  } = episode;
  const { currentEpisode, playEpisode } = appState.queue;
  const { isPaused, setIsPaused } = appState.playback;

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
  const [secondaryData_, setSecondaryData_] = useRecoilState(secondaryData);

  const { player } = appState;
  const c = color ? color : episode?.rgb;
  // const id = objectType === 'episode' ? episodeId : podcastId;
  const url = `/podcast/${secondaryData_.pid}` + `/${episode.eid}`;

  function getHex(string) {
    let newstr = string + "";
    newstr = string
      .split("")
      .reduce(
        (hex, c) => (hex += c.charCodeAt(0).toString(16).padStart(4, "0")),
        ""
      );
    if (newstr.length > 6) {
      newstr = newstr.slice(0, 6);
    }
    if (newstr.length < 6) {
      newstr = string + "0".repeat(6 - string.length);
    }
    return newstr;
  }

  const playCurrentTrack = () => {
    if (!player) return;
    player.toggle();
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img
          className="w-14 h-14 rounded-lg cursor-pointer"
          src={"https://arweave.net/" + secondaryData_.cover}
          alt={episode.episodeName}
          onClick={() => history.push(url)}
        />
        <div className="ml-4 flex flex-col">
          <div
            className="cursor-pointer line-clamp-1 pr-2 text-sm"
            onClick={() => history.push(url)}
          >
            {episode.episodeName}
          </div>
          <div className="flex items-center">
            <>
              <p className="text-zinc-400 text-[8px]">by</p>
              <div
                style={getButtonRGBs(c)}
                className="ml-1.5 p-1 rounded-full cursor-pointer"
              >
                <div className="flex items-center min-w-max">
                  {/* <img className="h-6 w-6" src={cover} alt={episodeName} /> */}
                  <Cooyub
                    className="rounded-full"
                    svgStyle="h-2 w-2"
                    rectStyle="h-6 w-6"
                    fill={"#00ff00"}
                  />
                  <p
                    className="text-[8px] pr-1 ml-1 "
                    onClick={() => history.push("/creator/" + creatorAddress)}
                  >
                    @
                    {
                      primaryData_.podcasts.filter((obj) => {
                        return obj.episodes.filter((obj0) => {
                          return obj0.eid === episode.eid;
                        });
                      })[0].author
                    }
                  </p>
                </div>
              </div>
            </>
            {includeDescription && description && (
              <div className="mx-1.5 w-full line-clamp-1 text-xs">
                {episode.description}
              </div>
            )}
          </div>
        </div>
      </div>
      {includePlayButton && (
        <PlayButton episode={episode} episodeNumber={episodeNumber} />
      )}
    </div>
  );
}
