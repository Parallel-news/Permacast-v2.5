import React from "react";
import { MouseEventHandler, useCallback, useRef, useState } from "react";
import getCroppedImg from "../../utils/croppedImage";
import { LabelInput, coverContainerInputStyling, coverContainerLabelStyling, cropScreenDivStyling, cropScreenStyling, cropSelectionDivStyling, cropSelectionTextStyling, emptyCoverIconStyling, emptyCoverIconTextStyling, explicitCheckBoxStyling, explicitLabelStyling, explicitTextStyling, imgCoverStyling, imgStyling, photoIconStyling, selectDropdownRowStyling, selectDropdownStyling } from "./uploadShowTools";
import { useTranslation } from "next-i18next";
import { Area } from "react-easy-crop";
import { Podcast } from "../../interfaces";
import { CategoryOptions, DEFAULT_LANGUAGE, LanguageOptions } from "../../utils/languages";

const Cropper = React.lazy(() => import("react-easy-crop"));
const PhotoIcon = React.lazy(() => import("@heroicons/react/24/outline").then(module => ({ default: module.PhotoIcon })));

interface CoverContainerInter {
    setCover: (v: any) => void
}

interface ImgCoverInter {
    img: any;
}

interface SelectDropdownRowInter {
    setLanguage: (v: any) => void;
    setCategory: (v: any) => void;
    setLabel: (v: any) => void;
    labelValue: string;
    setLabelMsg: (v: any) => void;
    labelMsg: string;
    podcasts: Podcast[];
}

interface ExplicitInputInter {
    setExplicit: (v: any) => void;
    explicit: boolean;
}

interface CropScreenInter {
    inputImg: string;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    onClickResp: MouseEventHandler<HTMLDivElement>;
    rotation: number;
    setRotation: (rotation: number) => void;
}

export const CoverContainer = (props: CoverContainerInter) => {

    const podcastCoverRef = useRef<HTMLInputElement | null>(null);
    const [img, setImg] = useState("");
    const [inputImg, setInputImg] = useState("");
    const [showCrop, setShowCrop] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [rotation, setRotation] = useState(0);

    const handleChangeImage = async (e: any) => {
        isPodcastCoverSquared(e);
    };
    
    const isPodcastCoverSquared = (event) => {
        if (event.target.files.length !== 0) {
          const podcastCoverImage = new Image();
          podcastCoverImage.src = window.URL.createObjectURL(event.target.files[0]);
          podcastCoverImage.onload = () => {
            if (podcastCoverImage.width !== podcastCoverImage.height) {
              setInputImg(URL.createObjectURL(event.target.files[0]));
              setShowCrop(true);
            } else {
              setImg(URL.createObjectURL(event.target.files[0]));
              props.setCover(URL.createObjectURL(event.target.files[0]))
            }
          };
        }
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
          props.setCover(croppedImage)
        } catch (e) {
          console.error(e);
        }
      }, [croppedAreaPixels, rotation]);

    const finalizeCropResp = () => {
        showCroppedImage();
        setShowCrop(false);
        
    }

    return (
        <>
        {showCrop && (
            <CropScreen 
                inputImg={inputImg}
                onCropComplete={onCropComplete}
                onClickResp={() => finalizeCropResp()}
                rotation={rotation}
                setRotation={setRotation}
            />
        )}
        <input
            required
            type="file"
            accept="image/*"
            className={coverContainerInputStyling}
            ref={podcastCoverRef}
            onChange={(e) => handleChangeImage(e)}
            name="podcastCover"
            id="podcastCover"
        />
        <label
            htmlFor="podcastCover"
            className={coverContainerLabelStyling}
        >
            {/*Show Selected Image or Empty Cover*/}
            {podcastCoverRef?.current?.files?.[0] ? <ImgCover img={img} /> : <EmptyCover />}
      </label>
      </>
    )
}

export const EmptyCover = () => {
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
    )
}

export const ImgCover = (props: ImgCoverInter) => {
    return (
        <div className={imgCoverStyling}>
            <img src={props.img} className={imgStyling} />
        </div>
    )
}

export const SelectDropdownRow = (props: SelectDropdownRowInter) => {
    return (
        <div className={`${selectDropdownRowStyling} space-y-3`}>
            {/*Categories*/}
            <div className="sm:hidden flex justify-between">
                <select
                    className={`${selectDropdownStyling} sm:mr-[2%] w-[47%]`}
                    id="podcastCategory"
                    name="category"
                    onChange={(e) => props.setCategory(e.target.selectedIndex)}
                >
                    <CategoryOptions />
                </select>
                {/*Languages*/}
                <select
                    className={`${selectDropdownStyling} sm:mr-[2%] w-[47%]`}
                    id="podcastLanguage"
                    defaultValue={DEFAULT_LANGUAGE}
                    name="language"
                    onChange={(e) => props.setLanguage(e.target.value)}
                >
                    <LanguageOptions />
                </select>
            </div>
            <select
                className={`${selectDropdownStyling} hidden sm:flex mr-[2%]`}
                id="podcastCategory"
                name="category"
                onChange={(e) => props.setCategory(e.target.selectedIndex)}
            >
                <CategoryOptions />
            </select>
            {/*Languages*/}
            <select
                className={`${selectDropdownStyling} hidden sm:flex mr-[2%]`}
                id="podcastLanguage"
                defaultValue={DEFAULT_LANGUAGE}
                name="language"
                onChange={(e) => props.setLanguage(e.target.value)}
            >
                <LanguageOptions />
            </select>
            {/*Label*/}
            <LabelInput 
                setLabel={props.setLabel}
                setLabelMsg={props.setLabelMsg}
                labelMsg={props.labelMsg}
                podcasts={props.podcasts}
                labelValue={props.labelValue}
            />
        </div>
    )
}

export const ExplicitInput = (props: ExplicitInputInter) => {
    const { t } = useTranslation();

    return (
        <label className={explicitLabelStyling}>
            <input
                id="podcastExplicit"
                type="checkbox"
                className={explicitCheckBoxStyling}
                onChange={() => props.setExplicit(!props.explicit)}
            />
            <span className={explicitTextStyling}>
                {t("uploadshow.explicit")}
            </span>
        </label>
    )
}

export const CropScreen = (props: CropScreenInter) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    return (
        <div className={cropScreenStyling}>
            <div className={cropScreenDivStyling}>
                <Cropper
                    image={props.inputImg}
                    crop={crop}
                    rotation={props.rotation}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={(setCrop)}
                    onRotationChange={props.setRotation}
                    onCropComplete={props.onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div
            className={cropSelectionDivStyling}
            onClick={props.onClickResp}
            >
            <p className={cropSelectionTextStyling}>
                Crop Selection
            </p>
            </div>
        </div>
    )
}

