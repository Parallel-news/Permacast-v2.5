import React, { FC, ReactNode, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icon } from "../icon";


export interface ModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children?: ReactNode;
};

const modalWrapperStyling = `absolute inset-0 bottom-0 flexFullCenter z-[60] h-full backdrop-blur-sm `;
const modalInnerStyling = `relative overflow-hidden `;
const FADE_OUT_STYLE = `opacity-0 default-animation `;
const FADE_IN_STYLE = `opacity-100 default-animation `;
const xMarkModalStyling = `h-7 w-7 cursor-pointer focus:text-red-400 focus:bg-red-400/10 hover:text-red-400 hover:bg-red-400/10 rounded-full z-30 absolute top-3 right-3 default-animation `;

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

  const fadeStyling = showModal ? FADE_IN_STYLE : FADE_OUT_STYLE;

  return (
    <div className={modalWrapperStyling}>
      <div className={modalInnerStyling + fadeStyling + className}>
        <button className={xMarkModalStyling} onClick={() => setIsVisible(false)}>
          <Icon icon="XMARK" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;