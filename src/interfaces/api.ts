export interface JsonattaQuery {
  key: string;
  query: string;
};

export type contractType = "primaryEXMContract" | "featuredChannelsContract" | "collectionsContract" | "PASOMContract";

export interface RSSEpisodeEstimate {
  link: string;
  size: string;
  type: string;
};