import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next";

import { PermacastANS } from "@/interfaces/helpers";

interface ResponseData {
  res: PermacastANS | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { address } = req.query;
    const data = (await axios.get(`https://permacast-bloodstone-helper.herokuapp.com/protocol/users/${address}`)).data;
    res.status(200).json(data);
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}
