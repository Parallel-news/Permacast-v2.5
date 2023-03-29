import React, { useEffect, useState } from 'react'
import {TwitterShareButton, TelegramShareButton, FacebookShareButton} from 'react-share'
import Image from 'next/image'
import { containerPodcastModalStyling, tipModalStyling } from '../uploadEpisode/uploadEpisodeTools'
import { FADE_IN_STYLE, FADE_OUT_STYLE } from '../../constants'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { xMarkModalStyling } from '../tipModal'

interface ShareButtonsInter {
    url: string;
    title: string;
    isVisible: boolean;
    setVisible: (v: any) => void;
}

export const ShareButtons = (props: ShareButtonsInter) => {

    const height = 70
    const width = 70
    const [showModal, setShowModal] = useState<boolean>(false)
    const url = props.url
    const title = props.title
    // Show Modal Effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowModal(prev => !prev);
        }, 100);
     
        return () => {
            clearTimeout(timeoutId);
        };
    }, [props.isVisible])
    
    return (
        <div className={tipModalStyling+" backdrop-blur-sm"}>
            <div className={`${containerPodcastModalStyling+ " justify-start relative overflow-hidden"} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>
                <XMarkIcon className={xMarkModalStyling} onClick={() => props.setVisible(false)} /> 
                <div>
                    <p className="flex flex-row justify-center text-white text-3xl font-bold p-8 mb-[75px] bg-zinc-900">Share</p>
                </div>    
                <div className="flex flex-row justify-center space-x-12">
                    <TwitterShareButton url={url} title={title}>
                        <div className="bg-black rounded-full p-4">
                            <Image 
                                src="/twitter_bw.svg"
                                width={width}
                                height={height}
                                alt="Twitter Logo"
                                className="bg-white"
                            />
                        </div>
                    </TwitterShareButton>
                    <TelegramShareButton url={url} title={title}>
                        <div className="bg-black rounded-full p-4">
                            <Image 
                                src="/telegram_bw.svg"
                                width={width}
                                height={height}
                                alt="Telegram Logo"
                                className="bg-white"
                            />
                        </div>
                    </TelegramShareButton>
                    <FacebookShareButton url={url} title={title}>
                        <div className="bg-black rounded-full p-4">
                            <Image 
                                src="/facebook_bw.svg"
                                width={width}
                                height={height}
                                alt="Facebook Logo"
                                className="bg-white"
                            />
                        </div>
                    </FacebookShareButton>
                </div>
            </div>
        </div>
    )
}