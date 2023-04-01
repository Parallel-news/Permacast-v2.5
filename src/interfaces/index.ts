export type arweaveAddress = string;
export type signature = string;
export type URL = string;
export type chainName = string;
export type chainTicker = string;
export type tx = string;
export type arweaveTX = string;

export interface EXMState {
  podcasts:              Podcast[];
  admins:                string[];
  isPaused:              boolean;
  user_sig_messages:     signature[];
  admin_sig_messages:    signature[];
  stores:                string[];
  fees_handler_endpoint: URL;
  fees_networks:         chainName[];
  supported_tokens:      chainTicker[];
  ar_molecule_endpoint:  URL;
  paid_fees:             tx[];
  signatures:            signature[];
}

export interface EXMDevState {
  podcasts:              Podcast[];
  admins:                string[];
  isPaused:              boolean;
  user_sig_messages:     signature[];
  admin_sig_messages:    signature[];
  stores:                string[];
  fees_handler_endpoint: URL;
  fees_networks:         chainName[];
  supported_tokens:      chainTicker[];
  ar_molecule_endpoint:  URL;
  paid_fees:             tx[];
  signatures:            signature[];
}

export interface Podcast {
  pid:         string;
  label:       string;
  contentType: string;
  createdAt:   number;
  owner:       string;
  podcastName: string;
  author:      string;
  email:       string;
  description: arweaveTX; // markdown file tx on arseeding
  language:    string;
  explicit:    string;
  categories:  string[];
  maintainers: string[];
  cover:       arweaveTX;
  isVisible:   boolean;
  episodes:    Episode[];
  minifiedCover: arweaveTX;
}

//! deprecated
export interface PodcastDev extends Podcast {};

export interface Episode {
  eid:         string;
  episodeName: string;
  description: string;
  contentTx:   arweaveTX;
  size:        number;
  type:        string;
  uploader:    string;
  uploadedAt:  number;
  isVisible?:   boolean;
  order?:      number; // UI only
}

export interface FullEpisodeInfo {
  episode: Episode,
  podcast: Podcast,
};

export interface Ans {
  ANSuserExists?: boolean; // only on UI
  userIsAddress?: boolean; // only on UI
  user:           string;
  currentLabel:   string;
  ownedLabels:    OwnedLabel[];
  nickname:       string;
  address_color:  string;
  bio:            string;
  avatar:         string;
  links:          Links;
  subdomains:     any;
  freeSubdomains: number;
}

export interface Links {
  github?:    string;
  twitter?:   string;
  customUrl?: string;
  instagram?: string;
}

export interface OwnedLabel {
  label:            string;
  scarcity:         string;
  acquisationBlock: number;
  mintedFor:        number;
}
