import { useTranslation } from "next-i18next";
import { FC } from "react";
import { Modal, ModalProps } from "../reusables";


const WalletNotDetectedModal: FC<ModalProps> = ({ isVisible, setIsVisible, className }) => {
  const { t } = useTranslation();
  const selectedWallet = "ArConnect";
  return (
    <Modal {...{ isVisible, setIsVisible, className }}>
      <h1 className="text-2xl text-white mt-3">
        {selectedWallet} {t("wallet.modal.not-detected")}
      </h1>
      <div className="mt-20 text-5xl">🦔</div>
      <div className="mt-10">
        {t("wallet.modal.download-wallet")} <a href={`https://beta.arconnect.io`}>{selectedWallet}</a>
      </div>
    </Modal>
  );
};

export default WalletNotDetectedModal;
