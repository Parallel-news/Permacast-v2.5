import React from "react";

import { rssEpisode, rssEpisodeRetry } from "@/interfaces/rss";

import RssEpisodeItem from "./rssEpisodeItem";

interface EpisodesListProps {
  episodes: rssEpisode[] | rssEpisodeRetry[];
  uploadedEpisodesLinks: string[];
  uploadedCount: number;
};

const EpisodesList = ({ episodes, uploadedCount, uploadedEpisodesLinks }: EpisodesListProps) => (
  <>
    {episodes.map((rssEpisode: rssEpisode, index: number) => (
      <React.Fragment key={index}>
        <RssEpisodeItem
          {...rssEpisode}
          isUploaded={uploadedEpisodesLinks.includes(rssEpisode.link)}
          number={index + uploadedCount + 1}
        />
      </React.Fragment>
    ))}
  </>
);

export default EpisodesList;