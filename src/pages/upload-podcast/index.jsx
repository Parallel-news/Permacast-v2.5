import { React, useState, useRef, useContext, useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Cropper from "react-easy-crop";
import BigNumber from "bignumber.js";
import { genAPI } from 'arseeding-js';
import Everpay from 'everpay';

import { PhotoIcon } from "@heroicons/react/24/outline";
import { BsArrowRightShort } from "react-icons/bs";
import { UploadsList } from "../../component/uploadsList";

import { ContentType, uploadPercent } from "../../atoms";
import LANGUAGES from "../../utils/languages";
import getCroppedImg from "../../utils/croppedImage";
import handler from "../../services/services";
import { validateStrLength } from "../../utils/uploadValidation";
import {
  PODCAST_NAME_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_DESC_MIN_LEN,
  PODCAST_DESC_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_AUTHOR_MAX_LEN,
  PODCAST_LANG_MIN_LEN, PODCAST_LANG_MAX_LEN, PODCAST_CAT_MIN_LEN,
  PODCAST_CAT_MAX_LEN, IS_EXPLICIT_VALUES, 
  PODCAST_COVER_MIN_LEN, PODCAST_COVER_MAX_LEN, CONTENT_TYPE_VALUES,
  PODCAST_NAME_VAL_MSG, PODCAST_DESC_VAL_MSG, PODCAST_AUTH_VAL_MSG,
  PODCAST_EMAIL_VAL_MSG
} from '../../constants';
import { CheckAuthHook } from "../../utils/ui";
import useEthTransactionHook from "../../utils/ethereum";
import { ValMsg, isValidEmail, reduceImageSize } from "../../component/reusables/formTools";


export default function UploadPodcast() {
  const everpay = new Everpay();
  // remove state from here
  const [show, setShow] = useState(false);
  const [img, setImg] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [eth, ar] = CheckAuthHook();
  const [data, isLoading, isSuccess, error] = useEthTransactionHook();
  let finalShowObj = {};
  const [contentType_, ] = useRecoilState(ContentType);
  const podcastCoverRef = useRef();
  const { t, i18n } = useTranslation();
  const currentLanguage = LANGUAGES.find(
    (language) => i18n.language === language.code
  );
  const languages = currentLanguage?.languages || [];
  const categories = currentLanguage?.categories || [];

  const setPercent = useSetRecoilState(uploadPercent);

  const [podcastDescription_, setPodcastDescription_] = useState("");
  const [podcastAuthor_, setPodcastAuthor_] = useState("");
  const [podcastEmail_, setPodcastEmail_] = useState("");
  const [podcastCategory_, setPodcastCategory_] = useState("");
  const [podcastName_, setPodcastName_] = useState("");
  const [podcastCover_, setPodcastCover_] = useState("fdsnafdofidiodafjdijf9ef9r0f4-f4k4f04kfjf8e");
  const [podcastLanguage_, setPodcastLanguage_] = useState('en');
  const [podcastExplicit_, setPodcastExplicit_] = useState(false);

  // for the sake of clarity, putting these two along each other
  const payEthAndUpload = async () => {
    //console.log(await window.arweaveWallet.getPermissions())
    // wagmi will handle upload and the rest of stuff
    //sendTransaction()
    const instance = await genAPI(window.ethereum);
    console.log(instance);
    //await window.ethereum.enable();
    //const provider = new providers.Web3Provider(window.ethereum);
    //const bundlr = new WebBundlr("https://node2.bundlr.network", "ethereum", provider);
    //await bundlr.ready();
    //console.log(bundlr);
    /*
    const fundAmountParsed = new BigNumber(0.001).multipliedBy(
      bundlr.currencyConfig.base[1],
    );
    await bundlr.fund(Number(fundAmountParsed));
    */
    const curBalance = await bundlr.getBalance("0xf1018f794E5A281889e74A873Af0d5C3373e55AD");
    console.log(bundlr.utils.unitConverter(curBalance).toFixed(7, 2).toString());
    //validateForm();
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
  }, [isSuccess])


  const handleExm = async () => {
    if (!data) throw new Error("Tx failed")
    const userSignature = localStorage.getItem("userSignature");
    const arconnectPubKey = localStorage.getItem("userPubKey")
    if (!userSignature) throw new Error("ArConnect signature not found");
    if (!arconnectPubKey) throw new Error("ArConnect public key not found");

    const defaultLang = "en";
    const defaultCat = 'True Crime';

    const showObj = {};

    // // add attrs to input for SWC
    showObj.function = "createPodcast";
    showObj.name = podcastName_;
    showObj.desc = podcastDescription_;
    showObj.author = podcastAuthor_; 
    showObj.lang = defaultLang; // podcastLanguage_; "en" is the only accepted value & 2chars in length
    showObj.isExplicit = "no"; //podcastExplicit_must be "yes" or "no"
    showObj.categories = podcastCategory_;
    showObj.email = podcastEmail_;
    showObj.contentType = contentType_; // v for video and a for audio
    showObj.cover = podcastCover_; // must have "image/*" MIME type
    // max size: 64kbs
    showObj.minifiedCover = 'Rtjwzke-8cCLd0DOKGKCx5zNjmoVr51yy_Se1s73YH4'; //must be 43 chars in length
    showObj.cover = '5QzEMAZJvCQmCL2TJpLo789MTforaJBFKKnqBNWg0sA'; //must be 43 chars in length
    showObj.master_network = "EVM"; // currently constant
    showObj.network = "ethereum"; // currently constant
    showObj.token = "ETH"; // currently constant - always capitalized
    showObj.label = "testSeb69"; // check N.B
    showObj.jwk_n = arconnectPubKey;
    showObj.txid = data?.hash;
    showObj.sig = userSignature; // check N.B
    handler(showObj);
  };

  const languageOptions = () => {
    const langsArray = Object.entries(languages);
    //<option disabled defaultValue>Language</option>
    let optionsArr = [];
    for (let lang of langsArray) {
      optionsArr.push(
        <option value={lang[0]} key={lang[1]}>
          {lang[1]}
        </option>
      );
    }
    return optionsArr;
  };

  const categoryOptions = () => {
    // <option disabled defaultValue>Category</option>
    let optionsArr = [];
    for (let i in categories) {
      optionsArr.push(
        <option value={categories[i]} key={i}>
          {categories[i]}
        </option>
      );
    }
    return optionsArr;
  };

  const handleChangeImage = async (e) => {
    console.log(e.target.files[0]);
    // const file = await reduceImageSize(e.target.files[0]);
    // console.log("REDUCED FILE: ", file);
    isPodcastCoverSquared(e);
  };

  const [inputImg, setInputImg] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  // Validations
  const [podNameMsg, setPodNameMsg] = useState("");
  const [podDescMsg, setPodDescMsg] = useState("");
  const [podAuthMsg, setPodAuthMsg] = useState("");
  const [podEmailMsg, setPodEmailMsg] = useState("");
  const [podMiscMsg, setPodMiscMsg] = useState("");
  const [podSubmitMsg, setPodSubmitMsg] = useState("");

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
  const validateForm = () => {
    console.log(
      podcastName_,
      podcastDescription_,
      podcastAuthor_,
      podcastEmail_,
      podcastCategory_,
      podcastCover_,
      podcastLanguage_,
      podcastExplicit_
    );

    validateStrLength(podcastName_, PODCAST_NAME_MIN_LEN, PODCAST_NAME_MAX_LEN) ? "" : setPodNameMsg(PODCAST_NAME_VAL_MSG);
    validateStrLength(podcastDescription_, PODCAST_DESC_MIN_LEN, PODCAST_DESC_MAX_LEN) ? "" : setPodDescMsg(PODCAST_DESC_VAL_MSG);
    validateStrLength(podcastAuthor_, PODCAST_AUTHOR_MIN_LEN, PODCAST_AUTHOR_MAX_LEN) ? "" : setPodAuthMsg(PODCAST_AUTH_VAL_MSG);
    validateStrLength(podcastLanguage_, PODCAST_LANG_MIN_LEN, PODCAST_LANG_MAX_LEN) ? "" : setPodMiscMsg("Invalid language");
    validateStrLength(podcastCover_, PODCAST_COVER_MIN_LEN, PODCAST_COVER_MAX_LEN) ? "" : setPodMiscMsg("Invalid Cover");
    validateStrLength(podcastCategory_,  PODCAST_CAT_MIN_LEN, PODCAST_CAT_MAX_LEN) ? "" : setPodMiscMsg("Invalid Category");
    isValidEmail(podcastEmail_) ? "" : setPodEmailMsg(PODCAST_EMAIL_VAL_MSG);
    IS_EXPLICIT_VALUES.includes(podcastExplicit_) ? "" : setPodMiscMsg("Invalid Explicit Value");
    CONTENT_TYPE_VALUES.includes(contentType_) ? "" : setPodMiscMsg("Invalid Content Type");

    //if any of messages occupied, do not submit and leave an error message f
    if(podNameMsg.length > 0 || podDescMsg.length > 0 || podAuthMsg.length > 0 || podEmailMsg > 0) {
      setPodSubmitMsg("Please fill form correctly");
    } else {
      return [
        podcastName_,
        podcastDescription_,
        podcastAuthor_,
        podcastEmail_,
        podcastCategory_,
        podcastCover_,
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
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      setImg(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const [showCrop, setShowCrop] = useState(false);

  // handleShowUpload();

  return (
    <div className="text-zinc-400 h-full">
      <UploadsList t={t} />
      {showCrop ? (
        <div
          className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-md`}
        >
          <div
            className={`relative w-[800px] h-[400px] rounded-[6px] overflow-hidden`}
          >
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
            <p
              className={`flex flex-col justify-center items-center text-white/60`}
            >
              Crop Selection
            </p>
            {/* <p className={`flex flex-col justify-center items-center`}></p> */}
          </div>
        </div>
      ) : (
        <></>
      )}
      <h1 className="text-2xl tracking-wider text-white">
        {t("uploadshow.title")}
      </h1>
      <div
        className="w-[100px] h-[30px] bg-white/50 rounded-md cursor-pointer"
        onClick={() => {
          payEthAndUpload();
        }}
      />
      {isLoading && <div>ETH TX sent</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}

      <div className="form-control">
        <form
          onSubmit={
            () => {}
            // handleShowUpload
          }
        >
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
          <div className="md:flex mt-7">
            <label
              htmlFor="podcastCover"
              className="cursor-pointer transition duration-300 ease-in-out hover:text-white flex md:block md:h-full w-48"
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
                    className="input input-secondary w-full bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                  <ValMsg 
                    valMsg={podNameMsg}
                    className="pl-2" 
                  />
                </div>
                <div className="mb-5">
                  <textarea
                    className="input input-secondary resize-none py-3 px-5 w-full h-[124px] bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                  <ValMsg 
                    valMsg={podDescMsg}
                    className="pl-2"
                  />
                </div>
              </div>
              <div className="mb-5">
                <input
                  className="input input-secondary w-1/2 py-3 px-5 bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  placeholder={t("uploadshow.author")}
                  name="podcastAuthor"
                  onChange={(e) => {
                    setPodAuthMsg(handleValMsg(e.target.value.length, "podAuthor"));
                    setPodcastAuthor_(e.target.value);
                  }}
                />
                <ValMsg 
                  valMsg={podAuthMsg}
                  className="pl-2"
                 />
              </div>
              <div className="mb-10 ">
                <input
                  className="input input-secondary w-1/2 py-3 px-5 bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  placeholder={t("uploadshow.email")}
                  type='email'
                  name="podcastEmail"
                  onChange={(e) => {
                    setPodEmailMsg(handleValMsg(e.target.value, "podEmail"));
                    setPodcastEmail_(e.target.value);
                  }}
                />
                <ValMsg 
                  valMsg={podEmailMsg}
                  className="pl-2"
                 />
              </div>
              <div className="mb-5">
                <select
                  className="select select-secondary w-1/2 py-3 px-5 font-light bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  id="podcastCategory"
                  name="category"
                  onChange={(e) => {
                    setPodcastCategory_(e.target.value);
                  }}
                >
                  {categoryOptions()}
                </select>
              </div>
              <div className="mb-5">
                <select
                  className="select select-secondary w-1/2 py-2 px-5 font-light	bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  id="podcastLanguage"
                  name="language"
                  onChange={(e) => {
                    setPodcastLanguage_(e.target.value);
                  }}
                >
                  {languageOptions()}
                </select>
              </div>
              <label className="flex mb-5 items-center">
                <input
                  id="podcastExplicit"
                  type="checkbox"
                  className="checkbox checkbox-ghost bg-yellow mr-2"
                  onChange={(e) => {
                    e.target.value === "on"
                      ? setPodcastExplicit_("yes")
                      : setPodcastExplicit_("no");
                  }}
                />
                <span className="label-text cursor-pointer">
                  {t("uploadshow.explicit")}
                </span>
              </label>
              <div className="flex items-center place-content-end pb-28">
                <div className="bg-zinc-800 rounded-lg px-4 py-[9px] mr-4">
                  {t("uploadshow.feetext")}
                  <span className="text-lg font-bold underline">
                    {1} USDC
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
                        onClick={() => {}}
                      >
                        {(eth && ar) ? t("uploadshow.upload"): t("uploadshow.disabled")}
                        <BsArrowRightShort className="w-7 h-7" />
                      </button>
                    )}
                  </>
                  <ValMsg 
                    valMsg={podSubmitMsg}
                    className="pl-2"
                  />
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
