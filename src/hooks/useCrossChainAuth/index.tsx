import { useArconnect, defaultSignatureParams } from "react-arconnect";
import { useRecoilState } from "recoil";

import { selectedProviderAtom } from "@/atoms/index";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "@/constants/arconnect";

const useCrossChainAuth = () => {
  const [selectedProvider] = useRecoilState(selectedProviderAtom);

  const {
    address: ArconnectAddress,
    ANS: ArconnectANS,
    walletConnected: ArconnectWalletConnected,
    arconnectConnect,
    createSignature: ArconnectCreateSignature,
    getPublicKey: ArconnectGetPublicKey,
  } = useArconnect();

  // rainbowkit comes here

  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

  const packageEXMArconnect = async (payload: any, sigMessage: string) => {
    const msgToEncode = new TextEncoder().encode(sigMessage);
    const newPayload = { ...payload };
    newPayload.sig = String(await ArconnectCreateSignature(msgToEncode, defaultSignatureParams, "base64"));
    newPayload.jwk_n = await ArconnectGetPublicKey();
    return newPayload;
  };

  const providers = {
    arconnect: {
      address: ArconnectAddress,
      nameService: ArconnectANS,
      walletConnected: ArconnectWalletConnected,
      connect,
      packageEXM: packageEXMArconnect,
      createSignature: ArconnectCreateSignature,
      getPublicKey: ArconnectGetPublicKey,
    },
    rainbowkit: {
      address: '0xComeBackLater!',
      nameService: ArconnectANS,
      walletConnected: false,
      connect,
      packageEXM: packageEXMArconnect,
      createSignature: ArconnectCreateSignature,
      getPublicKey: ArconnectGetPublicKey,
    },
  };

  const selectedProviderData = providers[selectedProvider];

  return selectedProviderData;
};

export default useCrossChainAuth;