import { useTranslation } from "next-i18next";
import React, { useEffect, MouseEventHandler, useCallback, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import Cropper from "react-easy-crop";

import getCroppedImg from "@/utils/croppedImage";
import { handleValMsg } from "./uploadShowTools";
import { Podcast } from "@/interfaces/index";
import { DEFAULT_LANGUAGE } from "@/utils/languages";

import { Icon } from "@/component/icon";

const ValMsg = React.lazy(() => import("@/component/reusables/formTools").then(module => ({ default: module.ValMsg })))
const CategoryOptions = React.lazy(() => import("@/utils/languages").then(module => ({ default: module.CategoryOptions })))
const LanguageOptions = React.lazy(() => import("@/utils/languages").then(module => ({ default: module.LanguageOptions })))

interface CoverContainerInter {
    setCover: (v: any) => void;
    isEdit: boolean;
    editCover?: string;
}

interface ImgCoverInter {
    img: any;
}

interface SelectDropdownRowInter {
    setLanguage: (v: any) => void;
    languageCode: string;
    setCategory: (v: any) => void;
    categoryIndex: number;
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

interface VisibleInputInter {
    setVisible: (v: any) => void;
    visible: boolean;
}

interface CropScreenInter {
    inputImg: string;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    onClickResp: MouseEventHandler<HTMLDivElement>;
    rotation: number;
    setRotation: (rotation: number) => void;
}

interface LabelInputInter {
    setLabelMsg: (v: any) => void;
    setLabel: (v: any) => void;
    labelValue: string;
    labelMsg: string;
    podcasts: Podcast[];
}

type Area = {
    width: number;
    height: number;
    x: number;
    y: number;
}

const emptyCoverIconTextStyling = "text-lg tracking-wider pt-2 text-zinc-inherit "
export const cropScreenDivStyling = "relative w-[800px] h-[400px] rounded-[6px] overflow-hidden"
const epNameStyling = "w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white default-animation "
const coverContainerInputStyling = "opacity-0 z-index-[-1] absolute pointer-events-none"
export const cropScreenStyling = "absolute top-0 left-0 flexColFullCenter whFull backdrop-blur-md z-50"
export const cropSelectionDivStyling = "flexColFullCenter min-w-[50px] min-h-[10px] rounded-[4px] bg-black/10 hover:bg-black/20 border-[1px] border-solid border-white/10 m-2 p-1 px-2 cursor-pointer "
export const cropSelectionTextStyling = "flexColFullCenter text-white/60"
const emptyCoverIconStyling = "flexColFullCenter cursor-pointer h-48 w-48 outline-none focus:ring-2 focus:ring-inset focus:ring-white rounded-[20px] bg-zinc-800 hover:bg-zinc-700 default-animation hover:text-white text-zinc-400 "
const selectDropdownStyling = "select select-secondary w-[30%] py-2 px-5 text-base font-normal input-styling bg-zinc-800 default-animation "
const selectDropdownRowStyling = "flexCol sm:flex-row w-full justify-between space-y-2 sm:space-y-0"
const coverContainerLabelStyling = "cursor-pointer default-animation flex md:block h-fit w-48"
const imgCoverStyling = "flexFullCenter bg-slate-400 h-48 w-48 rounded-[20px]"
const explicitTextStyling = "label-text cursor-pointer text-zinc-400 font-semibold"
const photoIconStyling = "h-11 w-11 text-inherit "
const explicitLabelStyling = "flexYCenter"
const imgStyling = "h-48 w-48 text-slate-400 rounded-[20px]"
const explicitCheckBoxStyling = "checkbox checkbox-primary mr-2 border-2 border-zinc-600"
const visibleCheckBoxStyling = "checkbox checkbox-primary mr-2 border-2 border-zinc-600 ml-2 mr-0"

export const CoverContainer = (props: CoverContainerInter) => {

    const podcastCoverRef = useRef<HTMLInputElement | null>(null);
    // Test here if you can inject a file into ref
    const [img, setImg] = useState("");
    const [inputImg, setInputImg] = useState("");
    const [showCrop, setShowCrop] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [rotation, setRotation] = useState(0);
    let responseUrl: string;
    console.log("props.editCover: ", props.editCover)
    //Check if in Edit Mode
    useEffect(() => {
        async function fetchImage() {
            if (!props.editCover) return;
            const response = await fetch(props.editCover);
            const blob = await response.blob();
            responseUrl = response?.url ? response.url : ""
            const oldCoverFile = new File([blob], "image.png", { type: "image/png" });
            const fileArray = [oldCoverFile];
            const newFileList = new DataTransfer();
            fileArray.forEach((file) => {
                newFileList.items.add(file);
            });
            podcastCoverRef.current.files = newFileList.files;
            setImg(props.editCover);
        }

        if (props.isEdit) {
            fetchImage();
        }
    }, [props.editCover]);

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
                {podcastCoverRef?.current?.files?.[0] && (img.length !== 0 || props.editCover.length > 0) ? <ImgCover img={img.length > 0 ? img : props.editCover} /> : <EmptyCover />}
            </label>
        </>
    )
}

export const EmptyCover = () => {
    const { t } = useTranslation();
    return (
        <div className={emptyCoverIconStyling}>
            {/*Image Logo*/}
            <Icon className={photoIconStyling} icon="PHOTO" />
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
                    defaultValue="Arts"
                    onChange={(e) => props.setCategory(e.target.selectedIndex)}
                //props.categoryIndex
                >
                    <CategoryOptions
                        categoryId={props.categoryIndex}
                    />
                </select>
                {/*Languages*/}
                <select
                    className={`${selectDropdownStyling} sm:mr-[2%] w-[47%]`}
                    id="podcastLanguage"
                    defaultValue={DEFAULT_LANGUAGE}
                    name="language"
                    onChange={(e) => props.setLanguage(e.target.value)}
                >
                    <LanguageOptions
                        languageCode={props.languageCode}
                    />
                </select>
            </div>
            <select
                className={`${selectDropdownStyling} hidden sm:flex mr-[2%]`}
                id="podcastCategory"
                name="category"
                defaultValue="Arts"
                onChange={(e) => props.setCategory(e.target.selectedIndex)}
            >
                <CategoryOptions
                    categoryId={props.categoryIndex}
                />
            </select>
            {/*Languages*/}
            <select
                className={`${selectDropdownStyling} hidden sm:flex mr-[2%]`}
                id="podcastLanguage"
                defaultValue={DEFAULT_LANGUAGE}
                name="language"
                onChange={(e) => props.setLanguage(e.target.value)}
            >
                <LanguageOptions
                    languageCode={props.languageCode}
                />
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
                checked={props.explicit}
            />
            <span className={explicitTextStyling}>
                {t("uploadshow.explicit")}
            </span>
        </label>
    )
}

export const VisibleInput = (props: VisibleInputInter) => {
    const { t } = useTranslation();

    return (
        <label className={explicitLabelStyling}>
            <span className={explicitTextStyling}>
                {t("uploadshow.hide")}
            </span>
            <input
                id="podcastExplicit"
                type="checkbox"
                className={visibleCheckBoxStyling}
                onChange={() => props.setVisible(!props.visible)}
                checked={!props.visible}
            />
        </label>
    )
}

export const CropScreen = (props: CropScreenInter) => {
    const { t } = useTranslation();

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
                    {t("cropImage.crop")}
                </p>
            </div>
        </div>
    )
}

