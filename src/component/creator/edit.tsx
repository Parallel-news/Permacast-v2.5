import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { CameraIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@nextui-org/react';
import toast from 'react-hot-toast';

import { flexCenter, flexCenterGap } from './featuredCreators';
import { Modal } from '../reusables';
import { ARSEED_URL, ERROR_TOAST_TIME, EXTENDED_TOAST_TIME, GIGABYTE, PASOM_SIG_MESSAGES, PERMA_TOAST_SETTINGS, } from '../../constants';
import { PASoMProfile, updateWalletMetadata } from '../../interfaces/pasom';
import { ArConnectButtonStyling } from '../wallets/arconnect';
import ThemedButton from '../reusables/themedButton';
import { UploadImageContainer } from '../reusables/croppingTools';
import {  TOAST_DARK } from "../../constants";
import { getBundleArFee, upload3DMedia } from "../../utils/arseeding";
import { createFileFromBlobUrl, } from "../../utils/fileTools";
import validatePASoMForm, { PASOM_BIO_MAX_LEN, PASOM_BIO_MIN_LEN, PASOM_NICKNAME_MAX_LEN, PASOM_NICKNAME_MIN_LEN } from '../../utils/validation/PASoM';

// 1. Interfaces
interface EditButtonProps {
  PASoMProfile: PASoMProfile,
};

interface EditModalProps {
  isVisible: boolean,
  setIsVisible: Dispatch<SetStateAction<boolean>>,
  className: string,
  PASoMProfile: PASoMProfile,
};

interface ProfileImageProps {
  banner: string;
  avatar: string;
  setBanner: Dispatch<SetStateAction<string>>;
  setAvatar: Dispatch<SetStateAction<string>>;
}

interface CreatorEditInfoProps {
  error: string | false,
  nickname: string;
  bio: string;
  setNickname: Dispatch<SetStateAction<string>>;
  setBio: Dispatch<SetStateAction<string>>;
}

// 2. Stylings
const flexCol = `flex flex-col `;
export const whFull = `w-full h-full `;
export const CreatorUploadPhotoIconStyling = `h-8 w-8 text-inherit `;
export const TransparentHidden = `absolute opacity-0 pointer-events-none `;
export const InputFocusStyling = `focus:opacity-0 focus:z-20 `;
export const CreatorModalHeaderStyling = flexCol + `gap-y-6 px-6 pt-4 `;
export const CreatorModalFooterStyling = `flex items-center ` + `w-full justify-between `;
export const CreatorEditBannerInputStyling = TransparentHidden + InputFocusStyling + `top-12 left-40`;
export const CreatorEditAvatarInputStyling = TransparentHidden + InputFocusStyling + `top-28 left-5 w-24 `;
export const CreatorEditBannerLabelStyling = flexCol + `w-full h-32 bg-zinc-800 inset-0 border-dotted border-zinc-600 hover:border-white text-zinc-400 hover:text-white rounded-xl border-2 items-center justify-center default-no-outline-ringed inset default-animation focus:ring-white cursor-pointer `;
export const CreatorEditAvatarLabelStyling = flexCol + ` rounded-full `  + `-mt-16 items-center justify-center mx-3 shrink-0 w-28 h-28 bg-zinc-900 text-zinc-400 focus:text-white hover:text-white default-animation absolute border-2 border-zinc-800 hover:border-white focus:border-white default-no-outline-ringed cursor-pointer `;
export const CreatorEditAvatarPreviewImageStyling = whFull + `rounded-full ` + `max-h-[100px] max-w-[100px] `;
export const CreatorEditAvatarPreviewBannerStyling = whFull + `rounded-xl `;

// 3. Functions

// 4. Components

export const ProfileInfo: FC<CreatorEditInfoProps> = ({ error, nickname, setNickname, bio, setBio }) => {
  const { t } = useTranslation();

  const NicknameError = () => (
    <>
      {t("creator.edit-modal.error.nickname", {minLength: PASOM_NICKNAME_MIN_LEN, maxLength: PASOM_NICKNAME_MAX_LEN})}
    </>
  );

  const BioError = () => (
    <>
      {t("creator.edit-modal.error.bio", {minLength: PASOM_BIO_MIN_LEN, maxLength: PASOM_BIO_MAX_LEN})}
    </>
  );

  return (
    <div className={flexCenterGap}>
      <div className={flexCol + `grow mt-2 `}>
        <div className="relative">
          <input
            value={nickname}
            className={`text-input-generic px-4 `}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t('creator.edit-modal.nickname')}
          />
          <Tooltip className={`absolute top-3 right-2 default-animation ` + (error === "nickname" ? "opacity-100": "opacity-0 pointer-events-none")} rounded color="invert" content={<NicknameError />}>
            <div className="error-tooltip">?</div>
          </Tooltip>
        </div>
        <div className="relative">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`text-input-generic resize-none pl-4 pr-7 h-20 mt-4 pt-2 mr-0.5 `}
            placeholder={t('creator.edit-modal.bio')}
          ></textarea>
          <Tooltip className={`absolute bottom-3 right-2 ` + (error === "bio" ? "opacity-100": "opacity-0 pointer-events-none")} rounded color="invert" content={<BioError />}>
            <div className="error-tooltip">?</div>
          </Tooltip>
        </div>
      </div>
    </div>
  )
};

