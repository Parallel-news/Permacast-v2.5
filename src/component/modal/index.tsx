import { FC, ReactNode } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FADE_IN_STYLE, FADE_OUT_STYLE } from "../../constants";
import { containerPodcastModalStyling, tipModalStyling } from "../uploadEpisode/uploadEpisodeTools";
import { xMarkModalStyling } from "../tipModal";

interface ModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ isVisible, setIsVisible, children }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowModal(prev => !prev);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isVisible]);

  return (
    <div className={tipModalStyling + " backdrop-blur-sm"}>
      <div className={`${containerPodcastModalStyling + " justify-between relative overflow-hidden"} ${showModal ? FADE_IN_STYLE : FADE_OUT_STYLE}`}>
        <XMarkIcon className={xMarkModalStyling} onClick={() => setIsVisible(false)} />
        {children}
      </div>
    </div>
  );
};

export default Modal;