export const LabelInput = (props: LabelInputInter) => {
    const { t } = useTranslation();

    const onChange = (e) => {
        const pattern = /^[a-zA-Z0-9]*$/;
        const isValid = pattern.test(e.target.value.trim()) || e.target.value.trim() === "";
        console.log("isValid: ", isValid)

        if (isValid) {
            props.setLabelMsg(handleValMsg(e.target.value.trim(), "podLabel", props.podcasts));
            props.setLabel(e.target.value.trim());
            console.log(e.target.value.trim())
        }
    };

    return (
        <>
            <div className="flexCol">
                <div className="flexYCenter relative bg-zinc-800 rounded-xl pr-1">
                    <input
                        className={epNameStyling}
                        required
                        title="Only letters and numbers are allowed"
                        type="text"
                        name="showLabel"
                        placeholder={t("uploadshow.label")}
                        value={props.labelValue}
                        onChange={(e) => onChange(e)}
                    />
                    <div className="helper-tooltip shrink-0 absolute right-4" data-tooltip-id="labelExplainTip">?</div>
                    <Tooltip id="labelExplainTip" className="max-w-[250px] break-all overflow-hidden" clickable>
                        {t("uploadshow.label-explanation")}
                        {' '}
                        <a
                            className="hover:text-yellow-100 text-yellow-300"
                            href={`https://${props.labelValue}.pc.show`}
                        >
                            {props.labelValue || "<label>"}.pc.show
                        </a>
                    </Tooltip>

                </div>
                <ValMsg valMsg={props.labelMsg} className="pl-2" />
            </div>
        </>
    )
}

