import axios, { AxiosProgressEvent } from "axios"
import { NextApiRequest, NextApiResponse } from "next";
import { MAX_DOWNLOAD_FILE_SIZE } from "../../../constants";

interface ResponseData {
  links: Record<string, string>[];
};


const downloadEpisode = async (link) => {
  const response = await axios.get(link, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.bytes >= MAX_DOWNLOAD_FILE_SIZE) {
        throw new Error('File is too large');
      };
    }
  });
  const blob = await response.data;
  const size = blob.size;
  const type = blob.type;
  return { size, type };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { fileLinks } = req.body;
  try {
    if (!fileLinks) {
      throw new Error('No file links provided');
    };
    if (fileLinks.length > 5) {
      throw new Error('Too many file links provided');
    };
    const links = await Promise.all(fileLinks.map(async (link: string) => {
      const { size, type } = await downloadEpisode(link);
      return { link, size, type };
    }));
    res.status(200).json({ links });
  } catch (error) {
    console.error(error);
    return res.status(204).json({ links: fileLinks.map((link: string) => ({ link, size: 0, type: '' }))});
  }
}