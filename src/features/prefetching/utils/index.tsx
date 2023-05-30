import { Podcast } from "../../../interfaces";

export const sortByOwner = async (podcasts: Podcast[], owner: string) => {
    return podcasts.filter((podcast: Podcast) => podcast.owner === owner);
}