import { PASoMProfile } from "../../interfaces/pasom";
import { validateArweaveTX } from "./arweave";

export const PASOM_NICKNAME_MIN_LEN = 2;
export const PASOM_NICKNAME_MAX_LEN = 88;

export const PASOM_BIO_MIN_LEN = 0;
export const PASOM_BIO_MAX_LEN = 350;

export const PASOM_WEBSITE_MAX_LEN = 88;

export const PASOM_SUPPORTED_SOCIALS = [
  "twitter",
  "github",
  "telegram",
  "instagram",
  "discord"
];

//this is a lot of characters for a simple description and yet it's taking this many characters to truly express myself. oh man oh man oh man oh man this is a lot of characters for a simple description and yet it's taking this many characters to truly express myself. oh man oh man oh man oh man rjiwaorwairaiwjriawjrioawjrijaiwjriowjairiawjrijawrjwia
const validatePASoMForm = (PASoMProfile: PASoMProfile) => {
  const { nickname, bio, avatar, banner, websites, socials } = PASoMProfile;

  if (nickname && nickname?.length !== 0 && !(nickname.length >= PASOM_NICKNAME_MIN_LEN && nickname.length <= PASOM_NICKNAME_MAX_LEN)) return 'nickname';
  if (bio && bio?.length !== 0 && !(bio.length >= PASOM_BIO_MIN_LEN && bio.length <= PASOM_BIO_MAX_LEN)) return 'bio';
  if (banner && banner?.length !== 0 && !validateArweaveTX(banner)) return 'banner';
  if (avatar && avatar?.length !== 0 && !validateArweaveTX(avatar)) return 'avatar';
  // if (websites) {
  //   const uniqueWebs = [...new Set(websites)];
  //   for (const url of uniqueWebs) {
  //     _isValidUrl(url);
  //   }
  //   profile.websites = uniqueWebs;
  // }

  // if (socials) {
  //   for (const element of socials) {
  //     _isValidUrl(element.url);
  //   }
  //   profile.socials = socials;
  // };
  return false;
};

const _isValidUrl = (url: string) => {
  return /^(?:https?|ftp):\/\/[\w\-]+(?:\.[\w\-]+)+[\w\-\./\?\#\&\=\%]*$/.test(url);
};


export default validatePASoMForm;