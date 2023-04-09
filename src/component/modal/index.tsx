import { FC, ReactNode } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FADE_IN_STYLE, FADE_OUT_STYLE } from "../../constants";
import { tipModalStyling } from "../uploadEpisode/uploadEpisodeTools";
import { xMarkModalStyling } from "../tipModal";


interface ModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  className: string;
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ isVisible, setIsVisible, className, children }) => {
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
      <div className={className + ` justify-between relative overflow-hidden ` + (showModal ? FADE_IN_STYLE : FADE_OUT_STYLE)}>
        <button className={xMarkModalStyling} onClick={() => setIsVisible(false)}>
          <XMarkIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;