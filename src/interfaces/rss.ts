export interface rssEpisode {
  description: string;
  duration: string;
  length: string;
  fileType: string;
  isExplicit: "yes" | "no" | string;
  link: string;
  pubDate: string;
  title: string;
  // UI only
  order?: number;
  isUploaded?: boolean;
};

export interface RssEpisodeContentLength {
  link: string;
  length: string;
  error?: string;
};


export interface rssEpisodeRetry extends rssEpisode {
  file?: ArrayBuffer;
};

export interface RSSEpisodeEstimate {
  link: string;
  size: string;
  type: string;
};