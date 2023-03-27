import axios from 'axios';
import React, { useState, useEffect, FC } from "react";
import { useTranslation } from "next-i18next";

import { dimColorString } from "../../utils/ui";
import { useRecoilState } from "recoil";
import {
  creatorsAtom,
  currentThemeColorAtom,
} from "../../atoms";
import Link from 'next/link';
import { CreatorNamesSmall, flexCol, ProfileImage } from './';
import { Ans } from '../../interfaces';

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
*/
export interface ViewANSButtonProps {
  currentLabel: string;
}

export const flexCenter = `flex items-center `;
export const borderCreatorStyling = `flex justify-between items-center p-3 my-4 w-full border-2 border-zinc-600 border rounded-2xl `;
export const viewANSButtonStyling = `px-3 py-2 rounded-full text-sm ml-5 cursor-pointer hover:brightness-[5] default-animation `;
export const creatorLoadingStyling = `bg-gray-300/30 animate-pulse w-full h-20 mb-4 rounded-full `;
export const creatorHeadingStyling = `text-zinc-400 mb-4 `;

export const ViewANSButton: FC<ViewANSButtonProps> = ({ currentLabel }) => {
  const { t } = useTranslation();
  const [currentThemeColor] = useRecoilState(currentThemeColorAtom);

  return (
      <Link
        className={viewANSButtonStyling}
        style={{ backgroundColor: dimColorString(currentThemeColor, 0.1), color: currentThemeColor, }}
        href={`/creator/${currentLabel}`}
      >
        {t("view")}
      </Link>
  );
};

export const LoadingFeaturedCreators: FC = () => (
  <div className={creatorLoadingStyling}></div>
);

const Loading:FC<{ loading: boolean, dummyArray: any[] }> = ({ loading, dummyArray }) => (
  <>
    {loading && dummyArray.map((_, index) => (
      <LoadingFeaturedCreators key={index} />
    ))}
  </>
);

const CreatorsMap: FC<{ creators: Ans[] }> = ({ creators }) => (
  <>
    {creators.map((creator: Ans, index: number) => (
      <div key={index}>
        <div className={borderCreatorStyling}>
          <div className={flexCenter}>
            {(({ currentLabel, avatar, address_color }) => 
              <ProfileImage {...{currentLabel, avatar, address_color, size: 48}} squared />)
            (creator)}
            <div className={flexCol + " ml-4"}>
              {(({ nickname, currentLabel }) => 
                <CreatorNamesSmall {...{ nickname, currentLabel }} />
              )(creator)}
            </div>
          </div>
          <ViewANSButton currentLabel={creator.currentLabel} />
        </div>
      </div>
    ))}
  </>
);


export const FeaturedCreators: FC = () => {

  const { t } = useTranslation();
  const [currentThemeColor, setcurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  const wl = [
    "kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI",
    "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0",
    "lIg5mdDMAAIj5Pn2BSYKI8SEo8hRIdh-Zrn_LSy_3Qg"
  ]

  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useRecoilState(creatorsAtom);

  useEffect(() => {
    const fetchCreators = async () => {
      const creators = await Promise.all(
        wl.map((address: string) => axios.get(`/api/ans/${address}`)
      ));
      setCreators(creators.map(promise => promise.data));
      setLoading(false);
    }
    fetchCreators();
  }, []);

  return (
    <div>
      <h2 className={creatorHeadingStyling}>{t("home.featuredcreators")}</h2>
      <Loading {...{ loading, dummyArray: wl }} />
      <CreatorsMap {...{ creators }} />
    </div>
  );
};

export default FeaturedCreators;