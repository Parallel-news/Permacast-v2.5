import { createSignatureInterface } from "react-arconnect";
export type SignatureParams = {
  name: string;
  saltLength: number;
}

export type AuthenticationActions = {
  getPublicKey: () => void;
  //createSignature: (data: Uint8Array | null, params?: SignatureParams | null, encoding?: string | null) => Promise<string>;
  createSignature: createSignatureInterface;
}