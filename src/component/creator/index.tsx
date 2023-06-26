import React, { FC, useEffect, useState } from 'react';
import { shortenAddress, useArconnect } from 'react-arconnect';
import { useRecoilState } from 'recoil';

import { loadingPage, podcastColorAtom, userBannerImageAtom } from '@/atoms/index';
import { ANS_TEMPLATE } from '@/constants/ui';

import { Ans, FullEpisodeInfo, Podcast } from '@/interfaces/index';

import { getPodcastData } from '@/features/prefetching';
import { hexToRGB } from '@/utils/reusables';
import { RGBobjectToString, stringToHexColor } from '@/utils/ui';

import { CreatorTipModal } from './reusables';
import { FollowButton } from './follow';
import FeaturedPodcastCarousel from '@/component/reusables/FeaturedPodcastCarousel';
import TipButton from '@/component/reusables/tip';

const CreatorNames = React.lazy(() => import('./reusables').then(module => ({ default: module.CreatorNames })))
const EditButton = React.lazy(() => import('./edit').then(module => ({ default: module.EditButton })))
const Followers = React.lazy(() => import('./reusables').then(module => ({ default: module.Followers })))
const LatestEpisodes = React.lazy(() => import('./reusables').then(module => ({ default: module.LatestEpisodes })))
const ProfileImage = React.lazy(() => import('./reusables').then(module => ({ default: module.ProfileImage })))
const ViewANSButton = React.lazy(() => import('./reusables').then(module => ({ default: module.ViewANSButton })))

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */

// 1. Interfaces

// 2. Stylings

export const CreatorBioStyling = `h-8 select-text `;
export const CreatorPageStyling = `mt-12 h-full pb-40 `;
export const WhiteLargeFont = `text-3xl font-bold text-white `;
export const InputFocusStyling = `focus:opacity-0 focus:z-20 `;
export const CreatorUploadPhotoIconStyling = `h-8 w-8 text-inherit `;
export const CreatorVerificationParentStyling = `ml-2 md:ml-3 mt-1 `;
export const TransparentHidden = `absolute opacity-0 pointer-events-none `;
export const podcastCarouselStyling = `max-w-[100vw] mt-8 carousel gap-x-4 py-3`;
export const creatorLabelStyling = `select-text text-lg font-medium text-[#828282] `;
export const creatorLabelSmallStyling = `select-text text-sm font-medium text-[#828282] `;
export const flexItemsCenter = `flexColCenter gap-y-2 md:gap-y-0 md:flex-row  `;
export const creatorHeaderStyling = `flexColCenter justify-between md:flex-row `;
export const creatorNicknameSmallStyling = `select-text font-medium tracking-wide text-white `;
export const creatorNicknameStyling = `select-text text-3xl font-medium tracking-wide text-white `;
export const CreatorProfileParentStyling = flexItemsCenter + `gap-x-7 ml-2 text-center md:text-left `;
export const CreatorEditBannerInputStyling = TransparentHidden + InputFocusStyling + `top-12 left-40 `;
export const CreatorEditAvatarInputStyling = TransparentHidden + InputFocusStyling + `top-28 left-5 w-24 `;
export const CreatorEditBannerStyling = `flexCol w-full h-32 bg-zinc-800 inset-0 border-dotted border-zinc-600 hover:border-white text-zinc-400 hover:text-white rounded-xl border-2 items-center justify-center default-no-outline-ringed inset default-animation focus:ring-white cursor-pointer `;
export const CreatorEditAvatarStyling = `flexColFullCenter mb-2 mx-3 shrink-0 w-28 h-28 rounded-full bg-zinc-900 text-zinc-400 focus:text-white hover:text-white default-animation absolute -bottom-16 left-0 border-2 border-zinc-900 hover:border-white focus:border-white default-no-outline-ringed cursor-pointer `;

// 3. Custom Functions
export const sortByDate = (episodes: FullEpisodeInfo[], descending = false): FullEpisodeInfo[] => {
  return episodes.sort((a, b) => {
    if (descending) {
      return b.episode.uploadedAt - a.episode.uploadedAt;
    } else {
      return a.episode.uploadedAt - b.episode.uploadedAt;
    };
  });
};

