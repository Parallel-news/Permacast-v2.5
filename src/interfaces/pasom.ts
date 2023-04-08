export type SupportedSocial = "twitter" | "github" | "telegram" | "instagram" | "discord";

export interface Social {
  platform: SupportedSocial;
  url: string;
};

export interface UserProfile {
  address: string;
  nickname: string;
  bio: string;
  avatar: string;
  banner: string;
  websites: string[];
  socials: Social[];
};

export interface updateWalletMetadata {
  function: "updateWalletMetadata";
  nickname?: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  websites?: string[];
  jwk_n: string;
  sig: string;
};