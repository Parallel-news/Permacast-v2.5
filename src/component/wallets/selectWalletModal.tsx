import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import { useRecoilState } from "recoil";

import { selectedProviderAtom } from "@/atoms/index";

import { Modal, ModalProps, ThemedButton } from "@/component/reusables";
import { Icon } from "@/component/icon";

import { ConnectArconnect } from "./arconnect";


const SelectWalletModal: FC<ModalProps> = ({ isVisible, setIsVisible, className }) => {
  const [selectedProvider, setSelectedProvider] = useRecoilState(selectedProviderAtom);

  return (
    <Modal {...{ isVisible, setIsVisible, className }}>
      <div className="mt-6 flexColFullCenter gap-y-8 h-full">
        <div className="text-center">
          <ConnectArconnect className="text-xl" />
        </div>
        <div className="text-center">
          <button onClick={() => setSelectedProvider("rainbowkit")}>
            <div className="text-4xl">🌈</div>
            <p>Metamask and More...</p>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const SelectWalletButton = () => {

  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const className = `flexCol bg-zinc-800 rounded-3xl z-10 mb-0 w-[300px] sm:w-[500px] lg:w-[500px] `;

  const SelectWalletText: FC = () => (
    <div>
      <Icon className='text-inherit w-4 h-4' icon="WALLET"/>
    </div>
  );

  return (
    <>
      <ThemedButton onClick={() => setIsVisible(true)}>
        <SelectWalletText />
      </ThemedButton>
      {isVisible && <SelectWalletModal {...{ isVisible, setIsVisible, className }} />}
    </>
  );
};

export default SelectWalletModal;