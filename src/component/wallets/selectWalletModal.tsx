import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import { Modal, ModalProps, ThemedButton } from "../reusables";
import { useRecoilState } from "recoil";
import { selectedWalletAtom } from "../../atoms";
import { ConnectArconnect } from "./arconnect";
import { Icon } from "../icon";


const SelectWalletModal: FC<ModalProps> = ({ isVisible, setIsVisible, className }) => {
  const [selectedWallet, setSelectedWallet] = useRecoilState(selectedWalletAtom);

  return (
    <Modal {...{ isVisible, setIsVisible, className }}>
      <div className="mt-6 flexColCenter gap-y-8 justify-center h-full">
        <div className="text-center">
          <ConnectArconnect className="text-xl" />
        </div>
        <div className="text-center">
          <button onClick={() => setSelectedWallet("metamask")}>
            <div className="text-4xl">🦊</div>
            <p>MetaMask</p>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const SelectWalletButton: FC = ({  }) => {

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