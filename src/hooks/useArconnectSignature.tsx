import { defaultSignatureParams, useArconnect } from "react-arconnect";

export async function WrapIntoBase64(
  message: string,
  publicKey: string,
  sig: Uint8Array
) {
  const base64Message = btoa(message);
  const base64PublicKey = btoa(publicKey);
  const base64Signature = btoa(Buffer.from(sig).toString("base64"));

  const based64 = {
    jwk_n: base64PublicKey,
    message: base64Message,
    sig: base64Signature,
  };
  return based64;
}

export default function useArconnectSignature() {
  const { createSignature: whatever, getPublicKey } = useArconnect();

  const createSignature = async () => {
    const publicKey = await getPublicKey();
    const message = `my Arweave PK for Permacast is ${publicKey}`;
    const encodedMessage = new TextEncoder().encode(message);

    const sig = (await whatever(
      encodedMessage,
      defaultSignatureParams,
      "Uint8Array",
      "new"
    )) as Uint8Array;
    return WrapIntoBase64(message, publicKey, sig);
  };

  return { createSignature };
}
