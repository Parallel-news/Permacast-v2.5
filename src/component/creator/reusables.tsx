import React from 'react';
import { useTranslation } from 'next-i18next';
import { PASoMProfile } from '../../interfaces/pasom';
import { Dispatch, FC, SetStateAction } from 'react';
import Link from 'next/link';
import { ARSEED_URL } from '../../constants';
import Image from 'next/image';
import { dimColorString, hexToRGB, isTooLight } from '../../utils/ui';
import { shortenAddress } from 'react-arconnect';

import { useRecoilState } from 'recoil';
import { currentThemeColorAtom } from '../../atoms';
import { hoverableLinkButtonStyling } from '../reusables/themedButton';
import { FullEpisodeInfo, Podcast } from '../../interfaces';

const Verification = React.lazy(()=> import('../reusables/Verification'))
const Track = React.lazy(()=> import('../reusables/track'))
const FeaturedPodcast = React.lazy(()=> import('../home/featuredPodcast'))
const TipModal = React.lazy(() => import('../tipModal').then(module => ({ default: module.TipModal })));

interface ProfileImageProps {
    currentLabel: string;
    avatar: string;
    address_color: string;
    size?: number;
    borderWidth?: number;
    squared?: boolean;
    linkToArPage?: boolean;
    unclickable?: boolean;
};

interface FollowersProps {
    PASoMProfile: PASoMProfile;
    isFollowing: boolean;
};

interface CreatorNamesProps {
    nickname: string;
    currentLabel: string;
    ANSuserExists?: boolean;
};

interface LinkButtonInterface {
    text: string;
    url: string;
};

interface ViewANSButtonProps {
    currentLabel: string;
};

interface CreatorTipModalInterface {
    ANSorAddress: string;
    recipientAddress: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

interface LatestEpisodesProps {
    episodes: FullEpisodeInfo[];
};

interface FeaturedPodcastProps {
    podcasts: Podcast[];
};
  
  
export const flexCol = `flex flex-col `;
export const WhiteLargeFont = `text-3xl font-bold text-white `;
export const CreatorVerificationParentStyling = `ml-2 md:ml-3 mt-1`;
export const podcastCarouselStyling = `w-full mt-8 carousel gap-x-12 py-3 `;
export const creatorLabelStyling = `select-text text-lg font-medium text-[#828282] `;
export const creatorLabelSmallStyling = `select-text text-sm font-medium text-[#828282] `;
export const creatorNicknameSmallStyling = `select-text font-medium tracking-wide text-white `;
export const creatorNicknameStyling = `select-text text-3xl font-medium tracking-wide text-white `;

export const resolveArDomainToArpage = (currentLabel: string) => `https://${currentLabel}.ar.page`;

export const Followers: FC<FollowersProps> = ({ PASoMProfile, isFollowing }) => {
    const { t } = useTranslation();
  
    const followers = PASoMProfile?.followers ? PASoMProfile?.followers?.length + (isFollowing ? 0 : -1) : 0;
    const following = PASoMProfile?.followings ? PASoMProfile?.followings?.length : 0;
  
    return (
      <div className="flex gap-x-8 text-white select-text">
        <div className="">{t("creator.followers")} {followers < 0 ? 0: followers}</div>
        <div className="">{t("creator.following")} {following}</div>
      </div>
    );
};

// 4. Reusable Components
export const ProfileImage: FC<ProfileImageProps> = ({ currentLabel, avatar, address_color, size, borderWidth, squared, linkToArPage, unclickable }) => {
    const borderColor = (!avatar && address_color) ? (isTooLight(hexToRGB(address_color), 0.6) ? "rgb(169, 169, 169)" : "rgb(255, 255, 255)"): address_color;
    const hex = address_color && isTooLight(hexToRGB(address_color), 0.6) ? "#A9A9A9" : "#ffffff";
    const imageSize = size || 120;
    const squaredOuterBorderRadius = squared ? '12px' : '999px';
    const squaredInnerBorderRadius = squared ? '8px' : '999px';
  
    return (
      <Link
        href={!unclickable ? (linkToArPage ? resolveArDomainToArpage(currentLabel) : `/creator/${currentLabel}`): ''}
        style={{ borderColor: borderColor, borderWidth: borderWidth || '4px', borderRadius: squaredOuterBorderRadius }}
        tabIndex={unclickable ? -1 : 0}
        className="default-no-outline-ringed default-animation"
      >
        {avatar && <Image width={imageSize} height={imageSize} alt={avatar} src={ARSEED_URL + avatar} className="object-fit aspect-square rounded-full" />}
        {!avatar && (
          <div style={{
            width: imageSize,
            height: imageSize,
            borderRadius: squaredInnerBorderRadius,
            background: `linear-gradient(225deg, ${hex} 10%, ${address_color} 30%)`,
          }}></div>
        )}
      </Link>
    );
  };

export const CreatorNamesSmall: FC<CreatorNamesProps> = ({ nickname, currentLabel }) => (
    <div className={flexCol}>
        <div className={creatorNicknameSmallStyling}>{nickname}</div>
        <div className={creatorLabelSmallStyling}>@{currentLabel}</div>
    </div>
);

export const CreatorNames: FC<CreatorNamesProps> = ({ nickname, currentLabel, ANSuserExists }) => (
    <div className={flexCol}>
      <div className={`flex items-center `}>
        <div className={creatorNicknameStyling}>{shortenAddress(nickname)}</div>
        {ANSuserExists && <div className={CreatorVerificationParentStyling}>
          <Verification {...{size: 10, ANSuserExists}} />
        </div>}
      </div>
      {currentLabel && (<div className={creatorLabelStyling}>@{currentLabel}</div>)}
    </div>
);

export const LinkButton: FC<LinkButtonInterface> = ({ url, text }) => {
    const [currentThemeColor, ] = useRecoilState(currentThemeColorAtom);
  
    return (
      <a
        className={hoverableLinkButtonStyling}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: dimColorString(currentThemeColor, 0.1),
          color: currentThemeColor,
        }}
      >
        {text}
      </a>
    );
  };
  
