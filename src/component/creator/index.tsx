import axios from 'axios';
import Image from 'next/image';
import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { FullEpisodeInfo, Podcast } from '../../interfaces';
import { dimColorString, hexToRGB, isTooDark, isTooLight, stringToHexColor } from '../../utils/ui';
import { currentThemeColorAtom } from '../../atoms';
import { useRecoilState } from 'recoil';
import FeaturedPodcast from '../home/featuredPodcast';
import Track from '../reusables/track';
import Link from 'next/link';
import TipButton from '../reusables/tip';
import { flexCenter, flexCenterGap } from './featuredCreators';
import Verification from '../reusables/Verification';
import { TipModal } from '../tipModal';
import { defaultSignatureParams, shortenAddress, useArconnect } from 'react-arconnect';
import Modal from '../modal';
import { CameraIcon, PencilIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { PASOM_SIG_MESSAGES, USER_SIG_MESSAGES } from '../../constants';
import { PASoMProfile, updateWalletMetadata } from '../../interfaces/pasom';
import { UploadButton } from '../uploadEpisode/uploadEpisodeTools';


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
  ANSuserExists?: boolean;
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

interface ThemedButtonInterface {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
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
export const flexItemsCenter = `flex flex-col md:flex-row items-center `; 
export const CreatorPageStyling = `mt-12 h-full pb-40 `;
export const hoverableLinkButton = `px-3 py-2 rounded-full text-sm ml-5 cursor-pointer hover:brightness-[3] default-animation outline-inherit `;

export const creatorUploadPhotoIconStyling = `h-8 w-8 text-inherit `;


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
      {avatar && <Image width={imageSize} height={imageSize} alt={avatar} src={avatar} className="object-fit aspect-square rounded-full" />}
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

export const ThemedButton: FC<ThemedButtonInterface> = ({ children, onClick, disabled, className }) => {
  const [currentThemeColor] = useRecoilState(currentThemeColorAtom);
  
  return (
    <button
      {...{disabled, onClick, className}}
      className={hoverableLinkButton}
      style={{
        backgroundColor: dimColorString(currentThemeColor, 0.1),
        color: currentThemeColor,
      }}
    >
      {children}
    </button>
  );
};

export const ViewANSButton: FC<ViewANSButtonProps> = ({ currentLabel, ANSuserExists }) => {
  const { t } = useTranslation();

  if (!ANSuserExists) return (<></>)

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

interface EditButtonProps {};

export const EditButton: FC<EditButtonProps> = ({ }) => {

  const { t } = useTranslation();
  const { address, getPublicKey, createSignature } = useArconnect();

  const [nickname, setNickname] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const validate = () => {};

  const uploadImage = () => {};

  const uploadAvatar = () => {};

  const uploadEdits = async () => {

    // Package EXM Call
    const data = new TextEncoder().encode(PASOM_SIG_MESSAGES[0]);
    const sig = String(await createSignature(data, defaultSignatureParams, "base64"));
    const jwk_n = await getPublicKey();

    const payloadObj: updateWalletMetadata = {
      function: "updateWalletMetadata",
      bio,
      nickname,
      sig,
      jwk_n,
    };

    const res = await axios.post('/api/exm/PASoM/write', payloadObj);
    console.log(res.data);
  };

  const className = `bg-zinc-800 rounded-3xl flex flex-col z-10 mb-0 w-[98%] sm:w-[75%] lg:w-[50%] h-[500px] `;

  return (
    <>
      <ThemedButton onClick={() => setIsVisible(true)}>
        <div className={flexCenterGap}>
          {t('creator.edit')}
          <PencilIcon className='text-inherit w-4 h-4' />
        </div>
      </ThemedButton>
      {isVisible &&
        <Modal {...{isVisible, setIsVisible, className}}>
          <div className={flexCol + "gap-y-6 px-6 pt-4"}>
            <div className={`text-2xl text-white self-center`}>
              {t("creator.edit-modal.header")}
            </div>
            <div className="relative mb-12">
              <button className={flexCol + "w-full h-32 bg-zinc-800 inset-0 border-dotted border-zinc-600 rounded-xl border-2 items-center justify-center default-no-outline-ringed inset default-animation"}>
                <CameraIcon className={creatorUploadPhotoIconStyling} />
              </button>
              <button className={flexCol + " items-center justify-center mb-2 mx-3 shrink-0 w-28 h-28 rounded-full bg-zinc-900 text-zinc-400 focus:text-white default-animation absolute -bottom-16 left-0 border-2 border-zinc-900 default-no-outline-ringed"}>
                <CameraIcon className={`h-8 w-8 text-inherit`} />
              </button>
            </div>

            <div className={flexCenterGap}>
              <div className={flexCol + "grow mt-2 "}>
                <input
                  value={nickname}
                  className={`text-input-generic px-4`}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('creator.edit-modal.nickname')}
                />
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`text-input-generic resize-none px-4 h-16 mt-4 pt-2 mr-0.5 `}
                  placeholder={t('creator.edit-modal.bio')}
                ></textarea>

              </div>

            </div>
            <div className="flex w-full justify-center">
              <UploadButton 
                width="w-[50%]"
                disable={false}
                click={uploadEdits}
              />
            </div>
          </div>
        </Modal>
      }
    </>
  );
};


export const FollowButton: FC<FollowButtonProps> = ({ user }) => {
  return (<></>)
}; 

export const CreatorPageComponent: FC<{ creator: CreatorPageComponentProps }> = ({ creator }) => {

  const { ANSuserExists, currentLabel, address_color, user, PASoMProfile, podcasts, episodes } = creator;

  const nickname = PASoMProfile?.nickname || creator.nickname;
  const avatar = '/mizuki.jpg'//PASoMProfile?.avatar || creator.avatar;
  const banner = PASoMProfile?.banner || '';
  const bio = PASoMProfile?.bio || '';

  const { address } = useArconnect();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const tipModalArgs = { ANSorAddress: ANSuserExists ? currentLabel : user, recipientAddress: user, isOpen, setIsOpen };

  return (
    <div className={CreatorPageStyling}>
      <CreatorTipModal {...tipModalArgs} />
      <div className={creatorHeaderStyling}>
        <div className={flexItemsCenter + "gap-x-7 ml-2"}>
          <ProfileImage {...{ currentLabel, avatar, address_color }} linkToArPage={ANSuserExists} />
          <div className={flexCol}>
            <div className={flexCenter}>
              <CreatorNames {...{ nickname, currentLabel, ANSuserExists }} />
            </div>
            <div className="h-8 select-text">{bio}</div>
          </div>
          <div className="ml-6">
            <Verification {...{ANSuserExists}} includeText />
          </div>
        </div>
        <div className={flexItemsCenter + " mr-3"}>
          <ViewANSButton {...{ currentLabel, ANSuserExists }} />
          {address !== user && <TipButton openModalCallback={() => setIsOpen(prev => !prev)} />}
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
