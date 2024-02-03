import { useArconnect, defaultSignatureParams } from "react-arconnect";
import { useRecoilState } from "recoil";

import { selectedProviderAtom } from "@/atoms/index";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "@/constants/arconnect";
import useArconnectSignature from "../useArconnectSignature";

const useCrossChainAuth = () => {
  const [selectedProvider] = useRecoilState(selectedProviderAtom);
  const { createSignature: arconnectCreateSignature } = useArconnectSignature();

  const {
    address: ArconnectAddress,
    ANS: ArconnectANS,
    walletConnected: ArconnectWalletConnected,
    arconnectConnect,
    createSignature,
    getPublicKey: ArconnectGetPublicKey,
  } = useArconnect();

  // rainbowkit comes here

  const connect = async () => {
    arconnectConnect(
      PERMISSIONS,
      { name: APP_NAME, logo: APP_LOGO },
      { host: "arweave.net", port: 443, protocol: "https" },
      "arconnect"
    );
  };

  const packageMEMPayloadArconnect = async (payload: any) => {
    const { jwk_n, sig } = await arconnectCreateSignature();
    payload["jwk_n"] = jwk_n;
    payload["sig"] = sig;
    return payload;
  };

  const packageMEMPayloadEth = async () => "";

  const providers = {
    arconnect: {
      address: ArconnectAddress,
      nameService: ArconnectANS,
      walletConnected: ArconnectWalletConnected,
      connect,
      packageMEMPayload: packageMEMPayloadArconnect,
      createSignature: createSignature,
      getPublicKey: ArconnectGetPublicKey,
    },
    rainbowkit: {
      address: "0xComeBackLater!",
      nameService: ArconnectANS,
      walletConnected: false,
      connect,
      packageMEMPayload: packageMEMPayloadEth,
      createSignature: arconnectCreateSignature,
      getPublicKey: ArconnectGetPublicKey,
    },
  };

  const selectedProviderData = providers[selectedProvider];

  return selectedProviderData;
};

export default useCrossChainAuth;
