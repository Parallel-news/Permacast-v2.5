
type arseedTX = string;
type everpayFeeTX = string;

export interface EXMauth {
  jwk_n: string;
  sig: string;
};

export interface EpisodePayloadBase extends EXMauth {
  pid: string;
  name: string;
  desc: arseedTX,
  txid: everpayFeeTX,
  isVisible: boolean;
  thumbnail: arseedTX,
  content: arseedTX,
  mimeType: string,
};

export interface UploadEpisode extends EpisodePayloadBase {
  function: "addEpisode";
}

export interface EditEpisode extends EpisodePayloadBase {
  function: "editEpisodeMetadata";
  eid: string;
}