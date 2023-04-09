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
import { ArConnectButtonStyling } from '../arconnect';
import ThemedButton from '../reusables/themedButton';
import { UploadImageContainer } from '../reusables/croppingTools';
import { ConnectButton, episodeDescStyling, episodeNameStyling, UploadButton } from "../uploadEpisode/uploadEpisodeTools";
import { LanguageOptions, CategoryOptions, categories_en, DEFAULT_LANGUAGE } from "../../utils/languages";
import { AR_DECIMALS, CONNECT_WALLET, COVER_UPLOAD_ERROR, DESCRIPTION_UPLOAD_ERROR, EVERPAY_AR_TAG, EVERPAY_BALANCE_ERROR, EVERPAY_EOA, MIN_UPLOAD_PAYMENT, PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN, SHOW_UPLOAD_SUCCESS, SPINNER_COLOR, TOAST_DARK } from "../../constants";
import { isValidEmail, ValMsg } from "../reusables/formTools";
import { getBundleArFee, upload2DMedia, upload3DMedia } from "../../utils/arseeding";
import { createFileFromBlobUrl, minifyPodcastCover, createFileFromBlob, getImageSizeInBytes } from "../../utils/fileTools";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { allFieldsFilled, byteSize, checkConnection, handleError, validateLabel } from "../../utils/reusables";
import Everpay, { ChainType } from "everpay";
import toast from 'react-hot-toast';
import { arweaveAddress } from "../../atoms";
import { PermaSpinner } from "../reusables/PermaSpinner";
import { Tooltip } from "@nextui-org/react";
import { MarkDownToolTip } from "../reusables/tooltip";

// 1. Interfaces
interface EditButtonProps {};

interface EditModalProps {
  isVisible: boolean,
  setIsVisible: Dispatch<SetStateAction<boolean>>,
  className: string,
};

interface ProfileImageProps {
  banner: string;
  avatar: string;
  setBanner: Dispatch<SetStateAction<string>>;
  setAvatar: Dispatch<SetStateAction<string>>;
}

interface CreatorEditInfoProps {
  nickname: string;
  bio: string;
  setNickname: Dispatch<SetStateAction<string>>;
  setBio: Dispatch<SetStateAction<string>>;
}

// 2. Stylings
const flexCol = `flex flex-col `;
export const whFull = `w-full h-full `;
export const rFull = `rounded-full `;
export const CreatorUploadPhotoIconStyling = `h-8 w-8 text-inherit `;
export const TransparentHidden = `absolute opacity-0 pointer-events-none `;
export const InputFocusStyling = `focus:opacity-0 focus:z-20 `;
export const CreatorModalHeaderStyling = flexCol + `gap-y-6 px-6 pt-4 `;
export const CreatorModalFooterStyling = flexCenter + `w-full justify-between `;
export const CreatorEditBannerInputStyling = TransparentHidden + InputFocusStyling + `top-12 left-40`;
export const CreatorEditAvatarInputStyling = TransparentHidden + InputFocusStyling + `top-28 left-5 w-24 `;
export const CreatorEditBannerLabelStyling = flexCol + `w-full h-32 bg-zinc-800 inset-0 border-dotted border-zinc-600 hover:border-white text-zinc-400 hover:text-white rounded-xl border-2 items-center justify-center default-no-outline-ringed inset default-animation focus:ring-white cursor-pointer `;
export const CreatorEditAvatarLabelStyling = flexCol + rFull + `-mt-16 items-center justify-center mx-3 shrink-0 w-28 h-28 bg-zinc-900 text-zinc-400 focus:text-white hover:text-white default-animation absolute border-2 border-zinc-800 hover:border-white focus:border-white default-no-outline-ringed cursor-pointer `;
export const CreatorEditAvatarPreviewImageStyling = whFull + rFull + `max-h-[100px] max-w-[100px] `;
export const CreatorEditAvatarPreviewBannerStyling = whFull + `rounded-xl `;

// 3. Functions

// 4. Components

