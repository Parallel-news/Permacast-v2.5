import { useTranslation } from "next-i18next";
import { FC } from "react";
import { Modal, ModalProps } from "../reusables";


const WalletNotDetectedModal: FC<ModalProps> = ({ isVisible, setIsVisible, className }) => {
  const { t } = useTranslation();
  
  return (
    <Modal {...{ isVisible, setIsVisible, className }}>
      <div>
        {t("wallet.modal.not-detected")}
      </div>
    </Modal>
  );
};

export default WalletNotDetectedModal;
