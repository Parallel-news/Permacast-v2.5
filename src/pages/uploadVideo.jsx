import ArDB from "ardb";
import Swal from "sweetalert2";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiFile } from "react-icons/fi";
import { appContext } from "../utils/initStateGen";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Modal from "../component/reusables/modal";
import {
  processFile,
  userHasEnoughAR,
  fetchWalletAddress,
  calculateStorageFee,
} from "../utils/shorthands.js";
import {
  arweave,
  smartweave,
  NFT_SRC,
  CONTRACT_SRC,
  FEE_MULTIPLIER,
  VERTO_CONTRACT,
  TREASURY_ADDRESS,
  EPISODE_UPLOAD_FEE_PERCENTAGE,
} from "../utils/arweave.js";

const ardb = new ArDB(arweave);

export default function UploadVideo({ podcast }) {
  const { t } = useTranslation();
  const appState = useContext(appContext);
  const { isOpen, setIsOpen } = appState.globalModal;
  const [videoFileName, setVideoFileName] = useState(null);
  const [videoUploadFee, setVideoUploadFee] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadPercentComplete, setUploadPercentComplete] = useState(0);

  const listVideoOnVerto = async (videoId) => {
    const vertoContractId = VERTO_CONTRACT;
    const input = {
      function: "list",
      id: videoId,
      type: "art",
    };
    const contract = smartweave.contract(vertoContractId).connect("use_wallet");
    await contract.writeInteraction(input);
  };

  const uploadVideoToArweave = async (
    data,
    fileType,
    vidObj,
    event,
    serviceFee
  ) => {
    const wallet = await fetchWalletAddress(); // window.arweaveWallet.getActiveAddress();
    console.log(wallet);
    if (!wallet) {
      return null;
    } else {
      const tx = await arweave.createTransaction({ data: data });
      const initState = `{"issuer": "${wallet}","owner": "${wallet}","name": "${vidObj.name}","ticker": "PANFT","description": "Permacast Video from ${vidObj.name}","thumbnail": "${podcast.cover}","balances": {"${wallet}": 1}}`;
      tx.addTag("Content-Type", fileType);
      tx.addTag("App-Name", "SmartWeaveContract");
      tx.addTag("App-Version", "0.3.0");
      tx.addTag("Contract-Src", NFT_SRC);
      tx.addTag("Init-State", initState);
      tx.addTag("Permacast-Version", "amber");
      // Verto aNFT listing
      tx.addTag("Exchange", "Verto");
      tx.addTag("Action", "marketplace/create");
      tx.addTag("Thumbnail", podcast.cover);

      tx.reward = (+tx.reward * FEE_MULTIPLIER).toString();

      await arweave.transactions.sign(tx);
      console.log("signed tx", tx);
      const uploader = await arweave.transactions.getUploader(tx);

      while (!uploader.isComplete) {
        await uploader.uploadChunk();

        setUploadProgress(true);
        setUploadPercentComplete(uploader.pctComplete);
      }
      if (uploader.txPosted) {
        const newTx = await arweave.createTransaction({
          target: TREASURY_ADDRESS,
          quantity: arweave.ar.arToWinston("" + serviceFee),
        });
        console.log(newTx);
        await arweave.transactions.sign(newTx);
        console.log(newTx);
        await arweave.transactions.post(newTx);
        console.log(newTx.response);
        vidObj.content = tx.id;

        console.log("txPosted:");
        console.log(vidObj);
        uploadShow(vidObj);
        event.target.reset();
        setIsOpen(false);
        Swal.fire({
          title: t("uploadepisode.swal.uploadcomplete.title"),
          text: t("uploadepisode.swal.uploadcomplete.text"),
          icon: "success",
          customClass: "font-mono",
        });
        setVideoUploadFee(null);
      } else {
        Swal.fire({
          title: t("uploadepisode.swal.uploadfailed.title"),
          text: t("uploadepisode.swal.uploadfailed.text"),
          icon: "error",
          customClass: "font-mono",
        });
      }
    }
  };

  const handleVideoUpload = async (event) => {
    setVideoUploading(true);
    Swal.fire({
      title: t("uploadepisode.swal.upload.title"),
      text: t("uploadepisode.swal.upload.text"),
      customClass: "font-mono",
    });
    let vidObj = {};
    event.preventDefault();

    vidObj.name = event.target.videoName.value;
    vidObj.desc = event.target.videoShowNotes.value;
    vidObj.index = podcast.index;
    vidObj.verto = event.target.verto.checked;
    let videoFile = event.target.videoMedia.files[0];
    let fileType = videoFile.type;
    console.log(fileType);
    processFile(videoFile).then((file) => {
      let vidObjSize = JSON.stringify(vidObj).length;
      let bytes = file.byteLength + vidObjSize + fileType.length;
      calculateStorageFee(bytes).then((cost) => {
        const serviceFee = cost / EPISODE_UPLOAD_FEE_PERCENTAGE;
        userHasEnoughAR(t, bytes, serviceFee).then((result) => {
          if (result === "all good") {
            console.log("Fee cost: " + serviceFee);
            uploadVideoToArweave(file, fileType, vidObj, event, serviceFee);
          } else console.log("upload failed");
        });
      });
    });
    setVideoUploading(false);
  };

  const getSwcId = async () => {
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
    let addr = await window.arweaveWallet.getActiveAddress(); //await getAddrRetry()
    if (!addr) {
      await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);
      addr = await window.arweaveWallet.getActiveAddress();
    }
    const tx = await ardb
      .search("transactions")
      .from(addr)
      .tag("App-Name", "SmartWeaveContract")
      .tag("Permacast-Version", "amber")
      .tag("Contract-Src", CONTRACT_SRC)
      .find();

    if (!tx || tx.length === 0) {
      Swal.fire({
        title:
          "Insuffucient balance or Arweave gateways are unstable. Please try again later",
        customClass: "font-mono",
      });
    } else {
      console.log("tx", tx);
      return tx[0].id;
    }
  };

  const uploadShow = async (show) => {
    const theContractId = await getSwcId();
    console.log("theContractId", theContractId);
    console.log("show", show);
    let input = {
      function: "addVideo",
      pid: podcast.pid,
      name: show.name,
      desc: true,
      content: show.content,
    };

    console.log(input);
    const contract = podcast?.newChildOf ? podcast.newChildOf : podcast.childOf;
    console.log("CONTRACT CHILDOF");
    console.log(contract);
    let tags = {
      Contract: contract,
      "App-Name": "SmartWeaveAction",
      "App-Version": "0.3.0",
      "Content-Type": "text/plain",
      Input: JSON.stringify(input),
      "Permacast-Version": "amber",
    };
    // let contract = smartweave.contract(theContractId).connect("use_wallet");
    // let txId = await contract.writeInteraction(input, tags);
    const interaction = await arweave.createTransaction({ data: show.desc });

    for (let key in tags) {
      interaction.addTag(key, tags[key]);
    }

    interaction.reward = (+interaction.reward * FEE_MULTIPLIER).toString();

    await arweave.transactions.sign(interaction);
    await arweave.transactions.post(interaction);
    console.log("addVideo txid:");
    console.log(interaction.id);
    if (show.verto) {
      console.log("pushing to Verto");
      await listVideoOnVerto(interaction.id);
    } else {
      console.log("skipping Verto");
    }
  };

  const onFileUpload = async (file) => {
    if (file) {
      setVideoFileName(file?.name);
      const uploadPrice = await calculateStorageFee(file?.byteLength);
      const serviceFee = uploadPrice / EPISODE_UPLOAD_FEE_PERCENTAGE;
      const totalFee = uploadPrice + serviceFee;
      setVideoUploadFee(totalFee);
    }
  };

  return (
    <Modal>
      <div className="bg-zinc-900" data-theme="permacast">
        <div className="relative mt-6 mb-3">
          <div className="font-semibold select-none">
            {/* {t("uploadepisode.title")} */}
            Add new video
          </div>
          <div
            className="absolute text-2xl right-10 top-[-6px] w-10 h-10 rounded-lg border-2 border-transparent hover:border-gray-100 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            ×
          </div>
        </div>
        <div className="flex items-center justify-center flex-col rounded-xl">
          <div className="py-6 px-10 w-full form-control">
            <form className="" onSubmit={handleVideoUpload}>
              <div className="mb-5">
                <input
                  className="input input-secondary w-full py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  required
                  pattern=".{3,500}"
                  title="Between 3 and 500 characters"
                  type="text"
                  name="videoName"
                  // placeholder={t("uploadepisode.name")}
                  placeholder={"Video name"}
                />
              </div>
              <div className="mb-5">
                <textarea
                  className="input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  required
                  pattern=".{1,5000}"
                  title="Between 1 and 5000 characters"
                  type="text"
                  name="videoShowNotes"
                  placeholder={"Video description"}
                  // placeholder={t("uploadepisode.description")}
                ></textarea>
              </div>
              <div className="mb-5 bg-zinc-800 rounded-xl cursor-pointer">
                <input
                  className="opacity-0 absolute z-[-1]"
                  id="file"
                  required
                  type="file"
                  onChange={(e) => onFileUpload(e.target.files?.[0])}
                  name="videoMedia"
                />
                <label
                  htmlFor="file"
                  className="flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-4 py-6 px-3 w-full cursor-pointer"
                >
                  <FiFile className="w-7 h-6 cursor-pointer rounded-lg mx-2" />
                  <div>
                    {/* {videoFileName ? videoFileName : t("uploadepisode.file")} */}
                    {videoFileName ? videoFileName : "Video media"}
                  </div>
                </label>
              </div>
              {uploadProgress && (
                <>
                  <div className="text-xl text-white">
                    {t("uploadepisode.uploaded")}
                  </div>
                  <progress
                    className="progress-primary mt-3"
                    value={uploadPercentComplete}
                    max="100"
                  ></progress>
                </>
              )}
              <div className="bg-zinc-700 rounded-lg p-4">
                {t("uploadshow.feetext")}
                <span className="text-lg font-bold underline">
                  {videoUploadFee.toFixed(3)} AR
                </span>
              </div>
              {videoUploadFee ? (
                <div className="w-80">
                  <p className="text-gray py-3">
                    {videoUploadFee} {t("uploadepisode.toupload")}
                  </p>
                  <div className="bg-zinc-800 rounded-lg w-full">
                    {t("uploadepisode.feetext")}
                    <span className="text-lg font-bold underline">
                      {(videoUploadFee / EPISODE_UPLOAD_FEE_PERCENTAGE).toFixed(
                        3
                      )}{" "}
                      AR
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="mt-8 flex items-center justify-between text-zinc-200">
                <label className="cursor-pointer label flex justify-start">
                  <input
                    className="checkbox checkbox-primary mx-2"
                    type="checkbox"
                    id="verto"
                  />
                  <span className="label-text transition duration-300 ease-in-out hover:text-white">
                    {t("uploadepisode.verto")}
                  </span>
                </label>
                {!videoUploading ? (
                  <button
                    className="btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
                    type="submit"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                    {t("uploadepisode.upload")}
                  </button>
                ) : (
                  <button
                    className="btn btn-outline rounded-xl"
                    disabled
                    type="submit"
                  >
                    {t("uploadepisode.uploading")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
