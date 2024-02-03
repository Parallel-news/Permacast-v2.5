import axios from "axios";
import { PERMACAST_CONTRACT_ADDRESS } from "@/constants/index";
import { Mem } from "mem-sdk";
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {}

// Optional params:
// parsed: boolean - if true, will return JSON parsed data from the contract instead of stringified

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const mem = new Mem({
      network: "mainnet",
    });
    const result = await mem.write(PERMACAST_CONTRACT_ADDRESS, req.body);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}
