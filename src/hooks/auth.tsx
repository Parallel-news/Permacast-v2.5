import { useArconnect, defaultSignatureParams } from "react-arconnect";
import { useRecoilState } from "recoil";

import { selectedProviderAtom } from "@/atoms/index";

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
    createSignature: ArconnectCreateSignature,
    getPublicKey: ArconnectGetPublicKey,
  } = useArconnect();
  // const { address, walletConnected, createSignature, getPublickKey } = useEth();  

  const providers = {
    arconnect: {
      packageEXM: packageEXMArconnect,
      address: ArconnectAddress,
      nameService: ArconnectANS,
      walletConnected: ArconnectWalletConnected,
      createSignature: ArconnectCreateSignature,
      getPublicKey: ArconnectGetPublicKey,
    },
    rainbowkit: {
      packageEXM: async (sigMessage: string) => {
        return { sig: "", jwk_n: "" };
      },
      address: '0xComeBackLater!',
      nameService: ArconnectANS,
      walletConnected: false,
      createSignature: () => {},
      getPublicKey: () => {},  
    },
  };

  return providers[selectedProvider];
};

export default useCrossChainAuth;