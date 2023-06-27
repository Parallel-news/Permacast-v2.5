export interface PermacastANS {
  address: string;
  followers: string[];
  followings: string[];
  nickname: string;
  bio: string;
  avatar: string;
  banner: string;
  extension: {
    ansDomain: string;
    createdPodcasts: string[];
    episodesCount: number;
  };
}