const ProfileImages: FC<ProfileImageProps> = ({ banner, avatar, setBanner, setAvatar }) => (
  <div className="mb-12">
    <UploadImageContainer
      initialImage={banner}
      fileName="banner"
      cropAspect={3/1}
      setImage={setBanner}
      inputClassName={CreatorEditBannerInputStyling}
      labelClassName={CreatorEditBannerLabelStyling}
      previewImage={<img alt="banner" src={banner} className={CreatorEditAvatarPreviewBannerStyling} />}
      placeholder={<CameraIcon className={CreatorUploadPhotoIconStyling} />}
    />
    <UploadImageContainer
      initialImage={avatar}
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


export const EditModal: FC<EditModalProps> = ({ isVisible, setIsVisible, className, PASoMProfile }) => {

  const { t } = useTranslation();
  const { address, getPublicKey, createSignature } = useArconnect();
  const [nickname, setNickname] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [error, setError] = useState<string | false>("");
  const [sameInfo, setSameInfo] = useState<boolean>(false);

  const [arseedGigabyteCost, setArseedGigabyteCost] = useState<number>(0);
  const [avatarSize, setAvatarSize] = useState<number>(0);
  const [bannerSize, setBannerSize] = useState<number>(0);
  const [totalImageCost, setTotalImageCost] = useState<number>(0);

  useEffect(() => {getBundleArFee(String(GIGABYTE)).then(setArseedGigabyteCost)}, []);
  useEffect(() => {calculateImagesUploadCost().then(setTotalImageCost)}, [avatarSize, bannerSize]);
  useEffect(() => {
    if (PASoMProfile) {
      setNickname(PASoMProfile?.nickname || "");
      setBio(PASoMProfile?.bio || "");
      setBanner(PASoMProfile.banner ? ARSEED_URL + PASoMProfile.banner: "");
      setAvatar(PASoMProfile.avatar ? ARSEED_URL + PASoMProfile.avatar: "");
    }
  }, [PASoMProfile]);

  useEffect(() => {
    const error = validatePASoMForm({nickname, bio});
    setError(error);
    if (PASoMProfile?.nickname === nickname && PASoMProfile?.bio === bio && PASoMProfile?.banner === banner && PASoMProfile?.avatar === avatar) {
      setSameInfo(true);
    } else setSameInfo(false)
  }, [bio, nickname]);

  const calculateImagesUploadCost = async () => {
    const bannerCost = 0.01 // Number(arseedGigabyteCost) * (bannerSize / GIGABYTE);
    const avatarCost = 0.01 //Number(arseedGigabyteCost) * (avatarSize / GIGABYTE);
    return Number(bannerCost) + Number(avatarCost);
  };

  // TODO: add validation
  const validate = () => {
    const error = validatePASoMForm({address, nickname, bio, banner, avatar});
    if (error) {
      toast.error(error, PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME));
      return false;
    }
  };

  const uploadImage = async (fileURL: string, name: string, setSize: Dispatch<SetStateAction<number>>) => {
    const toastUploadImage = toast.loading(`${t("loadingToast.uploading")} ${name}`, PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
    let finalTX;
    try {
      const file = await createFileFromBlobUrl(fileURL, name);
      setSize(file.size);
      const arseedTX = await upload3DMedia(file, file.type);
      finalTX = arseedTX?.order?.itemId;
      toast.dismiss(toastUploadImage);
    } catch (e) {
      finalTX = null;
      toast.dismiss(toastUploadImage);
    };
    return finalTX 
  };

  const uploadBanner = async () => await uploadImage(banner, "banner", setBannerSize);
  const uploadAvatar = async () => await uploadImage(avatar, "avatar", setAvatarSize);

  const uploadEdits = async () => {
    const toastBanner = toast.loading(t("loadingToast.savingBanner"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));

    console.log('uploading edits');
    // if (!validate()) return;

    let bannerTX;
    if (!banner.includes(ARSEED_URL)) {
      bannerTX = await uploadBanner()
    } else {
      bannerTX = banner.split(ARSEED_URL)[1];
    };

    let avatarTX;
    if (!avatar.includes(ARSEED_URL)) {
      avatarTX = await uploadAvatar()
    } else {
      avatarTX = avatar.split(ARSEED_URL)[1];
    };
    console.log(nickname, bio, bannerTX, avatarTX);

    // Package EXM Call
    const data = new TextEncoder().encode(PASOM_SIG_MESSAGES[0]);
    const sig = String(await createSignature(data, defaultSignatureParams, "base64"));
    const jwk_n = await getPublicKey();

    console.log('uploading')
    const payloadObj: updateWalletMetadata = {
      function: "updateWalletMetadata",
      nickname,
      bio,
      banner: bannerTX,
      avatar: avatarTX,
      sig,
      jwk_n,
    };
    console.log(payloadObj);
    const res = await axios.post('/api/exm/PASoM/write', payloadObj);
    console.log(res.data);
    // TODO pass updated profile to parent component
    setIsVisible(false);
    toast.dismiss(toastBanner);
  };

  return (
    <Modal {...{isVisible, setIsVisible, className}}>
      <div className={CreatorModalHeaderStyling}>
        <EditModalHeader />
        <ProfileImages {...{ banner, avatar, setBanner, setAvatar }} />
        <ProfileInfo {...{ error, nickname, setNickname, bio, setBio }} />
        <div className={CreatorModalFooterStyling}>
          {totalImageCost > 0 && (
            <div className={`flex items-center ` + `bg-zinc-700 text-white rounded-xl w-48 h-12 pl-3`}>
              {t("home.featured-modal.cost")} {totalImageCost} AR
            </div>
          )}
          <button disabled={!!error || sameInfo} onClick={uploadEdits} className={ArConnectButtonStyling + `w-36 `}>
            {t("creator.edit-modal.save-changes")}
          </button>
        </div>
      </div>
    </Modal>
  )
};

export const EditButton: FC<EditButtonProps> = ({ PASoMProfile }) => {

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
      {isVisible && <EditModal {...{ isVisible, setIsVisible, className, PASoMProfile }} />}
    </>
  );
};


