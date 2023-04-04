import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ConnectButton, episodeDescStyling, episodeNameStyling, UploadButton } from "../uploadEpisode/uploadEpisodeTools";
import { LanguageOptions, CategoryOptions } from "../../utils/languages";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../../utils/croppedImage";
import { AR_DECIMALS, CONNECT_WALLET, COVER_UPLOAD_ERROR, DESCRIPTION_UPLOAD_ERROR, EVERPAY_AR_TAG, EVERPAY_BALANCE_ERROR, EVERPAY_EOA, MIN_UPLOAD_PAYMENT, PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN, SHOW_UPLOAD_SUCCESS, SPINNER_COLOR, TOAST_DARK, USER_SIG_MESSAGES } from "../../constants";
import { isValidEmail, ValMsg } from "../reusables/formTools";
import { getBundleArFee, upload2DMedia, upload3DMedia } from "../../utils/arseeding";
import { createFileFromBlobUrl, minifyPodcastCover, createFileFromBlob, getImageSizeInBytes } from "../../utils/fileTools";
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { allFieldsFilled, byteSize, checkConnection, handleError, validateLabel} from "../../utils/reusables";
import Everpay, { ChainType } from "everpay";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { arweaveAddress } from "../../atoms";
import { PermaSpinner } from "../reusables/PermaSpinner";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { Tooltip } from "@nextui-org/react";
import { Podcast } from "../../interfaces";
// const { t } = useTranslation();



export default function uploadShowTools() {
    return false
}

// 1. Interfaces
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

interface CoverContainerInter {
    setCover: (v: any) => void
}

interface LabelInputInter {
    setLabelMsg: (v: any) => void;
    setLabel: (v: any) => void;
    labelValue: string;
    labelMsg: string;
    podcasts: Podcast[];
}

interface ShowFormInter {
    podcasts: Podcast[]
}

// 2. Stylings
export const showTitleStyling = "text-white text-xl mb-4"
export const spinnerClass = "w-full flex justify-center mt-4"
export const photoIconStyling = "h-11 w-11 text-zinc-400"
export const explicitLabelStyling = "flex items-center mr-5"
export const mediaSwitcherLabelStyling = "flex items-center label"
export const imgStyling = "h-48 w-48 text-slate-400 rounded-[20px]"
export const selectDropdownRowStyling = "flex flex-row w-full justify-between"
export const explicitCheckBoxStyling = "checkbox mr-2 border-2 border-zinc-600"
export const emptyCoverIconTextStyling = "text-lg tracking-wider pt-2 text-zinc-400"
export const explicitTextStyling = "label-text cursor-pointer text-zinc-400 font-semibold"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-2"
export const coverContainerInputStyling = "opacity-0 z-index-[-1] absolute pointer-events-none"
export const cropScreenDivStyling = "relative w-[800px] h-[400px] rounded-[6px] overflow-hidden"
export const cropSelectionTextStyling = "flex flex-col justify-center items-center text-white/60"
export const mediaSwitcherVideoStyling = "mr-2 cursor-pointer label-text text-zinc-400 font-semibold"
export const mediaSwitchedAudioStyling = "ml-2 cursor-pointer label-text text-zinc-400 font-semibold"
export const imgCoverStyling = "flex items-center justify-center bg-slate-400 h-48 w-48 rounded-[20px]"
export const uploadShowStyling = "w-full flex flex-col justify-center items-center space-y-1 pb-[200px]"
export const selectDropdownStyling="select select-secondary w-[30%] py-2 px-5 text-base font-normal input-styling bg-zinc-800"
export const cropScreenStyling = "absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-md"
export const coverContainerLabelStyling = "cursor-pointer transition duration-300 ease-in-out text-zinc-600 hover:text-white flex md:block h-fit w-48"
export const cropSelectionDivStyling = "min-w-[50px] min-h-[10px] rounded-[4px] bg-black/10 hover:bg-black/20 border-[1px] border-solid border-white/10 m-2 p-1 px-2 cursor-pointer flex flex-col justify-center items-center"
export const emptyCoverIconStyling = "input input-secondary flex flex-col items-center justify-center cursor-pointer bg-zinc-800 h-48 w-48 rounded-[20px] outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-zinc-600"

// 3. Custom Functions
/**
 * Determines whether validation message should be placed within input field
 * @param {string|number - input from form} input 
 * @param {string - form type} type 
 * @returns Validation message || ""
 */
