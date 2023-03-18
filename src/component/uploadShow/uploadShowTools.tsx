import { MouseEventHandler, useCallback, useRef, useState } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline";
import { episodeDescStyling, episodeNameStyling, UploadButton } from "../uploadEpisode/uploadEpisodeTools";
import { LanguageOptions, CategoryOptions } from "../../utils/languages";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../../utils/croppedImage";
import { PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN, USER_SIG_MESSAGES } from "../../constants";
import { isValidEmail, ValMsg } from "../reusables/formTools";
import { upload2DMedia, upload3DMedia } from "../../utils/arseeding";
import { createFileFromBlobUrl, minifyPodcastCover, createFileFromBlob, getImageSizeInBytes } from "../../utils/fileTools";
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { checkConnection } from "../../utils/reusables";


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

// 2. Stylings
export const showTitleStyling = "text-white text-xl"
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
export const selectDropdownStyling="select select-secondary w-[49%] py-2 px-5 text-base font-normal input-styling bg-zinc-800"
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
const handleValMsg = (input: string, type: string) => {
    switch(type) {
        case 'podName':
        if((input.length > PODCAST_NAME_MAX_LEN || input.length < PODCAST_NAME_MIN_LEN)) {
            return `Name must be between ${PODCAST_NAME_MIN_LEN} and ${PODCAST_NAME_MAX_LEN} characters`;
        } else {
            return "";
        }
        case 'podDesc':
        if((input.length > PODCAST_DESC_MAX_LEN || input.length < PODCAST_DESC_MIN_LEN)) {
            return `Description must be between ${PODCAST_DESC_MIN_LEN} and ${PODCAST_DESC_MAX_LEN} characters`;
        } else {
            return "";
        }
        case 'podAuthor':
        if((input.length > PODCAST_AUTHOR_MAX_LEN || input.length < PODCAST_AUTHOR_MIN_LEN)) {
            return `Author must be between ${PODCAST_AUTHOR_MIN_LEN} and ${PODCAST_AUTHOR_MAX_LEN}`;
        } else {
            return "";
        }
        case 'podEmail':
        if(isValidEmail(input)) {
            return "";
        } else {
            return `Enter a valid email`
        }
    }
}

/**
 * Checks dictionary object for populated keys. If populated, dont submit
 * @param fieldsObj obj containing conditions. If true, qualified for submission
 * @returns boolean
 */
export const allFieldsFilled = (fieldsObj: any) => {
    for (const key in fieldsObj) {
        if(Object.hasOwnProperty.call(fieldsObj, key)) {
            if(!fieldsObj[key]) {
                return false
            }
        }   
    }
    return true
}
  
