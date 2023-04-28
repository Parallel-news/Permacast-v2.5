import { Ans, Episode, Podcast } from "../interfaces";

export const DEFAULT_BACKGROUND_COLOR = `rgb(16, 16, 18)`;
export const DEFAULT_PODCAST_COLOR = `rgb(0, 0, 0)`;
export const DEFAULT_THEME_COLOR = `rgb(255, 255, 0)`;

export const ANS_TEMPLATE: Ans = {
  user: '',
  avatar: '',
  currentLabel: '',
  address_color: '',
  nickname: '',
  bio: null,
  ownedLabels: [],
  links: {},
  subdomains: [],
  freeSubdomains: 0
};

export const CURRENT_PODCAST_TEMPLATE: Podcast = {
  pid: '',
  label: '',
  contentType: '',
  createdAt: 0,
  owner: '',
  podcastName: '',
  author: '',
  email: '',
  description: '',
  language: '',
  explicit: '',
  categories: [],
  maintainers: [],
  cover: '',
  isVisible: false,
  episodes: [],
  minifiedCover: '',
};

export const CURRENT_EPISODE_TEMPLATE: Episode = {
  eid: '',
  episodeName: '',
  description: '',
  contentTx: '',
  size: 0,
  type: '',
  uploader: '',
  uploadedAt: 0,
  isVisible: false,
};
