import { arseedTX, arweaveAddress, everpayTX, signature } from ".";

// 128-character hex strings
export type PID = string;
export type EID = string;

// jwk_n 
export interface EXMauth {
  // 683-character-long public key
  jwk_n: string;
  sig: signature;
};

export interface EXMBase extends EXMauth {
  // for parsing received data into JSON
  parsed?: boolean;
};

// podcast upload / edit payloads
export interface EXMPodcastPayloadBase extends EXMBase {
  name: string;
  desc: arseedTX;
  author: string;
  lang: string;
  isExplicit: "yes" | "no";
  categories: string;
  email: string;
  cover: arseedTX;
  minifiedCover: arseedTX;
  label: string;
  txid: everpayTX;
  isVisible: boolean;
};

export interface UploadPodcastProps extends EXMPodcastPayloadBase {
  function: "createPodcast";
};

export interface EditPodcastProps extends EXMPodcastPayloadBase {
  pid: PID;
  function: "editPodcastMetadata";
};


// episode upload / edit payloads

export interface EpisodePayloadBase extends EXMBase {
  pid: PID;
  name: string;
  desc: arseedTX,
  txid: everpayTX,
  isVisible: boolean;
  thumbnail: arseedTX,
  content: arseedTX,
  mimeType: string,
};

export interface UploadEpisodeProps extends EpisodePayloadBase {
  function: "addEpisode";
};

export interface EditEpisodeProps extends EpisodePayloadBase {
  function: "editEpisodeMetadata";
  eid: EID;
};


// featured channel payload

export interface FeaturedChannel {
  pid: PID,
  payment_txid: everpayTX,
  paid_by: arweaveAddress,
  start: number,
  expiry: number
};

