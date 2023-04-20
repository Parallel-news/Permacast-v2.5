import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import WalletNotDetectedModal from "./walletNotDetectedModal";
import ArConnect from "./arconnect";
import { useRecoilState } from "recoil";
import { selectedWalletAtom } from "../../atoms";
import Metamask from "./metamask";
import SelectWalletModal from "./selectWalletModal";

const connectButtonStyling = `w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full items-center flex px-4 justify-center mx-auto default-no-outline-ringed default-animation z-0 `;

const WalletSelectorButton: FC = () => {
  const { t } = useTranslation();
  const [selectedWallet, setSelectedWallet] = useRecoilState(selectedWalletAtom);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const className = `flexCol bg-zinc-800 rounded-3xl z-10 mb-0 w-[300px] sm:w-[500px] lg:w-[500px] h-[518px] `;

  const availableWallets = {
    "arconnect": <ArConnect />,
    // "metamask": <Metamask />
  };

  return (
    <>
      {isVisible && <SelectWalletModal {...{ isVisible, setIsVisible, className }} />}

      {Object.keys(availableWallets).length !== 1 && (
        <button className={connectButtonStyling} onClick={(() => setIsVisible(true))}>{t("wallet.connect")}</button>
      )}
      {Object.keys(availableWallets).length === 1 && availableWallets[selectedWallet]}
    </>
  );
};

export default WalletSelectorButton;