import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next";
import { getPASOMContract } from "../../../../utils/contract";

interface ResponseData {
  
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { contractAddress } = getPASOMContract();
    const data = await axios.get(`https://api.exm.dev/read/${contractAddress}`);
    res.status(200).json(data.data);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  };
};