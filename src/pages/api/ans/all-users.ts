import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Ans } from "../../../interfaces";

interface ResponseData {
  res: Ans[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const data = await axios.get(`http://ans-stats.decent.land/users`)
    res.status(200).json(data.data)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}