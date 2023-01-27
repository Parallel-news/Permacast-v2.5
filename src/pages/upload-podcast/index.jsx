import axios from 'axios';
import { useState, useRef, useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Resizer from "react-image-file-resizer";
import Cropper from "react-easy-crop";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { BsArrowRightShort } from "react-icons/bs";
import { UploadsList } from "../../component/uploadsList";

import { ContentType, uploadPercent } from "../../atoms";
import { LanguageOptions, CategoryOptions } from "../../utils/languages";
import getCroppedImg from "../../utils/croppedImage";

import { validateStrLength } from "../../utils/uploadValidation";
import {
  PODCAST_NAME_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_DESC_MIN_LEN,
  PODCAST_DESC_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_AUTHOR_MAX_LEN,
  PODCAST_LANG_MIN_LEN, PODCAST_LANG_MAX_LEN, PODCAST_CAT_MIN_LEN,
  PODCAST_CAT_MAX_LEN, IS_EXPLICIT_VALUES, 
  PODCAST_COVER_MIN_LEN, PODCAST_COVER_MAX_LEN, CONTENT_TYPE_VALUES,
  PODCAST_NAME_VAL_MSG, PODCAST_DESC_VAL_MSG, PODCAST_AUTH_VAL_MSG,
  PODCAST_EMAIL_VAL_MSG,
  PODCAST_MINIFIED_COVER_MAX_SIZE
} from '../../constants';
import { CheckAuthHook } from "../../utils/ui";
import useEthTransactionHook from "../../utils/ethereum";
import { ValMsg, isValidEmail, reduceImageSize } from "../../component/reusables/formTools";
import { convertFilesToBuffer } from "../../utils/arseed";

export default function UploadPodcast() {
  const { t } = useTranslation();

  // remove state from here
  const [eth, ar] = CheckAuthHook();
  const [data, isLoading, isSuccess, sendTransaction, error] = useEthTransactionHook();

  const [contentType_, ] = useRecoilState(ContentType);
  const setPercent = useSetRecoilState(uploadPercent);

  // inputs
  const [podcastDescription_, setPodcastDescription_] = useState("");
  const [podcastAuthor_, setPodcastAuthor_] = useState("");
  const [podcastEmail_, setPodcastEmail_] = useState("");
  const [podcastCategory_, setPodcastCategory_] = useState("True Crime");
  const [podcastName_, setPodcastName_] = useState("");
  const [podcastCover_, setPodcastCover_] = useState(null);
  const [podcastLanguage_, setPodcastLanguage_] = useState('en');
  const [podcastExplicit_, setPodcastExplicit_] = useState(false);

  // Validations
  const [podNameMsg, setPodNameMsg] = useState("");
  const [podDescMsg, setPodDescMsg] = useState("");
  const [podAuthMsg, setPodAuthMsg] = useState("");
  const [podEmailMsg, setPodEmailMsg] = useState("");
  const [podMiscMsg, setPodMiscMsg] = useState("");
  const [podSubmitMsg, setPodSubmitMsg] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);

  const [img, setImg] = useState("");
  const [inputImg, setInputImg] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const podcastCoverRef = useRef();
  const [podcastCoverTX, setPodcastCoverTX] = useState("");
  const [podcastMinifiedCoverTX, setPodcastMinifiedCoverTX] = useState("");

  const resizeFile = (file, quality=100, width=200, height=200) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width, // width
        height, // height
        "WEBP", // JPEG PNG OR WEBP
        quality, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        },
        "file" // blob file or base64 output
      );
    });
  };

  const uploadCover = async () => {
    if (!podcastCover_) return;

    let minifiedCover = podcastCover_;
    let quality = 100;
    while (minifiedCover.size > PODCAST_MINIFIED_COVER_MAX_SIZE && quality > 0) {
      minifiedCover = await resizeFile(minifiedCover, quality);
      quality -= 10;
    }

    const data = await convertFilesToBuffer([podcastCover_, minifiedCover]);

    const upload = await axios.post('/api/arseed/podcast-covers', {covers: data})
    console.log(upload)
    return upload.data.response;

  };

  // for the sake of clarity, putting these two along each other
  const payEthAndUpload = async (e) => {
    e.preventDefault();
    if (!(eth && ar)) return;
    // if (!!formIsValid()) return;
    setIsUploading(true)
    uploadCover().then((covers) => {
      setPodcastCoverTX(covers[0])
      setPodcastMinifiedCoverTX(covers[1])
      sendTransaction();
    })

    // Exm will auto-upload from here
  }

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

  // isSuccess property of the wagmi transaction
  useEffect(() => {
    if (isSuccess) handleExm()
  }, [isSuccess]);


  const handleExm = async () => {
    if (!data) throw new Error("Tx failed")
    const userSignature = localStorage.getItem("userSignature");
    const arconnectPubKey = localStorage.getItem("userPubKey")
    if (!userSignature) throw new Error("ArConnect signature not found");
    if (!arconnectPubKey) throw new Error("ArConnect public key not found");

    const showObj = {};

    // // add attrs to input for SWC
    showObj.function = "createPodcast";
    showObj.name = podcastName_;
    showObj.desc = podcastDescription_;
    showObj.author = podcastAuthor_; 
    showObj.lang = podcastLanguage_;
    showObj.isExplicit = podcastExplicit_ ? "yes" : "no";
    showObj.categories = podcastCategory_;
    showObj.email = podcastEmail_;
    showObj.contentType = 'a';//contentType_; // v for video and a for audio
    showObj.cover = podcastCover_;
    showObj.minifiedCover = podcastMinifiedCoverTX;
    showObj.cover = podcastCoverTX;
    showObj.master_network = "EVM";
    showObj.network = "ethereum";
    showObj.token = "ETH";
    showObj.label = "nulejail"; // TODO implement later
    showObj.jwk_n = arconnectPubKey;
    showObj.txid = data?.hash;
    showObj.sig = userSignature;
    const result = await axios.post('/api/exm/dev/write', showObj);
    console.log(result.data)
    setIsUploading(false)
  };

  const handleChangeImage = async (e) => {
    isPodcastCoverSquared(e);
    setPodcastCover_(e.target.files[0])
    // const file = await reduceImageSize(e.target.files[0]);
    // console.log("REDUCED FILE: ", file);
  };

  /**
   * Determines whether validation message should be placed within input field
   * @param {string|number - input from form} input 
   * @param {string - form type} type 
   * @returns Validation message || ""
   */
  const handleValMsg =(input, type) => {
    switch(type) {
      case 'podName':
        if((input > PODCAST_NAME_MAX_LEN || input < PODCAST_NAME_MIN_LEN)) {
          return PODCAST_NAME_VAL_MSG;
        } else {
          return "";
        }
      case 'podDesc': 
        if((input > PODCAST_DESC_MAX_LEN || input < PODCAST_DESC_MIN_LEN)) {
          return PODCAST_DESC_VAL_MSG;
        } else {
          return "";
        }
      case 'podAuthor':
        if((input > PODCAST_AUTHOR_MAX_LEN || input < PODCAST_AUTHOR_MIN_LEN)) {
          return PODCAST_AUTH_VAL_MSG;
        } else {
          return "";
        }
      case 'podEmail':
        if(isValidEmail(input)) {
          return "";
        } else {
          return PODCAST_EMAIL_VAL_MSG;
        }
    }
  }

  /**
   * Checks all form inputs in case UI is skipped for malicious intents
   * @returns Form inputs || Submission error
   */
  const formIsValid = () => {
    // console.log(
    //   podcastName_,
    //   podcastDescription_,
    //   podcastAuthor_,
    //   podcastEmail_,
    //   podcastCategory_,
    //   podcastCover_,
    //   podcastLanguage_,
    //   podcastExplicit_
    // );

    validateStrLength(podcastName_, PODCAST_NAME_MIN_LEN, PODCAST_NAME_MAX_LEN) ? "" : setPodNameMsg(PODCAST_NAME_VAL_MSG);
    validateStrLength(podcastDescription_, PODCAST_DESC_MIN_LEN, PODCAST_DESC_MAX_LEN) ? "" : setPodDescMsg(PODCAST_DESC_VAL_MSG);
    validateStrLength(podcastAuthor_, PODCAST_AUTHOR_MIN_LEN, PODCAST_AUTHOR_MAX_LEN) ? "" : setPodAuthMsg(PODCAST_AUTH_VAL_MSG);
    validateStrLength(podcastLanguage_, PODCAST_LANG_MIN_LEN, PODCAST_LANG_MAX_LEN) ? "" : setPodMiscMsg("Invalid language");
    // validateStrLength(podcastCover_, PODCAST_COVER_MIN_LEN, PODCAST_COVER_MAX_LEN) ? "" : setPodMiscMsg("Invalid Cover");
    validateStrLength(podcastCategory_,  PODCAST_CAT_MIN_LEN, PODCAST_CAT_MAX_LEN) ? "" : setPodMiscMsg("Invalid Category");
    isValidEmail(podcastEmail_) ? "" : setPodEmailMsg(PODCAST_EMAIL_VAL_MSG);
    // IS_EXPLICIT_VALUES.includes(podcastExplicit_) ? "" : setPodMiscMsg("Invalid Explicit Value");
    CONTENT_TYPE_VALUES.includes(contentType_) ? "" : setPodMiscMsg("Invalid Content Type");

    //if any of messages occupied, do not submit and leave an error message f
    if (podNameMsg.length > 0 || podDescMsg.length > 0 || podAuthMsg.length > 0 || podEmailMsg > 0) {
      setPodSubmitMsg("Please fill form correctly");
      return false
    } else {
      return [
        podcastName_,
        podcastDescription_,
        podcastAuthor_,
        podcastEmail_,
        podcastCategory_,
        // podcastCover_,
        podcastLanguage_,
        podcastExplicit_
      ]
    }
  }

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
      // console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      setImg(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  return (
    <div className="text-zinc-400 h-full">
      <UploadsList />
      {showCrop && (
        <div className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-md`}>
          <div className={`relative w-[800px] h-[400px] rounded-[6px] overflow-hidden`}>
            <Cropper
              image={inputImg}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div
            className={`min-w-[50px] min-h-[10px] rounded-[4px] bg-black/10 hover:bg-black/20 border-[1px] border-solid border-white/10 m-2 p-1 px-2 cursor-pointer flex flex-col justify-center items-center`}
            onClick={async () => {
              showCroppedImage();
              setShowCrop(false);
            }}
          >
            <p className={`flex flex-col justify-center items-center text-white/60`}>
              Crop Selection
            </p>
          </div>
        </div>
      )}
      <h1 className="text-2xl tracking-wider text-white">
        {t("uploadshow.title")}
      </h1>
      {/* <div className="w-[100px] h-[30px] bg-white/50 rounded-md cursor-pointer"
        onClick={() => payEthAndUpload()}
      /> */}
      {isLoading && <div>ETH TX sent</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}

      <div className="form-control">
        <form onSubmit={(e) => {payEthAndUpload(e); return false}}>
          <div className="md:flex mt-7">
            <input
              required
              type="file"
              accept="image/*"
              className="opacity-0 z-index-[-1] absolute pointer-events-none"
              ref={podcastCoverRef}
              onChange={(e) => handleChangeImage(e)}
              name="podcastCover"
              id="podcastCover"
            />
            <label
              htmlFor="podcastCover"
              className="cursor-pointer transition duration-300 ease-in-out text-zinc-600 hover:text-white flex md:block md:h-full w-48"
            >
              {podcastCoverRef.current?.files?.[0] ? (
                <div className="cursor-pointer bg-zinc-900 h-48 w-48 rounded-[20px] flex items-center justify-center">
                  <img src={img} className="h-48 w-48" />
                </div>
              ) : (
                <div className="cursor-pointer bg-zinc-900 h-48 w-48 rounded-[20px] flex items-center justify-center">
                  <div className="cursor-pointer outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <div className="flex justify-center">
                      <div className="cursor-pointer">
                        <PhotoIcon className="h-11 w-11" />
                      </div>
                    </div>
                    <div className="flex justify-center pt-2">
                      <div className="text-lg cursor-pointer tracking-wider">
                        {t("uploadshow.image")}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </label>
            <div className="ml-0 md:ml-10 mt-10 md:mt-0 fields w-5/6">
              <div className="h-50 mb-10">
                <div className="mb-5">
                  <input
                    className="input-default px-5 w-full"
                    placeholder={t("uploadshow.name")}
                    pattern=".{2,500}"
                    title="Between 2 and 500 characters"
                    type="text"
                    onChange={(e) => {
                      setPodNameMsg(handleValMsg(e.target.value.length, "podName"));
                      setPodcastName_(e.target.value);
                    }}
                    name="podcastName"
                    required
                  />
                  <ValMsg valMsg={podNameMsg} className="pl-2" />
                </div>
                <div className="mb-5">
                  <textarea
                    className="input-default resize-none py-3 px-5 w-full h-[124px]"
                    placeholder={t("uploadshow.description")}
                    pattern=".{10,15000}"
                    title="Between 10 and 15000 characters"
                    name="podcastDescription"
                    required
                    onChange={(e) => {
                      setPodDescMsg(handleValMsg(e.target.value.length, "podDesc"));
                      setPodcastDescription_(e.target.value);
                    }}
                  />
                  <ValMsg valMsg={podDescMsg} className="pl-2" />
                </div>
              </div>
              <div className="mb-5">
                <input
                  className="input-default w-1/2 py-3 px-5 bg-zinc-900"
                  placeholder={t("uploadshow.author")}
                  name="podcastAuthor"
                  onChange={(e) => {
                    setPodAuthMsg(handleValMsg(e.target.value.length, "podAuthor"));
                    setPodcastAuthor_(e.target.value);
                  }}
                />
                <ValMsg valMsg={podAuthMsg} className="pl-2" />
              </div>
              <div className="mb-10 ">
                <input
                  className="input-default w-1/2 py-3 px-5"
                  placeholder={t("uploadshow.email")}
                  type="email"
                  name="podcastEmail"
                  onChange={(e) => {
                    setPodEmailMsg(handleValMsg(e.target.value, "podEmail"));
                    setPodcastEmail_(e.target.value);
                  }}
                />
                <ValMsg valMsg={podEmailMsg} className="pl-2" />
              </div>
              <div className="mb-5">
                <select
                  className="select select-secondary w-1/2 py-2 px-5 text-base font-normal input-styling"
                  id="podcastCategory"
                  name="category"
                  onChange={(e) => {  
                    console.log(e.target.value)
                    setPodcastCategory_(e.target.value);
                  }}
                >
                  <CategoryOptions />
                </select>
              </div>
              <div className="mb-5">
                <select
                  className="select select-secondary w-1/2 py-2 px-5 text-base font-normal input-styling"
                  id="podcastLanguage"
                  name="language"
                  onChange={(e) => {
                    setPodcastLanguage_(e.target.value);
                  }}
                >
                  <LanguageOptions />
                </select>
              </div>
              <label className="flex mb-5 items-center">
                <input
                  id="podcastExplicit"
                  type="checkbox"
                  className="checkbox checkbox-ghost bg-yellow mr-2"
                  onChange={() => setPodcastExplicit_(!podcastExplicit_)}
                />
                <span className="label-text cursor-pointer">
                  {t("uploadshow.explicit")}
                </span>
              </label>
              <div className="flex items-center place-content-end pb-28">
                <div className="bg-zinc-800 rounded-lg px-4 py-[9px] mr-4">
                  {t("uploadshow.feetext")}
                  <span className="text-lg font-bold underline">
                    {0.001} ETH
                  </span>
                </div>
                  <>
                    {isUploading ? (
                      <button
                        type="button"
                        className="btn btn-primary p-2 rounded-lg"
                        disabled
                      >
                        <div
                          className="animate-spin border-t-3 rounded-t-full border-yellow-100 h-5 w-5 mr-3"
                          viewBox="0 0 24 24"
                        ></div>
                        {t("uploadshow.uploading")}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-secondary" 
                        disabled={!(eth && ar)}
                      >
                        {((eth && ar)) ? t("uploadshow.upload"): t("uploadshow.disabled")}
                        <BsArrowRightShort className="w-7 h-7" />
                      </button>
                    )}
                  </>
                  <ValMsg valMsg={podSubmitMsg} className="pl-2" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  }
}
