export const APP_NAME = "Permacast App";
// surprisingly ArConnect fetches the logo by itself from /public folder
export const APP_LOGO = "";

export type PermissionType =
  | "ACCESS_ADDRESS"
  | "ACCESS_PUBLIC_KEY"
  | "ACCESS_ALL_ADDRESSES"
  | "SIGN_TRANSACTION"
  | "ENCRYPT"
  | "DECRYPT"
  | "SIGNATURE"
  | "ACCESS_ARWEAVE_CONFIG"
  | "DISPATCH";

export const PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY',
  'ACCESS_ALL_ADDRESSES',
  'SIGN_TRANSACTION',
  'SIGNATURE',
];
