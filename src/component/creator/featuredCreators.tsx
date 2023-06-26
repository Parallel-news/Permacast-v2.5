import axios from 'axios';
import { useTranslation } from "next-i18next";
import Link from 'next/link';
import React, { FC, Fragment } from "react";
import { useRecoilState } from "recoil";
import { useQuery } from '@tanstack/react-query';

import { currentThemeColorAtom, loadingPage } from "@/atoms/index";

import { PermacastANS } from '@/interfaces/helpers';
import { dimColorString, stringToHexColor } from "@/utils/ui";

import { CreatorNamesSmall, ProfileImage } from './reusables';

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

export const borderCreatorStyling = `flex flex-row justify-between items-center p-3 my-4 w-full border-2 border-zinc-600 border rounded-2xl `;
export const viewANSButtonStyling = `px-3 py-2 rounded-full text-sm ml-5 cursor-pointer hover:brightness-[5] default-animation outline-inherit `;
export const creatorLoadingStyling = `bg-gray-300/30 animate-pulse w-full h-20 mb-4 rounded-full `;
export const creatorHeadingStyling = `text-zinc-400 mb-4 `;

export const ViewANSButton: FC<ViewANSButtonProps> = ({ currentLabel }) => {
  const { t } = useTranslation();
  const [currentThemeColor] = useRecoilState(currentThemeColorAtom);
  const [, _setLoadingPage] = useRecoilState(loadingPage)
  return (
    <Link
      className={viewANSButtonStyling}
      style={{ backgroundColor: dimColorString(currentThemeColor, 0.1), color: currentThemeColor, }}
      href={`/creator/${currentLabel}`}
      onClick={() => _setLoadingPage(true)}
    >
      {t("view")}
    </Link>
  );
};

export const LoadingFeaturedCreators: FC = () => (
  <div className={creatorLoadingStyling}></div>
);

const Loading: FC<{ loading: boolean, dummyArray: any[] }> = ({ loading, dummyArray }) => (
  <>
    {loading && dummyArray.map((_, index) => (
      <LoadingFeaturedCreators key={index} />
    ))}
  </>
);

export const Creator: FC<{ creator: PermacastANS }> = ({ creator }) => {
  const { address, nickname, avatar, extension } = creator;
  const address_color = extension?.ansDomain ? stringToHexColor(extension.ansDomain) : stringToHexColor(address);
  return (
    <div>
      <div className={borderCreatorStyling}>
        <div className={`flexCenter `}>
          <ProfileImage {...{ currentLabel: nickname, avatar, address_color, size: 48 }} squared />
          <div className={"flexCol ml-4"}>
            <CreatorNamesSmall
              {...{ nickname: nickname || extension?.ansDomain, currentLabel: extension?.ansDomain }}
            />
          </div>
        </div>
        <ViewANSButton currentLabel={creator.nickname} />
      </div>
    </div>
  )
};

const fetchANSProfiles = async (addresses: string[]) => {
  const ans: PermacastANS[] = await Promise.all(
    addresses.map(async (address: string) => {
      try {
        return (await axios.get(`/api/ans/full/${address}`)).data
      } catch (e) {
        console.log(e);
        return {} as PermacastANS;
      }
    })
  );
  return ans;
};

export const FeaturedCreators: FC<{ addresses: string[] }> = ({ addresses }) => {

  const { t } = useTranslation();

  const creatorQuery = useQuery({
    queryKey: ["creators", addresses],
    queryFn: async () => {
      return { creators: await fetchANSProfiles(addresses) }
    },
  })

  return (
    <div className="h-[325px] overflow-y-hidden">
      <h2 className={creatorHeadingStyling}>{t("home.featuredcreators")}</h2>
      {creatorQuery.isLoading ?
        <Loading {...{ loading: true, dummyArray: [1, 1, 1] }} />
        :
        creatorQuery.data.creators.map((creator: PermacastANS, index: number) => (
          <Fragment key={index}>
            <Creator {... { creator }} />
          </Fragment>
        ))
      }
    </div>
  );
};

export default FeaturedCreators;