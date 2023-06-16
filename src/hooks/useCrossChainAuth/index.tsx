import { useArconnect, defaultSignatureParams } from "react-arconnect";
import { useRecoilState } from "recoil";

import { selectedProviderAtom } from "@/atoms/index";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "@/constants/arconnect";
  
// payload is the data that needs to be wrapped and returned with the needed auth info
const packageEXMArconnect = async (payload: any, sigMessage: string) => {
  const { createSignature, getPublicKey } = useArconnect();

  const msgToEncode = new TextEncoder().encode(sigMessage);
  const newPayload = { ...payload };
  newPayload.sig = String(await createSignature(msgToEncode, defaultSignatureParams, "base64"));
  newPayload.jwk_n = await getPublicKey();

  return newPayload;
};

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
  // const { address, walletConnected, createSignature, getPublickKey } = useEth();  
  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

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
      connect: async () => {},
      packageEXM: async () => {},
      createSignature: async () => {},
      getPublicKey: async () => {},  
    },
  };

  return providers[selectedProvider];
};

export default useCrossChainAuth;