// 4. Components
export const ShowForm = () => {

    // inputs
    const [podcastDescription_, setPodcastDescription_] = useState("");
    const [podcastAuthor_, setPodcastAuthor_] = useState("");
    const [podcastEmail_, setPodcastEmail_] = useState("");
    const [podcastCategory_, setPodcastCategory_] = useState("art");
    const [podcastName_, setPodcastName_] = useState("");
    const [podcastCover_, setPodcastCover_] = useState(null);
    const [podcastLanguage_, setPodcastLanguage_] = useState('en');
    const [podcastExplicit_, setPodcastExplicit_] = useState(false);

    // Validations
    const [podNameMsg, setPodNameMsg] = useState("");
    const [podDescMsg, setPodDescMsg] = useState("");
    const [podAuthMsg, setPodAuthMsg] = useState("");
    const [podEmailMsg, setPodEmailMsg] = useState("");
    const validationObject = {
        "nameError": podNameMsg.length === 0,
        "descError": podDescMsg.length === 0,
        "authError": podAuthMsg.length === 0,
        "emailError": podEmailMsg.length === 0,
        "name": podcastName_.length > 0,
        "desc": podcastDescription_.length > 0,
        "auth": podcastAuthor_.length > 0,
        "email": podcastEmail_.length > 0,
        "lang": podcastLanguage_.length > 0,
        "cat": podcastCategory_.length > 0,
        "cover": podcastCover_ !== null
    }

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
        "contentType": "a",
        "cover": "",
        "minifiedCover": "",
        "label": "",
        "jwk_n": "",
        "txid": "0x8b2a51ca88ebfb07b2931028dc714b85a8deb8d4d69d8d83cdc23bc866b69e94",
        "sig": ""
    }

    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

    async function submitShow(payloadObj: any) {
        await connect()
        const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
        console.log("check check")

        //Package EXM Call
        payloadObj["sig"] = await createSignature(data, defaultSignatureParams, "base64");
        payloadObj["jwk_n"] = await getPublicKey()
        //const description = await upload2DMedia(podcastDescription_); payloadObj["desc"] = description?.order?.itemId
        //payloadObj["label"] = "null1"
        
        //const convertedCover = await createFileFromBlobUrl(podcastCover_, "cov.txt")
        //const cover = await upload3DMedia(convertedCover, convertedCover.type); payloadObj["cover"] = cover?.order?.itemId

        //const minCover = await minifyPodcastCover(podcastCover_); const fileMini = createFileFromBlob(minCover, "miniCov.jpeg");
        //const miniCover = await upload3DMedia(fileMini, fileMini.type); payloadObj["minifiedCover"] = miniCover?.order?.itemId
        // Inspect 
        console.log("Payload: ", createShowPayload)


    }

    //Format to allow 
    async function inspect() {
        console.log("PODCAST COVER:", podcastCover_)
        const convertedFile = await createFileFromBlobUrl(podcastCover_, "cov.txt")
        console.log("convertedFiled: ", convertedFile)

        const res = await minifyPodcastCover(podcastCover_)
        console.log("mini res: ", res)
        const fileMini = createFileFromBlob(res, "miniCov.jpeg");
        console.log(fileMini)
        await upload3DMedia(convertedFile, convertedFile.type)
        await upload3DMedia(fileMini, fileMini.type)
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
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="showName" placeholder={"Show Name"}                     
                    onChange={(e) => {
                      setPodNameMsg(handleValMsg(e.target.value, "podName"));
                      setPodcastName_(e.target.value);
                    }}/>
                    <ValMsg valMsg={podNameMsg} className="pl-2" />

                    {/*
                        Episode Description
                    */}
                    <textarea className={episodeDescStyling + " h-32"} required title="Between 1 and 5000 characters" name="showShowNotes" placeholder={"Description"}                     
                    onChange={(e) => {
                      setPodDescMsg(handleValMsg(e.target.value, "podDesc"));
                      setPodcastDescription_(e.target.value);
                    }}></textarea>
                    <ValMsg valMsg={podDescMsg} className="pl-2" />

                    {/*
                        Author
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Author" type="text" name="showName" placeholder={"Author"}                   
                    onChange={(e) => {
                        setPodAuthMsg(handleValMsg(e.target.value, "podAuthor"));
                        setPodcastAuthor_(e.target.value);
                    }} />
                    <ValMsg valMsg={podAuthMsg} className="pl-2" />

                    {/*
                        Email
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Email" type="text" name="showName" placeholder={"Email"}                   
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
                    <div className="w-full flex justify-center">
                        <UploadButton 
                            width="w-[50%]"
                            disable={!allFieldsFilled(validationObject)}
                            click={() =>submitShow(createShowPayload)}
                        />
                    </div>
                </div>
                <div className="w-[25%]"></div>
            </div>
        </div>
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
    return (
        <div className={emptyCoverIconStyling}>
          {/*Image Logo*/}
            <PhotoIcon className={photoIconStyling} />
          {/*Cover Image Text*/}
            <div className={emptyCoverIconTextStyling}>
              Image Required
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
            <select
                className={`${selectDropdownStyling} mr-[2%]`}
                id="podcastCategory"
                name="category"
                onChange={(e) => props.setCategory(e.target.value)}
            >
                <option>Arts</option>
                <option>Business</option>
            </select>
            <select
                className={selectDropdownStyling}
                id="podcastLanguage"
                name="language"
                onChange={(e) => props.setLanguage(e.target.value)}
            >
                <option>English</option>
                <option>Chinese</option>
            </select>
        </div>
    )
}

export const ExplicitInput = (props: ExplicitInputInter) => {
    return (
    <label className={explicitLabelStyling}>
        <input
            id="podcastExplicit"
            type="checkbox"
            className={explicitCheckBoxStyling}
            onChange={() => props.setExplicit(!props.explicit)}
        />
        <span className={explicitTextStyling}>
            Contains Explicit Content
        </span>
    </label>
    )
}

export const MediaSwitcher = () => {
    const [contentType_, setContentType_] = useState<string>("")
    return (
        <label className={mediaSwitcherLabelStyling}>
            <div className={mediaSwitcherVideoStyling}>
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
            </div>
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

/*
{
    "everHash": "0xab56df38218eb49c023a2c683cdcffafba386676ccb0bd688701fc210ca65b33",
    "order": {
        "itemId": "LDwYbqD_TIffjZ54n8TLKgPErXINwuyQ1dshr7gtjWI",
        "size": 122096,
        "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
        "currency": "AR",
        "decimals": 12,
        "fee": "210160368",
        "paymentExpiredTime": 1679177716,
        "expectedBlock": 1140009
    }
}



*/