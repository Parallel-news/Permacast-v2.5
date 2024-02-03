import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { getContractVariables } from "@/utils/contract";
import { EXMState, contractType } from "@/interfaces/index";
import { Mem } from "mem-sdk";
import { PERMACAST_CONTRACT_ADDRESS } from "@/constants/index";

interface ResponseData {}

interface body {
  contractType?: contractType;
}

const oldStateUrl =
  "https://xjubsptyp5x7ahy4pe64pb4cobi3f2iboq4yo7p7xipomsfxah5q.arweave.net/umgZPnh_b_AfHHk9x4eCcFGy6QF0OYd9_7oe5ki3Afs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const {
      contractAddress: permacastContract,
      featuredChannelsContract,
      collectionsContract,
      PASOMContract,
    } = getContractVariables();

    let contractAddress = permacastContract;
    if (!req.body?.contractType) {
      switch (req.body.contractType as contractType) {
        case "permacastContract":
          contractAddress = permacastContract;
        case "featuredChannelsContract":
          contractAddress = featuredChannelsContract;
        case "collectionsContract":
          contractAddress = collectionsContract;
        case "PASOMContract":
          contractAddress = PASOMContract;
      }
    }
    const mem = new Mem({
      network: "mainnet",
    });
    const result = await mem.read(PERMACAST_CONTRACT_ADDRESS);
    const state = result;
    res.status(200).json(state);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}
