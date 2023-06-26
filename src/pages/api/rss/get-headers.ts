import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next";

import { rssEpisode } from "@/interfaces/rss";
interface ResponseData {
  episodes: rssEpisode[];
};

const fetchContentLength = async (link: string) => {
  try {
    const data = await axios.head(link);
    const headers = data?.headers;
    const length: string = headers['content-length'];
    return length;
  } catch (e) {
    console.log(e.message);
    return '0';
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { rssEpisodes } = req.body;
  try {
    const episodes = await Promise.all(
      rssEpisodes.map(async (rssEpisode: rssEpisode) => {
        try {
          if (!rssEpisode.link) throw new Error('This episode has no link provided: RSS feed is malformed');
          if (rssEpisode.link?.startsWith('http://')) throw new Error('HTTP links are not supported');
          if (rssEpisode.length) return rssEpisode;
          const length = await fetchContentLength(rssEpisode.link);
          return { ...rssEpisode, length };
        } catch (e) {
          console.log(e.message)
          return { ...rssEpisode, error: e.message };
        }
      })
    );
    res.status(200).json({ episodes });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      episodes: rssEpisodes.map(
        async (rssEpisode: rssEpisode) => ({ ...rssEpisode, length: '0', error: JSON.stringify(error) })
      )
    });
  }
}