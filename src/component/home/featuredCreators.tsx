import axios from 'axios';
import React, { useState, useEffect, memo, FC } from "react";
import { useTranslation } from "next-i18next";

import { dimColorString } from "../../utils/ui";
import { useRecoilState } from "recoil";
import {
  switchFocus,
  videoSelection,
  creators,
  currentThemeColor,
  latestEpisodes
} from "../../atoms";
import { PodcastDev } from "../../interfaces/index";
import Image from 'next/image';
import Link from 'next/link';

const FeaturedCreators: FC = () => {
  // const history = useHistory();
  const { t } = useTranslation();
  const [currentThemeColor_, setCurrentThemeColor_] = useRecoilState(currentThemeColor);

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
    console.log(currentThemeColor_)
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
                    <Image
                      className="rounded-full h-12 w-12 object-cover"
                      src={"https://arweave.net/" + creator.avatar}
                      alt={creator?.nickname}
                    />
                  ) : (
                    <div
                      className="rounded-full h-12 w-12"
                      style={{backgroundColor: creator?.address_color}}
                    ></div>
                  )}
                  <div className="ml-4 flex items-center">
                    <div className="flex flex-col">
                      <div className="text-zinc-100 font-semibold cursor-pointer">
                        {creator?.nickname || creator?.nickname}
                      </div>
                      {creator?.currentLabel && (
                        <div className="text-zinc-400 cursor-pointer text-xs">
                          @{creator?.currentLabel}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  className="px-3 py-2 rounded-full text-sm ml-5 cursor-pointer"
                  style={{
                    backgroundColor: dimColorString(currentThemeColor_, 0.1),
                    color: currentThemeColor_,
                    // backgroundImage: `linear-gradient(to left, ${dimColorStringcurrentThemeColor_}, ${dimColorString("rgb(0, 0, 0)", 0.1)})`,
                    // transform: "rotate(90deg)"
                    // boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.5)",
                    // backgroundColor: 'linearGradient(to bottom right, yellow, black)'
                  }}
                  href={`/creator/${creator.user}`}
                >
                  {/* <div className="absolute bg-gradient-to-l from-[#9E00FF] to-[#1273EA] rotate-45 origin-center w-full h-full"></div> */}
                  {t("view")}
                </Link>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default FeaturedCreators;