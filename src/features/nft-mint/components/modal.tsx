

import Image from 'next/image'
import { Fragment } from 'react'
import { GenericNftButton } from './buttons'
import { useArconnect } from 'react-arconnect'
import { useTranslation } from 'react-i18next'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Dialog, Transition } from '@headlessui/react'
import { determineMintStatus } from '../api/get-nft-info'
import { CreateCollectionViewObject, NftModalObject } from '../types'

export default function NftModal({ pid, isOpen, setIsOpen }: NftModalObject) {
    // Will call state variables
    //Be injected into each of these views
    /**
     * Recoil Vars & React Query will be set to keep far from parent 
     * & API pull is not heavy
     */
    const { t } = useTranslation();
    const { address, getPublicKey, createSignature } = useArconnect();

    const queryNftInfo = determineMintStatus({enabled: true, pid: pid})
    if(!queryNftInfo.isLoading) {
        console.log(queryNftInfo.data)
    } else {
        console.log("Loading...")
    }

    //react query everything. We just need pid
    //function use react query here where loading will be placed and the modal will change based on what results are returned
    const collectionStyling = "flex flex-col items-center space-y-4"
    const xStyling = "text-white cursor-pointer h-6 absolute right-4 top-2"
    const modalContainer = "w-full max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-700 p-6 text-left align-middle shadow-xl transition-all relative"
    
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

                    {queryNftInfo.isLoading && (<p>Loading</p>)}

                    {queryNftInfo.isError && (<p>Error</p>)}

                    {!queryNftInfo.isLoading && !queryNftInfo.data.collectionAddr &&  (
                        <div className={collectionStyling}>
                            {`Data: ${queryNftInfo.data}    `}
                            <CreateCollectionView showPic="/logo512.png" showTitle="The Boob" />
                            <GenericNftButton 
                                text={t("uploadshow.upload")}
                                onClick={() => alert('hi')}
                            />
                        </div> 
                    )}
                    {!queryNftInfo.isLoading && queryNftInfo.data.collectionAddr &&  (
                        <p>step 2</p>
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

    const firstRowStyle = "flex flex-col md:flex-row justify-around items-center space-y-4 w-full"
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

// UNDER CONSTRUCTION
// Integrate the state variables to take the name of the show
// Build the view that will show the episodes
// Build the check if minted collection function --> Test between the two shows to see if the modal is showing the right version