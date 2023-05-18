

import Image from 'next/image'
import { Fragment } from 'react'
import { GenericNftButton } from './buttons'
import { useArconnect } from 'react-arconnect'
import { useTranslation } from 'react-i18next'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Dialog, Transition } from '@headlessui/react'
import { determineMintStatus } from '../api/get-nft-info'
import { CreateCollectionViewObject, NftModalObject } from '../types'
import { ARSEED_URL } from '../../../constants'
import { Episode } from '../../../interfaces'
import { PermaSpinner } from '../../../component/reusables'

export default function NftModal({ pid, isOpen, setIsOpen }: NftModalObject) {
    // Will call state variables
    //Be injected into each of these views
    /**
     * Recoil Vars & React Query will be set to keep far from parent 
     * & API pull is not heavy
     */
    const { t } = useTranslation();
    const queryNftInfo = determineMintStatus({enabled: true, pid: pid})
    const payload = queryNftInfo?.data
    if(!queryNftInfo.isLoading) {
        console.log(queryNftInfo.data)
    } else {
        console.log("Loading...")
    }

    const collectionStyling = "flex flex-col items-center space-y-4"
    const xStyling = "text-white cursor-pointer h-6 absolute right-4 top-2"
    const modalContainer = "w-full max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all relative min-h-[200px] flex justify-center items-center"
    
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

                    {/*Create Collection*/}
                    {!queryNftInfo.isLoading && !payload.collectionAddr &&  (
                        <div className={collectionStyling}>
                            <CreateCollectionView showPic={ARSEED_URL+payload.cover} showTitle={payload?.name} />
                            <GenericNftButton 
                                text={t("uploadshow.upload")}
                                onClick={() => alert('hi')}
                            />
                        </div> 
                    )}
                    {/*Mint Episode NFT*/}
                    {!queryNftInfo.isLoading && payload.collectionAddr && payload.episodes.length && (
                        <MintEpisodeView 
                          episodes={payload.episodes}
                        />
                    )}
                    {/*No Episode Found*/}
                    {!queryNftInfo.isLoading && payload.collectionAddr && payload.episodes.length === 0 && (
                      <NoEpisodesMessage />
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

type MintEpisodeViewObject = {
  episodes: Episode[]
}

export const MintEpisodeView = ({ episodes }: MintEpisodeViewObject) => {
  const r = episodes
  return (
    <div className="flex justify-start w-[50%] text-white">
      <p>Mint Episodes for <span className="font-bold">The Illiad</span></p>
    </div>
  )
  //target and eid are needed for submission
}

export const NoEpisodesMessage = () => {
  return (
    <div className="flex flex-col space-y-8 justify-center items-center min-h-[300px] text-white font-semibold">
      <p>No Episodes Have Been Made Yet!</p>
      <p>Make an episode and come back</p>
    </div>
  )
}

// UNDER CONSTRUCTION

//Build the view