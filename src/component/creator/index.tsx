import React, { ReactNode } from 'react';
import { FC, useEffect, useState } from 'react';
import { shortenAddress, useArconnect } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { FullEpisodeInfo, Podcast } from '../../interfaces';
import { stringToHexColor } from '../../utils/ui';
import { userBannerImageAtom } from '../../atoms';

import { PASoMProfile } from '../../interfaces/pasom';
import TipButton from '../reusables/tip';
import { flexCenter } from './featuredCreators';
import { ExtendedDropdownButtonProps } from '../reusables/dropdown';

const CreatorNames = React.lazy(() => import('./reusables').then(module => ({default: module.CreatorNames})))
const CreatorTipModal = React.lazy(() => import('./reusables').then(module => ({default: module.CreatorTipModal})))
const FeaturedPodcasts = React.lazy(() => import('./reusables').then(module => ({default: module.FeaturedPodcasts})))
const Followers = React.lazy(() => import('./reusables').then(module => ({default: module.Followers})))
const LatestEpisodes = React.lazy(() => import('./reusables').then(module => ({default: module.LatestEpisodes})))
const ViewANSButton = React.lazy(() => import('./reusables').then(module => ({default: module.ViewANSButton})))
const ProfileImage = React.lazy(() => import('./reusables').then(module => ({default: module.ProfileImage})))
const EditButton = React.lazy(() => import('./edit').then(module => ({default: module.EditButton}))) 
const FollowButton = React.lazy(() => import('./follow').then(module => ({default: module.FollowButton}))) 
const Dropdown = React.lazy(() => import('../reusables/dropdown').then(module => ({default: module.default}))) 

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */

// 1. Interfaces
interface CreatorPageComponentProps {
  ANSuserExists?: boolean;
  currentLabel: string;
  avatar: string;
  address_color: string;
  nickname: string;
  user: string;
  PASoMProfile: PASoMProfile | undefined;
  podcasts: Podcast[];
  episodes: FullEpisodeInfo[];
};


// 2. Stylings
export const creatorHeaderStyling = `flex flex-col md:flex-row items-center justify-between `;
export const creatorNicknameStyling = `select-text text-3xl font-medium tracking-wide text-white `;
export const creatorLabelStyling = `select-text text-lg font-medium text-[#828282] `;
export const creatorNicknameSmallStyling = `select-text font-medium tracking-wide text-white `;
export const creatorLabelSmallStyling = `select-text text-sm font-medium text-[#828282] `;
export const WhiteLargeFont = `text-3xl font-bold text-white `;
export const podcastCarouselStyling = `w-full mt-8 carousel gap-x-12 py-3 `;
export const flexCol = `flex flex-col `;
export const flexItemsCenter = `flex flex-col gap-y-2 md:gap-y-0 md:flex-row items-center `;
export const CreatorPageStyling = `mt-12 h-full pb-40 `;
export const CreatorProfileParentStyling = flexItemsCenter + `gap-x-7 ml-2 text-center md:text-left `;
export const CreatorUploadPhotoIconStyling = `h-8 w-8 text-inherit `;
export const CreatorVerificationParentStyling = `ml-2 md:ml-3 mt-1 `;
export const CreatorBioStyling = `h-8 select-text `;
export const TransparentHidden = `absolute opacity-0 pointer-events-none `;
export const InputFocusStyling = `focus:opacity-0 focus:z-20 `;
export const CreatorEditBannerInputStyling = TransparentHidden + InputFocusStyling + `top-12 left-40 `;
export const CreatorEditAvatarInputStyling = TransparentHidden + InputFocusStyling + `top-28 left-5 w-24 `;
export const CreatorEditBannerStyling = flexCol + `w-full h-32 bg-zinc-800 inset-0 border-dotted border-zinc-600 hover:border-white text-zinc-400 hover:text-white rounded-xl border-2 items-center justify-center default-no-outline-ringed inset default-animation focus:ring-white cursor-pointer `;
export const CreatorEditAvatarStyling = flexCol + `items-center justify-center mb-2 mx-3 shrink-0 w-28 h-28 rounded-full bg-zinc-900 text-zinc-400 focus:text-white hover:text-white default-animation absolute -bottom-16 left-0 border-2 border-zinc-900 hover:border-white focus:border-white default-no-outline-ringed cursor-pointer `;

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

