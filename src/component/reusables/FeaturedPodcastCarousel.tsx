import { Podcast } from "../../interfaces";
import FeaturedPodcast, { featuredPocastCarouselStyling } from "../home/featuredPodcast";

interface podcastCarouselInter {
    podcasts: Podcast[]
}

export default function FeaturedPodcastCarousel(props: podcastCarouselInter) {
    return (
        <div className={featuredPocastCarouselStyling}>
            {props.podcasts.map((podcast: Podcast, index: number) => (
            <FeaturedPodcast {...podcast } key={index} />
            ))}
        </div>
    )
}