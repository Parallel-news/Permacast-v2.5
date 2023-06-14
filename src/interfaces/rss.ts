export interface rssEpisode {
  description: string;
  duration: string;
  length: string;
  fileType: string;
  isExplicit: "yes" | "no" | string;
  link: string;
  pubDate: string;
  title: string;
  // API
  error?: string;
  // UI only
  order?: number;
  isUploaded?: boolean;
  file?: ArrayBuffer;
};

export interface RssEpisodeContentLengthAPI {
  link: string;
  length: string;
  error?: string;
};


export interface rssEpisodeRetry extends rssEpisode {
};

export interface RSSEpisodeEstimate {
  link: string;
  size: string;
  type: string;
};