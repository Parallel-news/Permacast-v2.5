import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { shortenAddress, useArconnect } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { FullEpisodeInfo, Podcast } from '../../interfaces';
import { dimColorString, hexToRGB, isTooLight, stringToHexColor } from '../../utils/ui';
import { currentThemeColorAtom, userBannerImageAtom } from '../../atoms';
import FeaturedPodcast from '../home/featuredPodcast';
import Track from '../reusables/track';
import TipButton from '../reusables/tip';
import { flexCenter } from './featuredCreators';
import Verification from '../reusables/Verification';
import { TipModal } from '../tipModal';
import { ARSEED_URL } from '../../constants';
import { PASoMProfile, updateWalletMetadata } from '../../interfaces/pasom';
import { hoverableLinkButton } from '../reusables/themedButton';
import { EditButton } from './edit';


/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */

// 1. Interfaces

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

interface CreatorNamesProps {
  nickname: string;
  currentLabel: string;
};

interface ViewANSButtonProps {
  currentLabel: string;
};

interface FeaturedPodcastProps {
  podcasts: Podcast[];
};

interface LatestEpisodesProps {
  episodes: FullEpisodeInfo[];
};

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

interface LinkButtonInterface {
  text: string;
  url: string;
};

interface CreatorTipModalInterface {
  ANSorAddress: string;
  recipientAddress: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

interface FollowButtonProps {
  user: string;  
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
export const CreatorVerificationParentStyling = `mb-2 md:mb-0 md:ml-6 `;
export const CreatorBioStyling = `h-8 select-text `;
export const TransparentHidden = `absolute opacity-0 pointer-events-none `;
export const InputFocusStyling = `focus:opacity-0 focus:z-20 `;
export const CreatorEditBannerInputStyling = TransparentHidden + InputFocusStyling + `top-12 left-40`;
export const CreatorEditAvatarInputStyling = TransparentHidden + InputFocusStyling + `top-28 left-5 w-24 `;
export const CreatorEditBannerStyling = flexCol + `w-full h-32 bg-zinc-800 inset-0 border-dotted border-zinc-600 hover:border-white text-zinc-400 hover:text-white rounded-xl border-2 items-center justify-center default-no-outline-ringed inset default-animation focus:ring-white cursor-pointer `;
export const CreatorEditAvatarStyling = flexCol + `items-center justify-center mb-2 mx-3 shrink-0 w-28 h-28 rounded-full bg-zinc-900 text-zinc-400 focus:text-white hover:text-white default-animation absolute -bottom-16 left-0 border-2 border-zinc-900 hover:border-white focus:border-white default-no-outline-ringed cursor-pointer `;

// 3. Custom Functions

export const resolveArDomainToArpage = (currentLabel: string) => `https://${currentLabel}.ar.page`;


export const sortByDate = (episodes: FullEpisodeInfo[], descending = false): FullEpisodeInfo[] => {
  return episodes.sort((a, b) => {
    if (descending) {
      return b.episode.uploadedAt - a.episode.uploadedAt;
    } else {
      return a.episode.uploadedAt - b.episode.uploadedAt;
    };
  });
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

export const CreatorNames: FC<CreatorNamesProps> = ({ nickname, currentLabel }) => (
  <div className={flexCol}>
    <div className={creatorNicknameStyling}>{shortenAddress(nickname)}</div>
    {currentLabel && (<div className={creatorLabelStyling}>@{currentLabel}</div>)}
  </div>
);

export const LinkButton: FC<LinkButtonInterface> = ({ url, text }) => {
  const [currentThemeColor, setCurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  return (
    <a
      className={hoverableLinkButton}
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

export const FollowButton: FC<FollowButtonProps> = ({ user }) => {
  return (<></>)
};

export const CreatorPageComponent: FC<{ creator: CreatorPageComponentProps }> = ({ creator }) => {

  const { ANSuserExists, currentLabel, address_color, user, PASoMProfile, podcasts, episodes } = creator;
  const nickname = PASoMProfile?.nickname || creator.nickname;
  const avatar = PASoMProfile?.avatar || creator.avatar || '';
  const banner = PASoMProfile?.banner || '';
  const bio = PASoMProfile?.bio || '';
  
  const { address } = useArconnect();
  const [userBannerImage, setUserBannerImage] = useRecoilState(userBannerImageAtom);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {setUserBannerImage(banner)}, [banner]);

  const openModalCallback = () => setIsOpen(prev => !prev);
  const tipModalArgs = { ANSorAddress: ANSuserExists ? currentLabel : user, recipientAddress: user, isOpen, setIsOpen };

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
            <div className={CreatorBioStyling}>{bio}</div>
          </div>
          <div className={CreatorVerificationParentStyling}>
            <Verification {...{ANSuserExists}} includeText />
          </div>
        </div>
        <div className={flexItemsCenter + `mr-3 `}>
          {ANSuserExists && <ViewANSButton {...{ currentLabel }} />}
          {address !== user && <TipButton {...{ openModalCallback }} />}
          {address !== user && <FollowButton {...{user}} />}
          {address === user && <EditButton />}
        </div>
      </div>
      <FeaturedPodcasts {...{ podcasts }} />
      <LatestEpisodes {...{ episodes }} />
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
