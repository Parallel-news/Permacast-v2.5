

import Image from 'next/image'
import { useRef, useState } from 'react'
import { useArconnect } from 'react-arconnect'
import { useTranslation } from 'react-i18next'

import { ARSEED_URL, ERROR_TOAST_TIME, EXTENDED_TOAST_TIME, PERMACAST_TELEGRAM_URL, PERMA_TOAST_SETTINGS, POLYSCAN_LINK } from '../../../constants'
import { determineMintStatus, useCreateCollection, useMintEpisode } from '../api/get-nft-info'
import { PermaSpinner } from '../../../component/reusables'
import toast from 'react-hot-toast'
import { Dialog, Transition } from '@headlessui/react'

import { CreateCollectionViewObject, EpisodeTitleObject, ErrorModalObject, MintEpisodeViewObject, NftModalObject } from '../types'
import { isERCAddress } from '@/utils/reusables'

import { Icon } from '@/component/icon'
import ModalShell from '@/component/modalShell'
import { PermaSpinner } from '@/component/reusables'

import { grabEpisodeData } from '../utils'

import { Icon } from '../../../component/icon'
import ModalShell from '../../../component/modalShell'
import Link from 'next/link'
import MintedNotification from './MintedNotification'
import { GenericNftButton } from './buttons'
import { determineMintStatus, useCreateCollection, useMintEpisode } from '../api/get-nft-info'

