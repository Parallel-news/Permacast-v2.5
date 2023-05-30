import React, { useEffect, useState } from 'react'
import {TwitterShareButton, TelegramShareButton, FacebookShareButton} from 'react-share'
import Image from 'next/image'
import {  tipModalStyling } from '../uploadEpisode/uploadEpisodeTools'
import { containerPodcastModalStyling } from '../uploadEpisode/reusables'
import { FADE_IN_STYLE, FADE_OUT_STYLE } from '../../constants'
import { xMarkModalStyling } from '../tipModal'
import { useTranslation } from 'next-i18next'
import { Icon } from '../icon'

interface ShareButtonsInter {
    url: string;
    title: string;
    isVisible: boolean;
    setVisible: (v: any) => void;
}
const circleStyling = "bg-black rounded-full p-4"
const shareColStyling = "flex flex-row justify-center space-x-6 md:space-x-12 lg:space-x-24 px-2"
const titleStyling = "flex flex-row justify-center text-white text-3xl font-bold p-8 mb-[85px] bg-zinc-900"

export const ShareButtons = (props: ShareButtonsInter) => {
    const { t } = useTranslation();
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
                <Icon className={xMarkModalStyling} onClick={() => props.setVisible(false)} icon="XMARK"/> 
                <div>
                    <p className={titleStyling}>{t("share.share")}</p>
                </div>    
                <div className={shareColStyling}>
                    <TwitterShareButton url={url} title={title}>
                        <div className={circleStyling}> 
                            <div className="bg-black w-fit h-fit p-1">
                            <Image 
                                src="/twitterLogo.svg"
                                width={width}
                                height={height}
                                alt="Twitter Logo"
                                className="p-1"
                            />
                            </div>
                        </div>
                    </TwitterShareButton>
                    <TelegramShareButton url={url} title={title}>
                        <div className={circleStyling}>
                            <Image 
                                src="/telegramLogo.svg"
                                width={width}
                                height={height}
                                alt="Telegram Logo"
                                className="p-1"
                            />
                        </div>
                    </TelegramShareButton>
                    <FacebookShareButton url={url} title={title}>
                        <div className={circleStyling}>
                            <Image 
                                src="/facebookLogo.svg"
                                width={width}
                                height={height}
                                alt="Facebook Logo"
                                className="p-1"
                            />
                        </div>
                    </FacebookShareButton>
                </div>
            </div>
        </div>
    )
}