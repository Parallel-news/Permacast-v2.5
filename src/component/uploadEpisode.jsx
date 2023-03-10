import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'next-i18next';
import { FiFile } from 'react-icons/fi';

import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import Modal from './reusables/modal';
import {
  processFile,
} from '../utils/shorthands.js';

import { CheckAuthHook } from "../utils/ui";
import { globalModalOpen } from '../atoms';


// THIS IS A MODAL
// DON'T BE FOOLED

export default function UploadEpisode({ podcast }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useRecoilState(globalModalOpen);
  const [episodeFileName, setEpisodeFileName] = useState(null);
  const [episodeUploadFee, setEpisodeUploadFee] = useState(0)
  const [episodeUploading, setEpisodeUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(false)
  const [uploadPercentComplete, setUploadPercentComplete] = useState(0)
  const [eth, ar] = CheckAuthHook();

  const listEpisodeOnVerto = async (episodeId) => {
  }

  const uploadEpisodeToArweave = async (data, fileType, epObj, event, serviceFee) => {

  };
  const handleEpisodeUpload = async (event) => {
  }


  const getSwcId = async () => {
  }

  const uploadShow = async (show) => {
  }

  const onFileUpload = async(file) => {
    if (file) {
      setEpisodeFileName(file?.name);
      console.log(episodeFileName);
      //const uploadPrice = await calculateStorageFee(file?.byteLength);
      //const serviceFee = uploadPrice / EPISODE_UPLOAD_FEE_PERCENTAGE;
      //const totalFee = uploadPrice + serviceFee
      //setEpisodeUploadFee(totalFee)
    }
  }

  return (
    <Modal>
      <div className="bg-zinc-900" data-theme="permacast">
        <div className="relative mt-6 mb-3">
          <div className="font-semibold select-none">
            {t("uploadepisode.title")}
          </div>
          <div className="absolute text-2xl right-10 top-[-6px] w-10 h-10 rounded-lg border-2 border-transparent hover:border-gray-100 cursor-pointer" onClick={() => setIsOpen(false)}>
            ??
          </div>
        </div>
        <div className="flex items-center justify-center flex-col rounded-xl">
          <div className="py-6 px-10 w-full form-control">
            <form className="" onSubmit={handleEpisodeUpload}>
              <div className="mb-5">
                <input className="input input-secondary w-full py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white" required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="episodeName" placeholder={t("uploadepisode.name")} />
              </div>
              <div className="mb-5">
                <textarea className="input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white" required pattern=".{1,5000}" title="Between 1 and 5000 characters" type="text" name="episodeShowNotes" placeholder={t("uploadepisode.description")}></textarea>
              </div>
              <div className="mb-5 bg-zinc-800 rounded-xl cursor-pointer">
                <input className="opacity-0 absolute z-[-1]" id="file" required type="file" onChange={(e) => onFileUpload(e.target.files?.[0])} name="episodeMedia" />
                <label htmlFor="file" className="flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-4 py-6 px-3 w-full cursor-pointer">
                  <FiFile className="w-7 h-6 cursor-pointer rounded-lg mx-2" />
                  <div>
                    {episodeFileName ? episodeFileName : t("uploadepisode.file")}
                  </div>
                </label>
              </div>
              {uploadProgress && (
                <>
                  <div className="text-xl text-white">{t("uploadepisode.uploaded")}</div>
                  <progress className="progress-primary mt-3" value={uploadPercentComplete} max="100"></progress>
                </>
              )}
              <div className="bg-zinc-700 rounded-lg p-4">
                {t("uploadshow.feetext")}
                <span className="text-lg font-bold underline">{(episodeUploadFee).toFixed(3)} AR</span>
              </div>
              {episodeUploadFee ? (
                <div className="w-80">
                  <p className="text-gray py-3">{episodeUploadFee} {t("uploadepisode.toupload")}</p>
                  <div className="bg-zinc-800 rounded-lg w-full">
                    {t("uploadepisode.feetext")}
                    <span className="text-lg font-bold underline">
                      {(episodeUploadFee / EPISODE_UPLOAD_FEE_PERCENTAGE).toFixed(3)} AR
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="mt-8 flex items-center justify-between text-zinc-200">
                <label className="cursor-pointer label flex justify-start">
                  <input className="checkbox checkbox-primary mx-2" type="checkbox" id="verto" />
                  <span className="label-text transition duration-300 ease-in-out hover:text-white">{t("uploadepisode.verto")}</span>
                </label>
                {!episodeUploading ?
                  <button
                    className="btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
                    disabled={!(eth && ar)}
                    type="submit"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                    {!(eth && ar) ? t("uploadepisode.upload"): t("uploadshow.disabled")}
                  </button>
                  :
                  <button
                    className="btn btn-outline rounded-xl"
                    disabled
                    type="submit"
                  >
                    {t("uploadepisode.uploading")}
                  </button>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  )
}