export default function NftModal({ pid, isOpen, setIsOpen }: NftModalObject) {

    const { t } = useTranslation();
    const { getPublicKey, createSignature } = useArconnect()

    const mintEpisodeMutation = useMintEpisode()
    const collectionMutation = useCreateCollection()

    const targetInputRef = useRef(null)
    const queryNftInfo = determineMintStatus({enabled: true, pid: pid})
    const payload = queryNftInfo?.data

    const [checkedEid, setCheckedEid] = useState([""])

    const collectionStyling = "flex flex-col items-center space-y-4"
    const xStyling = "text-white cursor-pointer h-6 absolute right-4 top-2"
    const modalContainer = "w-full max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-800 p-10 text-left align-middle shadow-xl transition-all relative min-h-[200px] flex flex-col justify-center items-center"
    const targetInputStyle = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-700 border-0 rounded-md outline-none focus:ring-2 focus:ring-inset focus:ring-white"

    // Handlers 
    async function handleEpisodeMint() {
      const targetAddr = targetInputRef.current.value;
      // Real Target Address?
      if(!isERCAddress(targetAddr)) {
        toast.error(t("invalid-address"), PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
        targetInputRef.current.className = "border-2 border-red-300 focus:ring-0 "+targetInputStyle;
        return false
      }
      const toastLoading = toast.loading(t("nft-collection.minting-episode"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME))
      // Post Mint Data
      mintEpisodeMutation.mutate({
        eid: checkedEid[0],
        target: targetAddr,
        getPublicKey: getPublicKey,
        createSignature: createSignature
      },

      {
        onSuccess: async () => {
          setTimeout(async () => {
            await queryNftInfo.refetch();
            toast.dismiss(toastLoading)
            const episode = grabEpisodeData(payload.episodes, checkedEid[0])
            toast.custom(() => (
              <MintedNotification
                thumbnail={!!episode?.thumbnail ? ARSEED_URL + episode?.thumbnail : ARSEED_URL + payload.cover}
                primaryMsg={t("nft-collection.mint-successful")}
                secondaryMsg={episode.episodeName}
              />
            ))
          }, 8000);
        }
      })
  }

  async function handleCollectionCreation() {
    const toastLoading = toast.loading(t("nft-collection.uploading-collection"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME))
    await collectionMutation.mutate({
      pid: pid,
      getPublicKey: getPublicKey,
      createSignature: createSignature
    },
      {
        onSuccess: async () => {
          setTimeout(async () => {
            toast.dismiss(toastLoading)
            await queryNftInfo.refetch();
            toast.custom(() => (
              <MintedNotification
                thumbnail={ARSEED_URL + payload.cover}
                primaryMsg={t("nft-collection.collection-uploaded")}
                secondaryMsg={payload.name}
              />
            ))
          }, 6000);
        }
      })
  }

  return (
    <>
      <ModalShell
        width="max-w-2xl"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <>
          <Icon className={xStyling} onClick={() => setIsOpen(false)} icon="XMARK" />
          {/*Views*/}
          {queryNftInfo.isLoading && (<PermaSpinner spinnerColor="#FFF" size={25} />)}

          {queryNftInfo.isError && (<p>{t("general-error")}</p>)}
          {/*

                No Claimable Factories

              */}
          {!queryNftInfo.isLoading && !payload.collectionAddr && !payload.claimableFactories && (
            <ErrorModalMessage
              helpSrc={PERMACAST_TELEGRAM_URL}
              primaryMsg={t("nft-collection.no-factories")} //
              secondaryMsg={t("nft-collection.no-factories-help")}
            />
          )}
          {/*

                Create Collection - Step 1

              */}
          {!queryNftInfo.isLoading && !payload.collectionAddr && payload.claimableFactories && (
            <div className={collectionStyling}>
              <CreateCollectionView showPic={ARSEED_URL + payload.cover} showTitle={payload?.name} />
              <GenericNftButton
                text={t("uploadshow.upload")}
                onClick={() => handleCollectionCreation()}
              />
            </div>
          )}
          {/*

          Mint Episode NFT - Step 2

          */}

          {!queryNftInfo.isLoading && payload.collectionAddr && payload.episodes.length > 0 && (
            <div className="flex flex-col w-full space-y-8">
              <MintEpisodeView
                episodes={payload.episodes}
                showName={payload.name}
                cover={payload.cover}
                setCheckedEid={setCheckedEid}
                checkedEid={checkedEid}
                collectionAddr={payload.collectionAddr}
              />
              {/*Input for Address*/}
              {!payload.allMinted && (
                <div className={"w-full mt-[20px]"}>
                  <input
                    type="text"
                    ref={targetInputRef}
                    className={targetInputStyle}
                    placeholder={t('nft-collection.target-address')}
                  />
                </div>
              )}
              {/*Mint Button*/}
              {!payload.allMinted && (
                <div className="flex flex-row w-full justify-end">
                  <GenericNftButton
                    text={t("nft-collection.mint")}
                    onClick={() => handleEpisodeMint()}
                    disabled={payload.allMinted || checkedEid[0].length === 0}
                  />
                </div>
              )}
            </div>
          )}
          {/*

                No Episode Found

              */}
          {!queryNftInfo.isLoading && payload.collectionAddr && payload.episodes.length === 0 && (
            <ErrorModalMessage
              helpSrc={`/upload-episode?pid=${pid}`}
              primaryMsg={t("nft-collection.no-episodes")}
              secondaryMsg={t("nft-collection.click-to-make")}
            />
          )}
        </>
      </ModalShell>
    </>
  )
}

export const CreateCollectionView = ({ showPic, showTitle }: CreateCollectionViewObject) => {

  const { t } = useTranslation();

  const firstRowStyle = "flex flex-col md:flex-row justify-around items-center space-y-4 w-full space-x-2"
  const textStyle = "text-2xl text-white text-center"

  return (
    <div className={firstRowStyle}>
      <Image
        src={showPic}
        alt="Podcast Logo"
        height={100}
        width={100}
        className="rounded-3xl"
      />
      <p className={textStyle}>
        {t("nft-collection.confirm-msg")}
        <Image
          src="/polygon_logo.svg"
          alt="Polygon Logo"
          height={45}
          width={45}
          className="inline p-0 m-0"
        />{t("nft-collection.for")}
        <span className="font-bold"> {showTitle}</span>
      </p>
    </div>
  )
}

export const MintEpisodeView = ({ episodes, showName, cover, setCheckedEid, checkedEid, collectionAddr }: MintEpisodeViewObject) => {

  const { t } = useTranslation();

  const episodeRow = "w-full flex justify-between items-center"
  const episodeContainer = "bg-zinc-700 rounded-md w-full p-4 space-y-2"
  const titleStyling = "flex justify-between items-center w-full text-white text-2xl mb-6"
  const checkBoxStyling = "form-checkbox accent-[#FFFF00] bg-zinc-800 rounded-xl inline w-5 h-5"

  const handleCheckboxChange = (itemId) => {
    if (itemId !== checkedEid[0]) {
      setCheckedEid([itemId])
    } else {
      setCheckedEid([''])
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className={titleStyling}>
        <p>{t('nft-collection.mint-for')} <span className="font-bold">{showName}</span></p>
        <Link href={`${POLYSCAN_LINK}${collectionAddr}`}>
          <Image 
            src="/polygon_logo.svg"
            alt="Polygon Icon"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className={episodeContainer}>
        {episodes.map((episode, index) => (
          <div className={episodeRow} key={index}>
            <EpisodeName
              episodeName={episode.episodeName}
              thumbnail={!!episode?.thumbnail ? ARSEED_URL + episode.thumbnail : ARSEED_URL + cover}
            />
            <label className="inline items-center" key={episode.eid}>
              {episode.minted ?
                <input type="checkbox" className={checkBoxStyling} checked disabled />
                :
                <input type="checkbox" className={checkBoxStyling}
                  onChange={() => handleCheckboxChange(episode.eid)} checked={checkedEid[0] === episode.eid}
                />
              }
            </label>
          </div>
        ))}

      </div>
    </div>
  )
}

export const ErrorModalMessage = ({ helpSrc, primaryMsg, secondaryMsg }: ErrorModalObject) => {

  const linkStyling = "text-white hover:text-[#FFFF00] transform transition-all duration-500 text-xl"
  const containerStyling = "flex flex-col space-y-6 justify-center items-center font-semibold text-2xl"

  return (
    <div className={containerStyling}>
      <p className="text-white">{primaryMsg}</p>
      <a href={helpSrc} className={linkStyling}>{secondaryMsg}</a>
    </div>
  )
}

export const EpisodeName = ({ episodeName, thumbnail }: EpisodeTitleObject) => {

  const textStyling = "text-white text-lg line-clamp-1"
  const containerStyling = "flex items-center space-x-4 w-fit inline"

  return (
    <div className={containerStyling}>
      <Image
        src={thumbnail}
        alt="Episode Thumbnail"
        height={45}
        width={45}
        className="rounded-xl"
      />
      <p className={textStyling}>{episodeName}</p>
    </div>
  )
}
