import { React, useState, useRef, useContext, useCallback } from "react";
import ArDB from "ardb";
import { appContext } from "../utils/initStateGen";
import { BsArrowRightShort } from "react-icons/bs";
import {
  CONTRACT_SRC,
  FEE_MULTIPLIER,
  SHOW_UPLOAD_FEE,
  arweave,
  deployContract,
  queryTXsByAddress,
  compoundTreasury,
  TREASURY_ADDRESS,
} from "../utils/arweave";
import LANGUAGES from "../utils/languages";
import {
  processFile,
  userHasEnoughAR,
  fetchWalletAddress,
  calculateStorageFee,
} from "../utils/shorthands";
import ArConnect from "../component/arconnect";
import { PhotoIcon } from "@heroicons/react/24/outline";

import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { UploadsList } from "../component/uploads_list";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ContentType, uploadPercent } from "../atoms";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/croppedImage";

const ardb = new ArDB(arweave);

export default function UploadPodcastView() {
  const appState = useContext(appContext);
  // remove state from here
  const [show, setShow] = useState(false);
  const [img, setImg] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [cost, setCost] = useState(0);
  const isLoggedIn = appState.user.address;
  let finalShowObj = {};
  const [contentType_, setContentType_] = useRecoilState(ContentType)
  const podcastCoverRef = useRef();
  const { t, i18n } = useTranslation();
  const currentLanguage = LANGUAGES.find(
    (language) => i18n.language === language.code
  );
  const languages = currentLanguage?.languages || [];
  const categories = currentLanguage?.categories || [];

  const setPercent = useSetRecoilState(uploadPercent);

  const uploadShow = async (show) => {
    Swal.fire({
      title: t("uploadshow.swal.uploading.title"),
      timer: 2000,
      customClass: "font-mono",
    });
    let contractId;

    let addr = await fetchWalletAddress();
    console.log("ADDRESSS");
    console.log(addr);
    const tx = await queryTXsByAddress(addr);

    console.log(tx);
    if (tx.length !== 0) {
      contractId = tx[0].id;
    }
    if (!contractId) {
      console.log("not contractId - deploying new contract");
      contractId = await deployContract(addr);
    }
    let input = {
      function: "createPodcast",
      name: show.name,
      contentType: "a",
      cover: show.cover,
      lang: show.lang,
      isExplicit: show.isExplicit,
      author: show.author,
      categories: show.category,
      email: show.email,
    };

    console.log(input);
    console.log("CONTRACT ID:");
    console.log(contractId);

    let tags = {
      Contract: contractId,
      "App-Name": "SmartWeaveAction",
      "App-Version": "0.3.0",
      "Content-Type": "text/plain",
      Input: JSON.stringify(input),
    };

    const interaction = await arweave.createTransaction({ data: show.desc });

    for (const key in tags) {
      interaction.addTag(key, tags[key]);
    }

    interaction.reward = (+interaction.reward * FEE_MULTIPLIER).toString();
    await arweave.transactions.sign(interaction);
    await arweave.transactions.post(interaction);
    if (interaction.id) {
      Swal.fire({
        title: t("uploadshow.swal.showadded.title"),
        text: t("uploadshow.swal.showadded.text"),
        icon: "success",
        customClass: "font-mono",
      });
      console.log("INTERACTION.ID");
      console.log(interaction.id);
    } else {
      alert("An error occured.");
    }
  };

  const uploadToArweave = async (data, fileType, showObj) => {
    console.log("made it here, data is");
    console.log(data);
    arweave.createTransaction({ data: data }).then((tx) => {
      tx.addTag("Content-Type", fileType);
      tx.reward = (+tx.reward * FEE_MULTIPLIER).toString();
      console.log("created");
      arweave.transactions.sign(tx).then(() => {
        console.log("signed");
        // arweave.transactions.post(tx).then((response) => {
        //   console.log(response)
        //   if (response.statusText === "OK") {
        //     // compoundTreasury(SHOW_UPLOAD_FEE) // TODO TEST
        //     arweave.createTransaction({target: TREASURY_ADDRESS, quantity: arweave.ar.arToWinston('' + SHOW_UPLOAD_FEE)}).then((tx) => {
        //       arweave.transactions.sign(tx).then(() => {
        //         arweave.transactions.post(tx).then((response) => {
        //           console.log(response)
        //           setIsUploading(false)
        //         })
        //       })
        //     })
        //     showObj.cover = tx.id
        //     finalShowObj = showObj;
        //     console.log(finalShowObj)
        //     uploadShow(finalShowObj)
        //     setShow(false)
        //   } else {
        //     Swal.fire({
        //       title: t("uploadshow.swal.uploadfailed.title"),
        //       text: t("uploadshow.swal.uploadfailed.text"),
        //       icon: 'danger',
        //       customClass: "font-mono",
        //     })
        //   }
        // });
        arweave.transactions
          .getUploader(tx)
          .then((uploader) => {
            while (!uploader.isComplete) {
              uploader.uploadChunk().then(() => {
                setPercent(uploader.pctComplete);
                console.log(uploader.pctComplete); //pass uploader.pctComplete to a UI element to show progress
              });
            }
          })
          .finally(() => {
            arweave.transactions.getStatus(tx).then((res) => {
              console.log(res);
              if (res.status === 200) {
                // compoundTreasury(SHOW_UPLOAD_FEE) // TODO TEST
                arweave
                  .createTransaction({
                    target: TREASURY_ADDRESS,
                    quantity: arweave.ar.arToWinston("" + SHOW_UPLOAD_FEE),
                  })
                  .then((tx) => {
                    arweave.transactions.sign(tx).then(() => {
                      arweave.transactions.post(tx).then((response) => {
                        console.log(response);
                        setIsUploading(false);
                      });
                    });
                  });
                showObj.cover = tx.id;
                finalShowObj = showObj;
                console.log(finalShowObj);
                uploadShow(finalShowObj);
                setShow(false);
              } else {
                Swal.fire({
                  title: t("uploadshow.swal.uploadfailed.title"),
                  text: t("uploadshow.swal.uploadfailed.text"),
                  icon: "danger",
                  customClass: "font-mono",
                });
              }
            });
          });
      });
    });
  };

  const isPodcastCoverSquared = (event) => {
    if (event.target.files.length !== 0) {
      const podcastCoverImage = new Image();
      podcastCoverImage.src = window.URL.createObjectURL(event.target.files[0]);
      podcastCoverImage.onload = () => {
        calculateStorageFee(event.target.files[0].size).then((fee) => {
          setCost(fee);
        });
        if (podcastCoverImage.width !== podcastCoverImage.height) {
          // podcastCoverRef.current.value = "";
          // Swal.fire({
          //   text: t("uploadshow.swal.reset.text"),
          //   icon: "warning",
          //   confirmButtonText: "Continue",
          //   customClass: "font-mono",
          // });
          setInputImg(URL.createObjectURL(event.target.files[0]))
          setShowCrop(true)
        } else {
          setImg(URL.createObjectURL(event.target.files[0]));
        }
      };
    }
  };

  const handleShowUpload = async (event) => {

    const arconnectPubKey = await window.arweaveWallet.getActivePublicKey();  
      if (!arconnectPubKey) throw new Error("ArConnect public key not found");

      const data = new TextEncoder().encode(`my pubkey for DL ARK is: ${arconnectPubKey}`);
      const signature = await window.arweaveWallet.signature(data, {
        name: "RSA-PSS",
        saltLength: 32,
      });
      // const signedBase = Buffer.from(signature).toString("base64");
      // console.log("signedBase", signedBase);
      // if (!signedBase) throw new Error("ArConnect signature not found");
      // console.log(arconnectPubKey)
      console.log(signature)
    //   event.preventDefault();
    // // extract attrs from form
    // const showObj = {};
    // const podcastName = event.target.podcastName.value;
    // const podcastDescription = event.target.podcastDescription.value;
    // const podcastCover = event.target.podcastCover.files[0];
    // const podcastAuthor = event.target.podcastAuthor.value;
    // const podcastEmail = event.target.podcastEmail.value;
    // const podcastCategory = event.target.podcastCategory.value;
    // const podcastExplicit = event.target.podcastExplicit.checked ? "yes" : "no";
    // const podcastLanguage = event.target.podcastLanguage.value;
    // const coverFileType = podcastCover.type;
    // // add attrs to input for SWC

    // showObj.function = "createPodcast";
    // showObj.name = podcastName;
    // showObj.desc = podcastDescription;
    // showObj.author = podcastAuthor;
    // showObj.lang = podcastLanguage;
    // showObj.isExplicit = podcastExplicit;
    // showObj.categories = podcastCategory;
    // showObj.email = podcastEmail;
    // showObj.contentType = contentType_; // v for video and a for audio
    // showObj.cover = podcastCover; // must have "image/*" MIME type
    // showObj.master_network = "EVM"; // currently constant
    // showObj.network = "ethereum"; // currently constant
    // showObj.token = "eth"; // currently constant
    // showObj.label = "test"; // check N.B
    // showObj.jwk_n = arconnectPubKey;
    // showObj.txid = $PAYMENT_TXID; // check N.B
    // showObj.sig = signature // check N.B

    // // upload cover, send all to Arweave
    // let cover = await processFile(podcastCover);
    // let showObjSize = JSON.stringify(showObj).length;
    // let bytes = cover.byteLength + showObjSize + coverFileType.length;
    // setIsUploading(true);
    // if ((await userHasEnoughAR(t, bytes, SHOW_UPLOAD_FEE)) === "all good") {
    //   await uploadToArweave(cover, coverFileType, showObj);
    // } else {
    //   console.log("upload failed");
    //   setIsUploading(false);
    // }
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

  const handleChangeImage = (e) => {
    isPodcastCoverSquared(e);
  };

  const [inputImg, setInputImg] =
    useState("https://repository-images.githubusercontent.com/438897789/72714beb-d2b9-46e0-ad82-b03ddc78083f");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

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
      setImg(croppedImage)
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const [showCrop, setShowCrop] = useState(false)

  handleShowUpload()

  return (
    <div className="text-zinc-400 h-full">
      <UploadsList t={t} />
      {
        showCrop
        ?
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
        <div className={`min-w-[50px] min-h-[10px] rounded-[4px] bg-black/10 hover:bg-black/20 border-[1px] border-solid border-white/10 m-2 p-1 px-2 cursor-pointer flex flex-col justify-center items-center`} onClick={() => {
          showCroppedImage()
          setShowCrop(false)
        }}>
        <p className={`flex flex-col justify-center items-center text-white/60`}>Crop Selection</p>
        {/* <p className={`flex flex-col justify-center items-center`}></p> */}
      </div>
      </div>
      :
      <></>
}
      <h1 className="text-2xl tracking-wider text-white">
        {t("uploadshow.title")}
      </h1>
      <div className="form-control">
        <form onSubmit={handleShowUpload}>
          <input
            required
            type="file"
            accept="image/*"
            className="opacity-0 z-index-[-1] absolute cursor-pointer"
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
              <div className="h-48 mb-10">
                <div className="mb-5">
                  <input
                    className="input input-secondary w-full bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    placeholder={t("uploadshow.name")}
                    pattern=".{2,500}"
                    title="Between 2 and 500 characters"
                    type="text"
                    name="podcastName"
                    required
                  />
                </div>
                <div>
                  <textarea
                    className="input input-secondary resize-none py-3 px-5 w-full h-[124px] bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    placeholder={t("uploadshow.description")}
                    pattern=".{10,15000}"
                    title="Between 10 and 15000 characters"
                    name="podcastDescription"
                    required
                  />
                </div>
              </div>
              <div className="mb-5">
                <input
                  className="input input-secondary w-1/2 py-3 px-5 bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  placeholder={t("uploadshow.author")}
                  name="podcastAuthor"
                />
              </div>
              <div className="mb-10 ">
                <input
                  className="input input-secondary w-1/2 py-3 px-5 bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  placeholder="Email..."
                  type={t("uploadshow.email")}
                  name="podcastEmail"
                />
              </div>
              <div className="mb-5">
                <select
                  className="select select-secondary w-1/2 py-3 px-5 font-light bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  id="podcastCategory"
                  name="category"
                >
                  {categoryOptions()}
                </select>
              </div>
              <div className="mb-5">
                <select
                  className="select select-secondary w-1/2 py-3 px-5 font-light	bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  id="podcastLanguage"
                  name="language"
                >
                  {languageOptions()}
                </select>
              </div>
              <label className="flex mb-5 items-center">
                <input
                  id="podcastExplicit"
                  type="checkbox"
                  className="checkbox checkbox-ghost bg-yellow mr-2"
                />
                <span className="label-text cursor-pointer">
                  {t("uploadshow.explicit")}
                </span>
              </label>
              <div className="flex items-center place-content-end pb-28">
                <div className="bg-zinc-800 rounded-lg px-4 py-[9px] mr-4">
                  {t("uploadshow.feetext")}
                  <span className="text-lg font-bold underline">
                    {(SHOW_UPLOAD_FEE + cost).toFixed(3)} AR
                  </span>
                </div>
                {isLoggedIn ? (
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
                      <button type="submit" className="btn btn-secondary">
                        {t("uploadshow.upload")}
                        <BsArrowRightShort className="w-7 h-7" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-60">
                    <ArConnect />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
