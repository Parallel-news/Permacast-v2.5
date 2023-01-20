import axios from 'axios';
import React, { useState, useEffect, memo, FC } from "react";
import { useTranslation } from "next-i18next";
import { useAns } from 'ans-for-all';
import {
  replaceDarkColorsRGB,
  isTooLight,
  trimANSLabel,
  RGBobjectToString,
} from "../../utils/ui";
import { getCreator } from "../../utils/podcast";
import { Cooyub, PlayButton, GlobalPlayButton } from "../reusables/icons";
import { EyeIcon } from "@heroicons/react/24/outline";
import { FaPlay } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import Track from "../track";
import { useRecoilState } from "recoil";
import {
  switchFocus,
  videoSelection,
  creators,
  currentThemeColor,
  latestEpisodes
} from "../../atoms";
import { PodcastDev } from "../../interfaces/index";

const FeaturedCreators: FC = () => {
  // const history = useHistory();
  const { t } = useTranslation();
  const [currentThemeColor_, setCurrentThemeColor_] = useRecoilState(currentThemeColor)

  const wl = [
    "kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI",
    "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0",
    "lIg5mdDMAAIj5Pn2BSYKI8SEo8hRIdh-Zrn_LSy_3Qg"
  ]

  const [ dataLoaded, setDataLoaded ] = useState(false);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  const [_creators, _setCreators] = useRecoilState(creators);

  // Fetch Creators
  useEffect(() => {
    const fetchCreators = async () => {
      setCreatorsLoading(true);
      const creators = await Promise.all(
        wl.map((address: string) => axios.get(`/api/ans/${address}`)
      ));
      console.log(creators.map(promise => promise.data))
      _setCreators(creators.map(promise => promise.data))
      setCreatorsLoading(false);
    }

    fetchCreators()
  }, []);

  return (
    <div>
      <h2 className="text-zinc-400 mb-4">{t("home.featuredcreators")}</h2>
      {creatorsLoading ? (
        <>
          <div className="bg-gray-300/30 animate-pulse w-full h-20 mb-4 mt-4 rounded-full"></div>
          <div className="bg-gray-300/30 animate-pulse w-full h-20 mb-4 rounded-full"></div>
          <div className="bg-gray-300/30 animate-pulse w-full h-20 mb-4 rounded-full"></div>
        </>
      ) : (
        <>
          {_creators.map((creator, index) => (
            <div key={index}>
              <div className="flex justify-between items-center p-4 mb-4 w-full border-zinc-800 border rounded-3xl">
                <div className="flex items-center">
                  {creator?.avatar ? (
                    <img
                      className="rounded-full h-12 w-12 object-cover"
                      src={"https://arweave.net/" + creator?.avatar}
                      alt={creator?.nickname}
                    />
                  ) : (
                    <Cooyub
                      svgStyle="rounded-lg h-12 w-12"
                      rectStyle="h-6 w-6"
                      fill={"rgb(255, 80, 0)"}
                    />
                  )}
                  <div className="ml-4 flex items-center">
                    <div className="flex flex-col">
                      <div className="text-zinc-100 text-sm cursor-pointer">
                        {creator?.nickname || creator?.user}
                      </div>
                      {creator?.label && (
                        <div className="text-zinc-400 cursor-pointer text-[8px]">
                          @{creator?.label}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" ">
                  <p
                    className="px-3 py-2 rounded-full text-[10px] ml-5 cursor-pointer"
                    style={{ backgroundColor: currentThemeColor_, color: currentThemeColor_ }}
                    // onClick={() => history.push("/creator/" + creator?.user)}
                  >
                    {t("view")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default FeaturedCreators;