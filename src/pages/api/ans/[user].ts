import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next";
import { Ans } from "../../../interfaces";

interface ResponseData {
  res: Ans | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { user } = req.query;
    const data = await axios.get(`https://ans-resolver.herokuapp.com/resolve-as-arpage/${user}`);
    res.status(200).json(data.data);
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}