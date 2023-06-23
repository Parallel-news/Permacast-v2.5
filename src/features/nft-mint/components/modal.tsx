
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { ARSEED_URL, ERROR_TOAST_TIME, EXTENDED_TOAST_TIME, MODAL_TOAST_SETTINGS, PERMACAST_TELEGRAM_URL, PERMA_TOAST_SETTINGS, POLYSCAN_LINK } from '@/constants/index'
import useCrossChainAuth from '@/hooks/useCrossChainAuth'
import { generateAuthentication, isERCAddress } from '@/utils/reusables'
import { CreateCollectionViewObject, EpisodeTitleObject, ErrorModalObject, MintEpisodeViewObject, NftModalObject } from '../types'
import { determineMintStatus, useBatchMint, useCreateCollection, useMintEpisode } from '../api/get-nft-info'
import { grabEpisodeData } from '../utils'
import { PermaSpinner } from '@/component/reusables'
import { Icon } from '@/component/icon'
import MintedNotification from './MintedNotification'
import { GenericNftButton } from './buttons'
import ModalShell from '@/component/modalShell'


export default function NftModal({ pid, isOpen, setIsOpen }: NftModalObject) {

  const { t } = useTranslation();
  const { getPublicKey, createSignature } = useCrossChainAuth();

  const mintEpisodeMutation = useMintEpisode()
  const mintBatchMutation = useBatchMint()
  const collectionMutation = useCreateCollection()

  const targetInputRef = useRef(null)
  const queryNftInfo = determineMintStatus({ enabled: true, pid: pid })
  const payload = queryNftInfo?.data

  const [checkedEid, setCheckedEid] = useState([])

  const collectionStyling = "flexColYCenter space-y-4"
  const xStyling = "text-white cursor-pointer h-6 absolute right-2 top-2"
  const modalContainer = "w-full max-w-2xl overflow-hidden rounded-2xl bg-zinc-800 p-10 text-left align-middle shadow-xl relative min-h-[200px] flexColFullCenter default-animation "
  const targetInputStyle = "w-full py-3 pl-5 pr-10 bg-zinc-700 border-0 rounded-md outline-none focus:ring-2 focus:ring-inset focus:ring-white default-animation"

  // Handlers 
  async function handleEpisodeMint() {
    const targetAddr = targetInputRef.current.value;
    // Real Target Address?
    if (!isERCAddress(targetAddr)) {
      toast.error(t("invalid-address"), PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
      targetInputRef.current.className = "border-2 border-red-300 focus:ring-0 " + targetInputStyle;
      return false
    }

    const toastLoading = toast.loading(t("nft-collection.minting-episode"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME))
    // Loop Mint Data
    
    checkedEid.map(async (eid) => {
      const { sig, jwk_n } = await generateAuthentication({getPublicKey, createSignature})
      mintEpisodeMutation.mutate({
        eid: eid,
        target: targetAddr,
        jwk_n: jwk_n,
        sig: sig
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
    })
  }

  async function handleBatchMint() {
    const targetAddr = targetInputRef.current.value;
    // Real Target Address?
    if (!isERCAddress(targetAddr)) {
      toast.error(t("invalid-address"), MODAL_TOAST_SETTINGS(ERROR_TOAST_TIME))
      targetInputRef.current.className = "border-2 border-red-300 focus:ring-0 " + targetInputStyle;
      return false
    }

    const toastLoading = toast.loading(t("nft-collection.minting-episode"), MODAL_TOAST_SETTINGS(EXTENDED_TOAST_TIME))

    const eidPayload = checkedEid.map((eid) => ({ eid, target: targetAddr }));

    const { sig, jwk_n } = await generateAuthentication({getPublicKey, createSignature})

    mintBatchMutation.mutate({
      payload: eidPayload,
      jwk_n: jwk_n,
      sig: sig
    },
    {
      onSuccess: async () => {
        setTimeout(async () => {
          await queryNftInfo.refetch();
          toast.dismiss(toastLoading)
          toast.success(t("nft-collection.mint-successful"), MODAL_TOAST_SETTINGS(ERROR_TOAST_TIME))
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


  // todo: if possible, rewrite the component to use our custom modal (it does a nice blur effect)
  // <Modal
  //   isVisible={isOpen}
  //   setIsVisible={setIsOpen}
  //   className="md:max-h-[600px] md:w-[600px] overflow-y-scroll bg-zinc-800 px-10 py-8 rounded-xl "
  // >

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
                    onClick={() => handleBatchMint()}
                    disabled={payload.allMinted || checkedEid.length === 0}
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

  const [uploadAll, setUploadAll] = useState(false)

  const episodeRow = "w-full flexBetween items-center"
  const episodeContainer = "bg-zinc-700 rounded-md w-full p-4 space-y-2 max-h-[300px] overflow-y-scroll"
  const titleStyling = "flexBetween items-center w-full text-white text-2xl mb-2"
  const checkBoxStyling = "form-checkbox accent-[#FFFF00] bg-zinc-800 rounded-xl inline w-5 h-5"

  const handleSingleCheckboxChange = (itemId) => {
    if (itemId !== checkedEid[0]) {
      setCheckedEid([itemId])
    } else {
      setCheckedEid([''])
    }
  };

  const handleMultiCheckboxChange = (itemId) => {
    if (!checkedEid.includes(itemId)) {
      setCheckedEid(prevState => [...prevState, itemId])
    } else {
      setCheckedEid(prevState => prevState.filter(item => item !== itemId));
      setUploadAll(false)
    }
  };

  const handleSelectAllEpisodes = () => {
    setUploadAll(prev => !prev)
    if(!uploadAll) { //Logic inversed since state set doesnt immediately take effect
      const remainingEids = episodes
        .filter((itemId) => !itemId.minted && !checkedEid.includes(itemId.eid))
        .map((itemId) => itemId.eid)
      setCheckedEid(prevState => [...prevState, ...remainingEids])
    } else {
      setCheckedEid([])
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className={titleStyling}>
        <div className="flex flex-row space-x-2 items-center">
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
        <div className="space-x-2 pr-4 items-center flex flex-row text-base">
          <p>All</p>
          <input type="checkbox" className={checkBoxStyling}
            onChange={() => handleSelectAllEpisodes()} checked={uploadAll}
          />
        </div>
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
                  onChange={() => handleMultiCheckboxChange(episode.eid)} checked={checkedEid.includes(episode.eid)}
                />
              }
            </label>
          </div>
        ))}

      </div>
    </div>
  )
}
//checked={checkedEid[0] === episode.eid}
export const ErrorModalMessage = ({ helpSrc, primaryMsg, secondaryMsg }: ErrorModalObject) => {

  const linkStyling = "text-white hover:text-[#FFFF00] default-animation text-xl"
  const containerStyling = "flexColFullCenter space-y-6 font-semibold text-2xl"

  return (
    <div className={containerStyling}>
      <p className="text-white">{primaryMsg}</p>
      <a href={helpSrc} className={linkStyling}>{secondaryMsg}</a>
    </div>
  )
}

export const EpisodeName = ({ episodeName, thumbnail }: EpisodeTitleObject) => {

  const textStyling = "text-white text-lg line-clamp-1"
  const containerStyling = "flexYCenterGapX gap-x-4 "

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
