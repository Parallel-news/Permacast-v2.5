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

  const [contentType_, setContentType_] = useRecoilState(ContentType);
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
    minifiedCover = await resizeFile(minifiedCover, 99);
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
      //@ts-ignore
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
    console.log(isSuccess)
    // @ts-ignore
    const signatureMethod = window?.arweaveWallet?.signature;
    // @ts-ignore
    const methods = window?.arweaveWallet?.getPermissions;

    async function fetchData() {
      //! do not remove this or upload fails
      console.log(await methods())
      const arconnectPubKey = localStorage.getItem("userPubKey")
      if (!arconnectPubKey) throw new Error("ArConnect public key not found");
      // console.log(arconnectPubKey)
      const data = new TextEncoder().encode(
        `my Arweave PK for Permacast is ${arconnectPubKey}`
      );

      const signature = await signatureMethod(data, {
        name: "RSA-PSS",
        saltLength: 32,
      });
      const signedBase = Buffer.from(signature).toString("base64");
      handleExm(signedBase)
    }

    if (isSuccess) {
      try {
        fetchData()
      } catch {
        setIsUploading(false)
      }
    }
    if (error) setIsUploading(false);
  }, [isSuccess, data, error, isLoading]);

  const handleExm = async (signedBase: string) => {
    if (!data) throw new Error("Tx failed");
    const userSignature = signedBase;
    const arconnectPubKey = localStorage.getItem("userPubKey")
    if (!userSignature) throw new Error("ArConnect signature not found");
    if (!arconnectPubKey) throw new Error("ArConnect public key not found");
    
    // @ts-ignore
    const hash = data?.hash
    const showObj = {
      function: "createPodcast",
      name: podcastName_,
      desc: podcastDescription_,
      author: podcastAuthor_,
      lang: podcastLanguage_,
      isExplicit: podcastExplicit_ ? "yes" : "no",
      categories: podcastCategory_,
      email: podcastEmail_,
      contentType: contentType_, // v for video and a for audio
      minifiedCover: podcastMinifiedCoverTX,
      cover: podcastCoverTX,
      master_network: "EVM",
      network: "ethereum",
      token: "ETH",
      label: null, // TODO implement later
      jwk_n: arconnectPubKey,
      txid: hash,
      sig: userSignature
    };
  
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
  const handleValMsg = (input: string, type: string) => {
    switch(type) {
      case 'podName':
        if((input.length > PODCAST_NAME_MAX_LEN || input.length < PODCAST_NAME_MIN_LEN)) {
          return t("uploadshow.validation.name", {minLength: PODCAST_NAME_MIN_LEN, maxLength: PODCAST_NAME_MAX_LEN});
        } else {
          return "";
        }
      case 'podDesc':
        if((input.length > PODCAST_DESC_MAX_LEN || input.length < PODCAST_DESC_MIN_LEN)) {
          return t("uploadshow.validation.description", {minLength: PODCAST_DESC_MIN_LEN, maxLength: PODCAST_DESC_MAX_LEN});
        } else {
          return "";
        }
      case 'podAuthor':
        if((input.length > PODCAST_AUTHOR_MAX_LEN || input.length < PODCAST_AUTHOR_MIN_LEN)) {
          return t("uploadshow.validation.author", {minLength: PODCAST_AUTHOR_MIN_LEN, maxLength: PODCAST_AUTHOR_MAX_LEN});
        } else {
          return "";
        }
      case 'podEmail':
        if(isValidEmail(input)) {
          return "";
        } else {
          return t("uploadshow.validation.email");
        }
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
              {/* @ts-ignore */}
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
                      setPodNameMsg(handleValMsg(e.target.value, "podName"));
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
                    title="Between 10 and 15000 characters"
                    name="podcastDescription"
                    required
                    onChange={(e) => {
                      setPodDescMsg(handleValMsg(e.target.value, "podDesc"));
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
                    setPodAuthMsg(handleValMsg(e.target.value, "podAuthor"));
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
              <div className="flex mb-5 items-center">
                <label className="flex items-center mr-5">
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
                <label className="flex items-center label">
                  <div className="mr-2 cursor-pointer label-text">
                    {t("uploadshow.contentvideo")}
                  </div>
                  <input type="checkbox" className="toggle" checked={contentType_ === "a" ? true: false}
                    onChange={() => setContentType_(contentType_ === "a" ? "v": "a")}
                  />
                  {/* // onChange={() => contentType_ === "a" ? "v": "a"}> */}
                  <div className="ml-2 cursor-pointer label-text">
                    {t("uploadshow.contentaudio")}
                  </div>
                </label>

              </div>
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
                        <div className="animate-spin border-t-3 rounded-t-full border-yellow-100 h-5 w-5 mr-3"></div>
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
