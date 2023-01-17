// import ArDB from "ardb";
import Swal from "sweetalert2";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiFile } from "react-icons/fi";
import { appContext } from "../utils/initStateGen";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Modal from "../component/reusables/modal";
import {
  processFile,
} from "../utils/shorthands.js";

// const ardb = new ArDB(arweave);

export default function UploadVideo() {
  const { t } = useTranslation();
  const appState = useContext(appContext);
  const { isOpen, setIsOpen } = appState.globalModal;
  const [videoFileName, setVideoFileName] = useState(null);
  const [videoUploadFee, setVideoUploadFee] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadPercentComplete, setUploadPercentComplete] = useState(0);

  const handleVideoUpload = async () => {}

  const onFileUpload = async (file) => {
    if (file) {}
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
