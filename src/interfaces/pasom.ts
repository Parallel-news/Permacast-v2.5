import { arweaveAddress } from ".";
import { EXMauth } from "./exm";

export type SupportedSocial = "twitter" | "github" | "telegram" | "instagram" | "discord";

export interface Social {
  platform: SupportedSocial;
  url: string;
};

export interface PASoMProfile {
  address?: string;
  nickname?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  websites?: string[];
  socials?: Social[];
  followers?: arweaveAddress[];
  followings?: arweaveAddress[];
};


export interface EXMBase extends EXMauth {}

export interface updateWalletMetadata extends EXMBase {
  function: "updateWalletMetadata";
  nickname?: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  websites?: string[];
};

export interface follow extends EXMBase {
  function: "follow";
  address: string;
};

export interface unfollow extends EXMBase {
  function: "unfollow";
  address: string;
};