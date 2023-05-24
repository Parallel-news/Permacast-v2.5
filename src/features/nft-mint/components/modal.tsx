

import Image from 'next/image'
import { Fragment, useRef, useState } from 'react'
import { GenericNftButton } from './buttons'
import { useArconnect } from 'react-arconnect'
import { useTranslation } from 'react-i18next'
import { ARSEED_URL } from '../../../constants'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Dialog, Transition } from '@headlessui/react'
import { determineMintStatus } from '../api/get-nft-info'
import { PermaSpinner } from '../../../component/reusables'
import { CreateCollectionViewObject, EpisodeTitleObject, GetPid, MintEpisodeViewObject, NftModalObject } from '../types'
import { isERCAddress } from '../../../utils/reusables'
import toast from 'react-hot-toast'



export default function NftModal({ pid, isOpen, setIsOpen }: NftModalObject) {

    /**
     * Recoil Vars & React Query will be set to keep far from parent 
     * & API pull is not heavy
     */
    const { t } = useTranslation();
    const targetInputRef = useRef(null);
    const queryNftInfo = determineMintStatus({enabled: true, pid: pid})
    const payload = queryNftInfo?.data

    const [checkedEid, setCheckedEid] = useState([""])
    const [mintAll, setMintAll] = useState(false)

    console.log("Checked ID: ", checkedEid)

    /*
    if(!queryNftInfo.isLoading) {
        console.log(queryNftInfo.data)
    } else {
        console.log("Loading...")
    }
    */

    const collectionStyling = "flex flex-col items-center space-y-4"
    const xStyling = "text-white cursor-pointer h-6 absolute right-4 top-2"
    const modalContainer = "w-full max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-800 p-10 text-left align-middle shadow-xl transition-all relative min-h-[200px] flex justify-center items-center"
    const targetInputStyle = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-700 border-0 rounded-md outline-none focus:ring-2 focus:ring-inset focus:ring-white"

    async function handleEpisodeMint() {
      await queryNftInfo.refetch()
      const targetAddr = targetInputRef.current.value;
      // Real Target Address?
      if(!isERCAddress(targetAddr)) {
        toast.error("Invalid Address")
        targetInputRef.current.className = "border-2 border-red-300 focus:ring-0 "+targetInputStyle;
        return false
      }
      // Checkbox Selected?
      
      console.log("Done Fetching")
    }

    return (
        <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => !isOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  {/*Modal Container*/}
                  <Dialog.Panel className={modalContainer}>
                    <XMarkIcon className={xStyling} onClick={() => setIsOpen(false)}/>
                    {/*Views*/}
                    {queryNftInfo.isLoading && (<PermaSpinner spinnerColor="#FFF" size={25}/>)}

                    {queryNftInfo.isError && (<p>Error</p>)}

                    {/*

                      Create Collection

                    */}
                    {!queryNftInfo.isLoading && !payload.collectionAddr &&  (
                        <div className={collectionStyling}>
                            <CreateCollectionView showPic={ARSEED_URL+payload.cover} showTitle={payload?.name} />
                            <GenericNftButton 
                                text={t("uploadshow.upload")}
                                onClick={() => alert('hi')}
                            />
                        </div> 
                    )}
                    {/*

                      Mint Episode NFT

                    */}
                    {!queryNftInfo.isLoading && payload.collectionAddr && payload.episodes.length && (
                      <div className="flex flex-col w-full space-y-8">
                        <MintEpisodeView 
                          episodes={payload.episodes}
                          showName={payload.name}
                          cover={payload.cover}
                          setCheckedEid={setCheckedEid}
                          checkedEid={checkedEid}
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
                              onClick={() => {
                                handleEpisodeMint()
                              }}
                              disabled={payload.allMinted}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {/*
                      No Episode Found
                    */}
                    {!queryNftInfo.isLoading && payload.collectionAddr && payload.episodes.length === 0 && (
                      <NoEpisodesMessage pid={pid} />
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    )
}

export const CreateCollectionView = ({showPic, showTitle} : CreateCollectionViewObject) => {

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

export const MintEpisodeView = ({ episodes, showName, cover, setCheckedEid, checkedEid }: MintEpisodeViewObject) => {

  const { t } = useTranslation();

  const episodeRow = "w-full flex justify-between items-center"
  const episodeContainer = "bg-zinc-700 rounded-md w-full p-4 space-y-2"
  const titleStyling = "flex justify-start w-full text-white text-2xl mb-6"
  const checkBoxStyling = "form-checkbox accent-[#FFFF00] bg-zinc-800 rounded-xl inline w-5 h-5"

  const handleCheckboxChange = (event, itemId) => {
    const isChecked = event.target.checked;
    if(itemId !== checkedEid[0]) {
      setCheckedEid([itemId])
      console.log("First")
    } else {
      setCheckedEid([])
      console.log("Second")
    }
    
    // Perform any necessary logic based on the checkbox change
    //console.log(`Checkbox with id ${itemId} is now ${isChecked ? 'checked' : 'unchecked'}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className={titleStyling}>
        <p>{t('nft-collection.mint-for')} <span className="font-bold">{showName}</span></p>
      </div>
      <div className={episodeContainer}>
        {episodes.map((episode, index) => (
          <div className={episodeRow} key={index}>
            <EpisodeTitle 
              episodeName={episode.episodeName}
              thumbnail={episode?.thumbnail.length > 0 ? ARSEED_URL+episode?.thumbnail : ARSEED_URL+cover}
            />
            <label className="inline items-center" key={episode.eid}>
              {episode.minted ? 
                <input type="checkbox" className={checkBoxStyling} checked disabled /> 
              :
                <input type="checkbox" className={checkBoxStyling} 
                  onChange={(event) => handleCheckboxChange(event, episode.eid)} checked={checkedEid[0] === episode.eid}
                />
              }
            </label>
          </div>
        ))}

      </div>
    </div>
  )
}

export const NoEpisodesMessage = ({ pid }: GetPid) => {

  const { t } = useTranslation();
  
  const linkStyling = "text-white hover:text-[#FFFF00] transform transition-all duration-500 text-xl"
  const containerStyling = "flex flex-col space-y-6 justify-center items-center font-semibold text-2xl"

  return (
    <div className={containerStyling}>
      <p className="text-white">{t("nft-collection.no-episodes")}</p>
      <a href={`/upload-episode?pid=${pid}`} className={linkStyling}>{t("nft-collection.click-to-make")}</a>
    </div>
  )
}

export const EpisodeTitle = ({episodeName, thumbnail}: EpisodeTitleObject) => {

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