const handleValMsg = (input: string, type: string, input2: any ="") => {
    switch(type) {
        case 'podName':
        if((input.length > PODCAST_NAME_MAX_LEN || input.length < PODCAST_NAME_MIN_LEN)) {
            return "uploadshow.validation.name"//, { minLength: PODCAST_NAME_MIN_LEN, maxLength: PODCAST_NAME_MAX_LEN });
        } else {
            return "";
        }
        case 'podDesc':
        if((input.length > PODCAST_DESC_MAX_LEN || input.length < PODCAST_DESC_MIN_LEN)) {
            return "uploadshow.validation.description"//, { minLength: PODCAST_DESC_MIN_LEN, maxLength: PODCAST_DESC_MAX_LEN });
        } else {
            return "";
        }
        case 'podAuthor':
        if((input.length > PODCAST_AUTHOR_MAX_LEN || input.length < PODCAST_AUTHOR_MIN_LEN)) {
            return "uploadshow.validation.author"//, { minLength: PODCAST_AUTHOR_MIN_LEN, maxLength: PODCAST_AUTHOR_MAX_LEN };
        } else {
            return "";
        }
        case 'podEmail':
        if(isValidEmail(input)) {
            return "";
        } else {
            return "uploadshow.validation.email";
        }
        case 'podLabel':
        if(validateLabel(input, input2).res) {
            return "";
        } else {
            return validateLabel(input, input2).msg
        }   
    }
}
  
