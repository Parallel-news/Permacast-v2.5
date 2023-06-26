import { createSignatureInterface } from "react-arconnect";
export type SignatureParams = {
  name: string;
  saltLength: number;
}

export type AuthenticationActions = {
  getPublicKey: () => void;
  createSignature: createSignatureInterface;
}