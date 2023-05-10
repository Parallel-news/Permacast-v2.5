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
    return {[link]: length};
  } catch {
    return {[link]: 0};
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { rssLinks } = req.body;
  try {
    const links = await Promise.all(rssLinks.map(async (link: string) => await fetchContentLength(link)))
    res.status(200).json({ links });
  } catch (error) {
    console.error(error);
    return res.status(204).json({links: rssLinks.map(async (link: string) => ({link: '0'}) )});
  }
}