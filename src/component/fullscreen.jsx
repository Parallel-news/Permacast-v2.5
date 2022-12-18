import React, { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { appContext } from "../utils/initStateGen.js";
import { primaryData, secondaryData, switchFocus } from "../atoms/index.js";
import { useRecoilState } from "recoil";

export default function Fullscreen({ episode, number }) {
  const appState = useContext(appContext);
  const history = useHistory();
  const { t } = useTranslation();

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
  const [secondaryData_, setSecondaryData_] = useRecoilState(secondaryData);
  return (
    <div
      className="absolute h-full w-full z-[20] bg-black"
      onClick={console.log /*`url("${episode?.cover}")`}}> */}
    >
      <img
        className="absolute h-full w-full blur-lg opacity-30 object-cover"
        src={
          "https://arweave.net/" +
          primaryData_.podcasts
            .filter((obj) => {
              return obj.contentType === "audio/";
            })
            .filter((obj) => {
              return obj.episodes.filter((obj0) => {
                return obj0.eid === number;
              });
            })[0].cover
        }
        alt={episode?.episodeName}
      />
      <div className="absolute mt-28 w-full text-center select-text">
        <img
          className="w-[25%] cursor-pointer mx-auto"
          src={
            "https://arweave.net/" +
            primaryData_.podcasts
              .filter((obj) => {
                return obj.contentType === "audio/";
              })
              .filter((obj) => {
                return obj.episodes.filter((obj0) => {
                  return obj0.eid === number;
                });
              })[0].cover
          }
          alt={episode?.episodeName}
        />
        <div className="mt-5 text-3xl font-bold text-white">
          {t("fullscreen.episode")}{" "}
          {primaryData_.podcasts
            .filter((obj) => {
              return obj.contentType === "audio/";
            })
            .filter((obj) => {
              return obj.episodes.filter((obj0) => {
                return obj0.eid === number;
              });
            })[0]
            .episodes.findIndex((obj) => {
              return obj.eid === number;
            }) + 1}{" "}
        </div>
        <div className="mt-5 text-xl text-gray-300">{episode?.episodeName}</div>
      </div>
    </div>
  );
}
