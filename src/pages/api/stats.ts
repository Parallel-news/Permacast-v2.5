import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {

};

interface body {

};

interface statsResponse {
  total_byte_size: number;
  total_episodes_count: number;
  total_channels_count: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // note: for prod use only
    const data = await axios.get(`https://permacast-bloodstone-helper.herokuapp.com/protocol/stats`);
    const response: statsResponse = data.data;
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  };
};