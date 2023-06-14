import React from "react";

import { rssEpisode } from "@/interfaces/rss";

import RssEpisodeItem from "./rssEpisodeItem";

interface EpisodesListProps {
  episodes: rssEpisode[];
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
          order={index + uploadedCount + 1}
        />
      </React.Fragment>
    ))}
  </>
);

export default EpisodesList;