export const ProfileInfo: FC<CreatorEditInfoProps> = ({ nickname, setNickname, bio, setBio  }) => {
  const { t } = useTranslation();

  return (
    <div className={flexCenterGap}>
      <div className={flexCol + `grow mt-2 `}>
        <input
          value={nickname}
          className={`text-input-generic px-4 `}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={t('creator.edit-modal.nickname')}
        />
        <textarea 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={`text-input-generic resize-none px-4 h-20 mt-4 pt-2 mr-0.5 `}
          placeholder={t('creator.edit-modal.bio')}
        ></textarea>
      </div>
    </div>
  )
};

const ProfileImages: FC<ProfileImageProps> = ({ banner, avatar, setBanner, setAvatar }) => (
  <div className="mb-12">
    <UploadImageContainer
      fileName="banner"
      cropAspect={3/1}
      setImage={setBanner}
      inputClassName={CreatorEditBannerInputStyling}
      labelClassName={CreatorEditBannerLabelStyling}
      previewImage={<img alt="banner" src={banner} className={CreatorEditAvatarPreviewBannerStyling} />}
      placeholder={<CameraIcon className={CreatorUploadPhotoIconStyling} />}
    />
    <UploadImageContainer
      fileName="avatar"
      cropAspect={1}
      setImage={setAvatar}
      inputClassName={CreatorEditAvatarInputStyling}
      labelClassName={CreatorEditAvatarLabelStyling}
      previewImage={<img alt="avatar" src={avatar} className={CreatorEditAvatarPreviewImageStyling} />}
      placeholder={<CameraIcon className={CreatorUploadPhotoIconStyling} />}
    />
  </div>
);

export const EditModalHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={`text-2xl text-zinc-200 self-center`}>
      {t("creator.edit-modal.header")}
    </div>
  );
};


export const EditModal: FC<EditModalProps> = ({ isVisible, setIsVisible, className }) => {

  const { t } = useTranslation();

  const [nickname, setNickname] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [banner, setBanner] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const { address, getPublicKey, createSignature } = useArconnect();

  const validate = () => true;

  const uploadBanner = async () => '0x';

  const uploadAvatar = async () => '0x';

  const uploadEdits = async () => {
    console.log('uploading edits');
    console.log(nickname, bio, banner, avatar)
    if (!validate()) return;
    const bannerTX = await uploadBanner();
    const avatarTX = await uploadAvatar();

    // Package EXM Call
    const data = new TextEncoder().encode(PASOM_SIG_MESSAGES[0]);
    const sig = String(await createSignature(data, defaultSignatureParams, "base64"));
    const jwk_n = await getPublicKey();

    const payloadObj: updateWalletMetadata = {
      function: "updateWalletMetadata",
      nickname,
      bio,
      banner: bannerTX,
      avatar: avatarTX,
      sig,
      jwk_n,
    };
    console.log(payloadObj)
    // const res = await axios.post('/api/exm/PASoM/write', payloadObj);
    // console.log(res.data);
  };

  return (
    <Modal {...{isVisible, setIsVisible, className}}>
      <div className={CreatorModalHeaderStyling}>
        <EditModalHeader />
        <ProfileImages {...{ banner, avatar, setBanner, setAvatar }} />
        <ProfileInfo {...{ nickname, setNickname, bio, setBio }} />
        <div className={CreatorModalFooterStyling}>
          <div className={flexCenter + `bg-zinc-700 text-white rounded-xl w-48 h-12 pl-3`}>
            {t("home.featured-modal.cost")} {0.004} AR
          </div>
          <button onClick={uploadEdits} className={ArConnectButtonStyling + `w-24 `}>
            {t("creator.edit")}
          </button>
        </div>
      </div>
    </Modal>
  )
};

export const EditButton: FC<EditButtonProps> = ({ }) => {

  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const className = flexCol + `bg-zinc-800 rounded-3xl z-10 mb-0 w-[300px] sm:w-[500px] lg:w-[500px] h-[518px] `;

  const EditText: FC = () => (
    <div className={flexCenterGap}>
      {t('creator.edit')}
      <PencilIcon className='text-inherit w-4 h-4' />
    </div>
  );

  return (
    <>
      <ThemedButton onClick={() => setIsVisible(true)}>
        <EditText />
      </ThemedButton>
      {isVisible && <EditModal {...{ isVisible, setIsVisible, className }} />}
    </>
  );
};


