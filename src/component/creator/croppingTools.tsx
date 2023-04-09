import { FC, MouseEventHandler, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ConnectButton, episodeDescStyling, episodeNameStyling, UploadButton } from "../uploadEpisode/uploadEpisodeTools";
import { LanguageOptions, CategoryOptions, categories_en, DEFAULT_LANGUAGE } from "../../utils/languages";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../../utils/croppedImage";
import { AR_DECIMALS, CONNECT_WALLET, COVER_UPLOAD_ERROR, DESCRIPTION_UPLOAD_ERROR, EVERPAY_AR_TAG, EVERPAY_BALANCE_ERROR, EVERPAY_EOA, MIN_UPLOAD_PAYMENT, PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN, SHOW_UPLOAD_SUCCESS, SPINNER_COLOR, TOAST_DARK, USER_SIG_MESSAGES } from "../../constants";
import { isValidEmail, ValMsg } from "../reusables/formTools";
import { getBundleArFee, upload2DMedia, upload3DMedia } from "../../utils/arseeding";
import { createFileFromBlobUrl, minifyPodcastCover, createFileFromBlob, getImageSizeInBytes } from "../../utils/fileTools";
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { allFieldsFilled, byteSize, checkConnection, handleError, validateLabel } from "../../utils/reusables";
import Everpay, { ChainType } from "everpay";
import toast from 'react-hot-toast';
import { useRecoilState } from "recoil";
import { arweaveAddress } from "../../atoms";
import { PermaSpinner } from "../reusables/PermaSpinner";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { Tooltip } from "@nextui-org/react";
import { Podcast } from "../../interfaces";
import { MarkDownToolTip } from "../reusables/tooltip";
import { cropScreenDivStyling, cropScreenStyling, cropSelectionDivStyling, cropSelectionTextStyling } from "../uploadShow/uploadShowTools";


// 1. Interfaces
interface PreviewImageInterface {
  url: string;
  imgCoverStyling: string;
}

interface CropScreenInterface {
  inputImg: string;
  rotation: number;
  cropAspect: number;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onClickResp: MouseEventHandler<HTMLDivElement>;
  setRotation: (rotation: number) => void;
};

interface UploadImageContainerInterface {
  fileName: string; // for the label
  cropAspect: number;
  previewImage: ReactNode;
  placeholder: ReactNode;
  inputClassName?: string;
  labelClassName?: string;
  setImage: (v: any) => void
};

// 2. Stylings
const photoIconStyling = `h-11 w-11 text-zinc-400 `;
const emptyCoverIconTextStyling = `text-lg tracking-wider pt-2 text-zinc-400 `;
const hidden = `opacity-0 z-index-[-1] absolute pointer-events-none `;
const imgStyling = `h-48 w-48 text-slate-400 rounded-[20px] `;
const emptyCoverIconStyling = `input input-secondary flex flex-col items-center justify-center cursor-pointer bg-zinc-800 h-48 w-48 rounded-[20px] outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-zinc-600 `;
const imgCoverStyling = `flex items-center justify-center bg-slate-400 h-48 w-48 rounded-[20px] `;

// 3. Functions

// 4. Components

export const CropScreen: FC<CropScreenInterface> = ({ inputImg, rotation, cropAspect, setRotation, onCropComplete, onClickResp }) => {
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  return (
    <div className={cropScreenStyling}>
      <div className={cropScreenDivStyling}>
        <Cropper
          image={inputImg}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={cropAspect}
          onCropChange={(setCrop)}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div
        className={cropSelectionDivStyling}
        onClick={onClickResp}
      >
        <p className={cropSelectionTextStyling}>
          Crop
        </p>
      </div>
    </div>
  );
};


export const UploadImageContainer: FC<UploadImageContainerInterface> = ({ fileName, previewImage, placeholder, cropAspect, inputClassName, labelClassName, setImage }) => {

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [img, setImg] = useState<string>("");
  const [inputImg, setInputImg] = useState<string>("");
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<boolean>(null);
  const [rotation, setRotation] = useState<number>(0);

  const handleChangeImage = async (e: any) => {
    isImageSquared(e);
  };

  const isImageSquared = (event) => {
    if (event.target.files.length !== 0) {
      const imageToUpload = new Image();
      const fileURL = window.URL.createObjectURL(event.target.files[0]);
      imageToUpload.src = fileURL;
      imageToUpload.onload = () => {
        console.log(imageToUpload.width, imageToUpload.height, fileURL)
        if (imageToUpload.width !== imageToUpload.height) {
          setInputImg(fileURL);
          setShowCrop(true);
        } else {
          setImg(fileURL);
          setImage(fileURL)
        };
      };
    };
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        inputImg,
        croppedAreaPixels,
        rotation
      );


      setImg(croppedImage);
      setImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const finalizeCropResp = () => {
    showCroppedImage();
    setShowCrop(false);
  };

  return (
    <>
      {showCrop && (
        <CropScreen
          inputImg={inputImg}
          cropAspect={cropAspect}
          onCropComplete={onCropComplete}
          onClickResp={() => finalizeCropResp()}
          rotation={rotation}
          setRotation={setRotation}
        />
      )}
      <input
        type="file"
        accept="image/*"
        className={inputClassName || hidden}
        ref={imageRef}
        onChange={(e) => handleChangeImage(e)}
        name={fileName}
        id={fileName}
      />
      <label
        className={labelClassName || hidden}
        htmlFor={fileName}
      >
        {/*Show Selected Image or Empty Cover*/}
        {imageRef?.current?.files?.[0] ? previewImage : placeholder}
      </label>
    </>
  );
};

export const DefaultPlaceholderImage: FC = ({ }) => {
  const { t } = useTranslation();
  return (
    <div className={emptyCoverIconStyling}>
      {/*Image Logo*/}
      <PhotoIcon className={photoIconStyling} />
      {/*Cover Image Text*/}
      <div className={emptyCoverIconTextStyling}>
        {t("uploadshow.image")}
      </div>
    </div>
  );
};

export const DefaultPreviewImage: FC<PreviewImageInterface> = ({ url }) => {
  return (
    <div className={imgCoverStyling}>
      <img alt="img" src={url} className={imgStyling} />
    </div>
  );
};