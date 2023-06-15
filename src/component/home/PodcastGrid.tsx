import { Podcast } from "@/interfaces/index";
import FeaturedPodcast from "./featuredPodcast";

const podcastContainer = `grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 gap-y-8 `;

interface PodcastsGridProps {
  podcasts: Podcast[];
};

const PodcastGrid = ({ podcasts }: PodcastsGridProps) => {
  return (
    <div className={podcastContainer} id="3x">
      {podcasts.map((podcast: Podcast) =>
        <FeaturedPodcast {...podcast} key={podcast.pid} />
      )}
    </div>
  );
};

export default PodcastGrid;