export const ViewANSButton: FC<ViewANSButtonProps> = ({ currentLabel }) => {
    const { t } = useTranslation();
    return <LinkButton url={`https://${currentLabel}.ar.page`} text={t('creator.ans')} />
};

export const CreatorTipModal: FC<CreatorTipModalInterface> = ({ ANSorAddress, recipientAddress, isOpen, setIsOpen }) => {
    if (isOpen) {
      return (
        <>
          <TipModal
            to={ANSorAddress}
            toAddress={recipientAddress} 
            isVisible={isOpen}
            setVisible={setIsOpen}
          />
        </>
      );
    } else {
      return <></>
    };
};

export const LatestEpisodes: FC<LatestEpisodesProps> = ({ episodes }) => {
    const { t } = useTranslation();
  
    return (
      <div className="mt-12">
        <div className={WhiteLargeFont}>{episodes.length !== 0 && t("creator.latestepisodes")}</div>
        <div className="mt-6">
          {episodes.map((episode: FullEpisodeInfo, index: number) => (
            <div className="mb-4" key={index}>
              <Track {...{ episode }} includeDescription includePlayButton />
            </div>
          ))}
        </div>
      </div>
    );
};

export const FeaturedPodcasts: FC<FeaturedPodcastProps> = ({ podcasts }) => {

    const { t } = useTranslation();
  
    return (
      <div className="mt-8">
        <div className={WhiteLargeFont + " mb-8"}>{t("creator.podcasts")}</div>
        <div>
          {podcasts.length !== 0 ? (
            <div className={podcastCarouselStyling}>
              {podcasts.map((podcast: Podcast, index: number) =>
                <FeaturedPodcast {...podcast} key={index} />
              )}
            </div>
          ) : <>{t("creator.nopodcasts")}</>}
        </div>
      </div>
    );
  };