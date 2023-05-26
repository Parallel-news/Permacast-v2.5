// TODO: add types for all functions
// TODO: convert this into a folder
// TODO: collect all type files in this folder


// !This file is for all base Permacast functions

export type arseedTX = string;
export type everpayFeeTX = string;

// 128-character hex string
export type PID = string;

export interface EXMauth {
  jwk_n: string;
  sig: string;
};

export interface EXMBase extends EXMauth {
  parsed?: boolean; // for parsing received data into JSON
};

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
  txid: everpayFeeTX;
  isVisible: boolean;
};

export interface UploadPodcastProps extends EXMPodcastPayloadBase {
  function: "createPodcast";
};

export interface EditPodcastProps extends EXMPodcastPayloadBase {
  pid: PID;
  function: "editPodcastMetadata";
};

export interface EpisodePayloadBase extends EXMBase {
  pid: string;
  name: string;
  desc: arseedTX,
  txid: everpayFeeTX,
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
  eid: string;
};