// 4. Components
export const ShowForm = (props: ShowFormInter) => {
    // hooks
    const { t } = useTranslation();
    const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [arweaveAddress_, ] = useRecoilState(arweaveAddress)
    const [submittingShow, setSubmittingShow] = useState<boolean>(false)
    const [uploadCost, setUploadCost] = useState<Number>(0)

    // inputs
    const [podcastDescription_, setPodcastDescription_] = useState("");
    const [podcastAuthor_, setPodcastAuthor_] = useState("");
    const [podcastEmail_, setPodcastEmail_] = useState("");
    const [podcastCategory_, setPodcastCategory_] = useState("art");
    const [podcastName_, setPodcastName_] = useState("");
    const [podcastCover_, setPodcastCover_] = useState(null);
    const [podcastLanguage_, setPodcastLanguage_] = useState('en');
    const [podcastExplicit_, setPodcastExplicit_] = useState(false);
    const [podcastLabel_, setPodcastLabel_] = useState("");

    // Validations
    const [podNameMsg, setPodNameMsg] = useState("");
    const [podDescMsg, setPodDescMsg] = useState("");
    const [podAuthMsg, setPodAuthMsg] = useState("");
    const [podEmailMsg, setPodEmailMsg] = useState("");
    const [labelMsg, setLabelMsg] = useState("");
    const validationObject = {
        "nameError": podNameMsg.length === 0,
        "descError": podDescMsg.length === 0,
        "authError": podAuthMsg.length === 0,
        "emailError": podEmailMsg.length === 0,
        "labelError": labelMsg.length === 0,
        "name": podcastName_.length > 0,
        "desc": podcastDescription_.length > 0,
        "auth": podcastAuthor_.length > 0,
        "email": podcastEmail_.length > 0,
        "lang": podcastLanguage_.length > 0,
        "cat": podcastCategory_.length > 0,
        "cover": podcastCover_ !== null
    }
    // Hook Calculating Upload Cost
    useEffect(() => {
        setUploadCost(0)
        
        async function calculateTotal() {
            const descBytes = byteSize(podcastDescription_)
            const convertedCover = await createFileFromBlobUrl(podcastCover_, "cov.txt")
            const minCover = await minifyPodcastCover(podcastCover_); 
            const fileMini = createFileFromBlob(minCover, "miniCov.jpeg");

            const descFee = await getBundleArFee(String(descBytes))
            const coverFee = await getBundleArFee(String(convertedCover.size))
            const miniFee = await getBundleArFee(String(fileMini.size))

            return Number(descFee) + Number(coverFee) + Number(miniFee)
        }
        if(podcastDescription_.length > 0 && podcastCover_ !== null) {
            calculateTotal().then(async total => {
                const formattedTotal = total / AR_DECIMALS
                setUploadCost(formattedTotal+MIN_UPLOAD_PAYMENT)
            })
        } else {
            setUploadCost(0)
        }
    }, [podcastDescription_, podcastCover_])

    //EXM 
    const createShowPayload = {
        "function": "createPodcast",
        "name": podcastName_,
        "desc": "",
        "author": podcastAuthor_,
        "lang": podcastLanguage_,
        "isExplicit": podcastExplicit_ ? "yes" : "no",
        "categories": podcastCategory_,
        "email": podcastEmail_,
        "cover": "",
        "minifiedCover": "",
        "label": podcastLabel_,
        "jwk_n": "",
        "txid": "",
        "sig": ""
    }

    async function submitShow(payloadObj: any) {
        // Check Connection
        if (!checkConnection(arweaveAddress_)) {
            toast.error(CONNECT_WALLET, {style: TOAST_DARK})
            return false
        }
        setSubmittingShow(true)
        const handleErr = handleError
        // Package EXM Call
        const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
        payloadObj["sig"] = await createSignature(data, defaultSignatureParams, "base64");
        payloadObj["jwk_n"] = await getPublicKey()
        
        // Description to Arseeding
        try {
            const description = await upload2DMedia(podcastDescription_); payloadObj["desc"] = description?.order?.itemId
            //const name = await upload2DMedia(podcastName_); payloadObj["name"] = name?.order?.itemId
        } catch (e) {
            console.log(e); handleErr(DESCRIPTION_UPLOAD_ERROR, setSubmittingShow); return;
        }

        // Covers to Arseeding
        try {
            const convertedCover = await createFileFromBlobUrl(podcastCover_, "cov.txt")
            const cover = await upload3DMedia(convertedCover, convertedCover.type); payloadObj["cover"] = cover?.order?.itemId
            const minCover = await minifyPodcastCover(podcastCover_); const fileMini = createFileFromBlob(minCover, "miniCov.jpeg");
            const miniCover = await upload3DMedia(fileMini, fileMini.type); payloadObj["minifiedCover"] = miniCover?.order?.itemId
        } catch (e) {
            console.log(e); handleErr(COVER_UPLOAD_ERROR, setSubmittingShow); return;
        }

        // Fee to Everpay
        try {
            const everpay = new Everpay({account: address, chainType: ChainType.arweave, arJWK: 'use_wallet',});
            const transaction = await everpay.transfer({
                tag: EVERPAY_AR_TAG,
                amount: String(MIN_UPLOAD_PAYMENT),
                to: EVERPAY_EOA,
                data: {action: "createPodcast", name: podcastName_,}
            })
            payloadObj["txid"] = transaction?.everHash
        } catch (e) {
            console.log(e); handleErr(EVERPAY_BALANCE_ERROR, setSubmittingShow); return;
        }
        //Error handling and timeout needed for this to complete redirect
        setTimeout(async function () {
            const result = await axios.post('/api/exm/write', createShowPayload);
            console.log("exm res: ", result)
            setSubmittingShow(false)
            //EXM call, set timeout, then redirect. 
            toast.success(SHOW_UPLOAD_SUCCESS, {style: TOAST_DARK})
            setTimeout(async function () {
                const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
                window.location.assign(`/creator/${identifier}`);
            }, 500)
        }, 5000)
    }

    return (
        <div className={showFormStyling}>
            {/*First Row*/}
            <div className="flex flex-row w-full">
                {/*
                    Cover
                */}
                <div className="w-[25%] flex justify-center">
                    <CoverContainer 
                        setCover={setPodcastCover_}
                    />
                </div>
                <div className="flex flex-col w-[50%] space-y-3">
                    {/*
                        Episode Name
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="showName" placeholder={t("uploadshow.name")} 
                    onChange={(e) => {
                      setPodNameMsg(handleValMsg(e.target.value, "podName"));
                      setPodcastName_(e.target.value);
                    }}/>
                    <ValMsg valMsg={podNameMsg} className="pl-2" />

                    {/*
                        Episode Description
                    */}
                    <textarea className={episodeDescStyling + " h-32"} required title="Between 1 and 5000 characters" name="showShowNotes" placeholder={t("uploadshow.description")}                     
                    onChange={(e) => {
                      setPodDescMsg(handleValMsg(e.target.value, "podDesc"));
                      setPodcastDescription_(e.target.value);
                    }}></textarea>
                    <ValMsg valMsg={podDescMsg} className="pl-2" />

                    {/*
                        Author
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Author" type="text" name="showName" placeholder={t("uploadshow.author")}                   
                    onChange={(e) => {
                        setPodAuthMsg(handleValMsg(e.target.value, "podAuthor"));
                        setPodcastAuthor_(e.target.value);
                    }} />
                    <ValMsg valMsg={podAuthMsg} className="pl-2" />

                    {/*
                        Email
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Email" type="text" name="showName" placeholder={t("uploadshow.email")}                   
                    onChange={(e) => {
                        setPodEmailMsg(handleValMsg(e.target.value, "podEmail"));
                        setPodcastEmail_(e.target.value);
                    }}/>
                    <ValMsg valMsg={podEmailMsg} className="pl-2" />

                    {/*
                        Genre and Language
                    */}
                    <SelectDropdownRow 
                        setLanguage={setPodcastLanguage_}
                        setCategory={setPodcastCategory_}
                        setLabel={setPodcastLabel_}
                        labelValue={podcastLabel_}
                        setLabelMsg={setLabelMsg}
                        labelMsg={labelMsg}
                        podcasts={props.podcasts}
                    />
                    {/*
                        Explicit
                    */}
                    <ExplicitInput 
                        setExplicit={setPodcastExplicit_}
                        explicit={podcastExplicit_}
                    />

                    {/*
                        Upload
                    */}
                    <div className="w-full flex justify-center items-center flex-col">
                        {/*Show Upload Btn, Spinner, or Connect Btn*/}
                        {address && address.length > 0 && !submittingShow && (
                        <UploadButton 
                            width="w-[50%]"
                            disable={!allFieldsFilled(validationObject)}
                            click={() =>submitShow(createShowPayload)}
                        />
                        )}
                        {address && address.length > 0 && submittingShow && (
                        <PermaSpinner 
                            spinnerColor={SPINNER_COLOR}
                            size={10}
                            divClass={spinnerClass}
                        />
                        )}
                        {!address && (
                            <ConnectButton 
                                width="w-[50%]"
                                disable={false}
                                click={() => connect()}
                            />
                        )}
                        {uploadCost === 0 && podcastDescription_.length > 0 && podcastCover_ && (
                        <p className="mt-2 text-neutral-400">Calculating Fee...</p> 
                        )}
                        {uploadCost !== 0 && podcastDescription_.length > 0 && podcastCover_ && (
                        <p className="mt-2 text-neutral-400">{"Upload Cost: "+(Number(uploadCost)).toFixed(6) +" AR"}</p>
                        )}
                        <button onClick={() => {
                            console.log("allFieldsFilled: ", allFieldsFilled(validationObject))
                            console.log("validationObject: ", validationObject)
                        }}>Show Stuff</button>
                    </div>
                </div>
                <div className="w-[25%]"></div>
            </div>
        </div>
    )
}