export const CreatorPageComponent: FC<{ creator: Ans }> = ({ creator }) => {

  const { ANSuserExists, currentLabel, address_color, user, PASOM } = creator;
  const nickname = PASOM?.nickname || creator?.nickname || '';
  const avatar = PASOM?.avatar || creator?.avatar || '';
  const banner = PASOM?.banner || '';
  const bio = PASOM?.bio || '';

  const { walletConnected, address } = useArconnect();

  const [, setUserBannerImage] = useRecoilState(userBannerImageAtom);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => { setUserBannerImage(banner) }, [banner]);
  useEffect(() => {
    const isFollowing = PASOM?.followers?.includes(address);
    setIsFollowing(isFollowing);
  }, [PASOM, address]);

  const queryPodcastData = getPodcastData();

  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage);

  useEffect(() => {
    if (!creator) return;
    //@ts-ignore
    const color = RGBobjectToString(hexToRGB(creator?.address_color || "#000000"));
    setPodcastColor(color);
  }, [creator]);

  useEffect(() => {
    queryPodcastData.refetch()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { _setLoadingPage(false); }, 1000);
    return () => clearTimeout(timer);
  }, [_loadingPage])

  //Retrieve Creator Podcast & Latest Episodes
  let podcasts: Podcast[] = [];
  let episodes: FullEpisodeInfo[] = []
  if (queryPodcastData.data) {
    try {

      const creatorPodcasts = queryPodcastData.data?.podcasts?.filter((podcast: Podcast) => podcast.owner === user);
      podcasts = creatorPodcasts.reverse() || [];
        //Sort Episodes & Check if Hidden 
        episodes = podcasts
        .flatMap((podcast) =>
          podcast.episodes.flatMap((episode) => {
            if (!episode.isVisible && episode.uploader === address) {
              return [{ episode, podcast }];
            } else if (episode.isVisible) {
              return [{ episode, podcast }];
            } else {
              return [];
            }
          })
        )
        .sort((a, b) => b.episode.uploadedAt - a.episode.uploadedAt)
        .slice(0, 3);
      
    } catch {
      podcasts = [];
    }
  };

  const openModalCallback = () => setIsOpen(prev => !prev);
  const tipModalArgs = { ANSorAddress: ANSuserExists ? currentLabel : user, recipientAddress: user, isOpen, setIsOpen };

  return (
    <div className={CreatorPageStyling}>
      <CreatorTipModal {...tipModalArgs} />
      <div className={creatorHeaderStyling}>
        <div className={CreatorProfileParentStyling}>
          <ProfileImage {...{ currentLabel, avatar, address_color }} linkToArPage={ANSuserExists} />
          <div className={`flexCol`}>
            <div className={`flexCenter justify-center md:justify-start `}>
              <CreatorNames {...{ nickname, currentLabel, ANSuserExists }} />
            </div>
            <div className={CreatorBioStyling}>
              <p className="line-clamp-2">{bio}</p>
              <Followers {...{ PASoMProfile: PASOM, isFollowing, direction: "horizontal" }} />
            </div>
          </div>
        </div>
        <div className={flexItemsCenter + `mr-3 hidden md:flex `}>
          {ANSuserExists && <ViewANSButton {...{ currentLabel }} />}
          {address !== user && <TipButton {...{ openModalCallback }} />}
          {address !== user && <FollowButton {...{ user, walletConnected, isFollowing, setIsFollowing }} />}
          {address === user && <EditButton {...{ PASoMProfile: PASOM }} />}
        </div>
      </div>
      <>{!!podcasts?.length && <FeaturedPodcastCarousel podcasts={podcasts || []} />}</>
      <>{episodes?.length !== 0 && <React.Suspense><LatestEpisodes {...{ episodes }} /></React.Suspense>}</>
    </div>
  );
};

export const Creator404: FC<{ address: string }> = ({ address }) => {

  const [user, currentLabel, nickname] = Array(3).fill(shortenAddress(address, 8));
  const address_color = stringToHexColor(address || 'rgb');

  const creator = ANS_TEMPLATE;

  creator.user = user;
  creator.currentLabel = currentLabel;
  creator.nickname = nickname;
  creator.address_color = address_color;

  return <CreatorPageComponent {...{ creator }} />;
};
