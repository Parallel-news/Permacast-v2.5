import { useTranslation } from "next-i18next";
import { useRecoilState } from "recoil";

import { selectWalletModalVisibilityAtom, selectedProviderAtom, walletNotDetectedModalVisibilityAtom } from "@/atoms/index";
import ArConnect from "./arconnect";
import Metamask from "./metamask";
import WalletNotDetectedModal from "./walletNotDetectedModal";
import SelectWalletModal from "./selectWalletModal";

const connectButtonStyling = `w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full flexFullCenter px-4 mx-auto default-no-outline-ringed default-animation z-0 `;

const WalletSelectorButton = () => {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useRecoilState(selectedProviderAtom);

  const [selectWalletModalVisibility, setSelectWalletModalVisibility] = useRecoilState<boolean>(selectWalletModalVisibilityAtom);
  const [walletNotDetectedModalVisibility, setWalletNotDetectedModalVisibility] = useRecoilState<boolean>(walletNotDetectedModalVisibilityAtom);

  const modalClasses = `flexCol items-center bg-zinc-800 rounded-3xl z-10 mb-0 w-[300px] sm:w-[500px] lg:w-[500px] h-[318px] `;

  const availableWallets = {
    "arconnect": <ArConnect />,
    // "metamask": <Metamask />
  };

  const SelectWalletModalArgs = { 
    isVisible: selectWalletModalVisibility,
    setIsVisible: setSelectWalletModalVisibility,
    className: modalClasses
  };

  const WalletNotDetectedModalArgs = {
    isVisible: walletNotDetectedModalVisibility,
    setIsVisible: setWalletNotDetectedModalVisibility,
    className: modalClasses
  };

  return (
    <>
      {selectWalletModalVisibility && <SelectWalletModal { ...SelectWalletModalArgs } />}
      {walletNotDetectedModalVisibility && <WalletNotDetectedModal { ...WalletNotDetectedModalArgs } />}
      {Object.keys(availableWallets).length > 1 && (
        <button className={connectButtonStyling} onClick={(() => setSelectWalletModalVisibility(true))}>
          {t("wallet.connect")}
        </button>
      )}
      {Object.keys(availableWallets).length === 1 && availableWallets[selectedProvider]}
    </>
  );
};

export default WalletSelectorButton;