export const CreatorPageComponent: FC<{ creator: CreatorPageComponentProps }> = ({ creator }) => {

  const { ANSuserExists, currentLabel, address_color, user, PASoMProfile, podcasts, episodes } = creator;
  const nickname = PASoMProfile?.nickname || creator?.nickname || '';
  const avatar = PASoMProfile?.avatar || creator?.avatar || '';
  const banner = PASoMProfile?.banner || '';
  const bio = PASoMProfile?.bio || '';
  
  const { walletConnected, address } = useArconnect();

  const [, setUserBannerImage] = useRecoilState(userBannerImageAtom);
  
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userModalIsOpen, setUserModalIsOpen] = useState<boolean>(false);

  //useEffect(() => {setUserBannerImage(banner)}, [banner]);
  useEffect(() => {
    const isFollowing = PASoMProfile?.followers?.includes(address);
    setIsFollowing(isFollowing);
  }, [PASoMProfile, address]);

  const openModalCallback = () => setIsOpen(prev => !prev);
  const openUserDetailsModal = () => setUserModalIsOpen(prev => !prev);
  const tipModalArgs = { ANSorAddress: ANSuserExists ? currentLabel : user, recipientAddress: user, isOpen, setIsOpen };

  const Items = (): ExtendedDropdownButtonProps[] => {
    const buttonsArray = [];
    if (ANSuserExists) buttonsArray.push({key: "view-ans", jsx: <ViewANSButton {...{ currentLabel }} />});
    if (address !== user) buttonsArray.push({key: "tip", jsx: <TipButton {...{ openModalCallback }} />});
    if (address !== user) buttonsArray.push({key: "follow", jsx: <FollowButton {...{ user, walletConnected, isFollowing, setIsFollowing }} />});
    if (address === user) buttonsArray.push({key: "profile", jsx: <EditButton {...{ PASoMProfile }} />});
    return buttonsArray;
  };

  // const UserActions: FC = () => (<Dropdown items={Items()} />);

  return (
    <div className={CreatorPageStyling}>
      <CreatorTipModal {...tipModalArgs} />
      <div className={creatorHeaderStyling}>
        <div className={CreatorProfileParentStyling}>
          <ProfileImage {...{ currentLabel, avatar, address_color }} linkToArPage={ANSuserExists} />
          <div className={flexCol}>
            <div className={flexCenter + `justify-center md:justify-start `}>
              <CreatorNames {...{ nickname, currentLabel, ANSuserExists }} />
            </div>
            <div className={CreatorBioStyling}>
              <p className="line-clamp-2">{bio}</p>
              <Followers {...{ PASoMProfile, isFollowing, direction: "horizontal" }} />
            </div>
          </div>
        </div>
        <div className={flexItemsCenter + `mr-3 hidden md:flex `}>
          {ANSuserExists && <ViewANSButton {...{ currentLabel }} />}
          {address !== user && <TipButton {...{ openModalCallback }} />}
          {address !== user && <FollowButton {...{ user, walletConnected, isFollowing, setIsFollowing }} />}
          {address === user && <EditButton {...{ PASoMProfile }} />}
        </div>
      </div>
      <>{podcasts.length !== 0 && <FeaturedPodcasts {...{ podcasts }} />}</>
      <>{episodes.length !== 0 && <LatestEpisodes {...{ episodes }} />}</>
    </div>
  );
};

export const Creator404: FC<{ address: string }> = ({ address }) => {

  const [user, currentLabel, nickname] = Array(3).fill(shortenAddress(address, 8));
  const address_color = stringToHexColor(address || 'rgb');

  const creator: CreatorPageComponentProps = {
    ANSuserExists: false,
    user,
    currentLabel,
    address_color,
    podcasts: [],
    episodes: [],
    avatar: '',
    nickname,
    PASoMProfile: undefined
  };

  return <CreatorPageComponent {...{ creator }} />;
};
