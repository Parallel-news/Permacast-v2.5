import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  links: Record<string, string>[];
};

const fetchContentLength = async (link: string) => {
  try {
    const data = await axios.head(link);
    const headers = data?.headers;
    const length: string = headers['content-length'];
    return {link, length};
  } catch {
    return {link, length: '0'};
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { rssLinks } = req.body;
  try {
    const links = await Promise.all(
      rssLinks.map(async (link: string) => {
        try {
          if (link.startsWith('http://')) throw new Error('HTTP links are not supported');
          return await fetchContentLength(link);
        } catch (e) {
          console.log(e.message)
          return {link, length: '0', error: e.message};
        }
      })
    );
    res.status(200).json({ links });
  } catch (error) {
    console.error(error);
    return res.status(200).json({links: rssLinks.map(async (link: string) => ({link, length: '0'}) )});
  }
}