export const LabelInput = (props: LabelInputInter) => {
    const { t } = useTranslation();
//absolute right-2 top-3
    return (
        <>
        <div className="flex-col">
            <div className="flex flex-row items-center bg-zinc-800 rounded-xl pr-1">
            <input className={episodeNameStyling} required title="Only letters and numbers are allowed" type="text" name="showLabel" placeholder={t("uploadshow.label")}
            value={props.labelValue}
            onChange={(e) => {
            const pattern = /^[a-zA-Z0-9]*$/;
            const isValid = pattern.test(e.target.value.trim());
            console.log("isValid: ", isValid)
  
            if (isValid) {
                props.setLabelMsg(handleValMsg(e.target.value.trim(), "podLabel", props.podcasts));
                props.setLabel(e.target.value.trim());
                console.log(e.target.value.trim())
            }
            }}/>
            <Tooltip rounded color="invert" content={<div className="max-w-[240px]">{t("uploadshow.label-explanation")} <a href={`https://${props.labelValue}.pc.show`}>{props.labelValue}.pc.show</a></div>}>
                <div className="helper-tooltip">?</div>
            </Tooltip>
            </div>
            <ValMsg valMsg={props.labelMsg} className="pl-2" />
        </div>
        </>       
    )
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
        <div className={selectDropdownRowStyling}>
            {/*Categories*/}
            <select
                className={`${selectDropdownStyling} mr-[2%]`}
                id="podcastCategory"
                name="category"
                onChange={(e) => props.setCategory(e.target.value)}
            >
                <CategoryOptions />
            </select>
            {/*Languages*/}
            <select
                className={`${selectDropdownStyling} mr-[2%]`}
                id="podcastLanguage"
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

export const MediaSwitcher = () => {
    const { t } = useTranslation();

    const [contentType_, setContentType_] = useState<string>("")

    return (
        <label className={mediaSwitcherLabelStyling}>
            {/* <div className={mediaSwitcherVideoStyling}>
                Video
            </div>
            <input type="checkbox" className="toggle" checked={contentType_ === "a" ? true: false}
                onChange={(e) => {
                    console.log(e)
                    setContentType_(contentType_ === "a" ? "v": "a")
                }}
            />
            <div className={mediaSwitchedAudioStyling}>
                Audio
            </div> */}
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
