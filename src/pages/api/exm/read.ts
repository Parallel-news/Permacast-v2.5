import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { getContractVariables } from "@/utils/contract";
import { EXMState, contractType } from "@/interfaces/index";

interface ResponseData {
  
};

interface body {
  contractType?: contractType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { 
      contractAddress: primaryEXMContract,
      featuredChannelsContract,
      collectionsContract,
      PASOMContract
    } = getContractVariables();

    let contractAddress = primaryEXMContract;
    if (!req.body?.contractType) {
      switch (req.body.contractType as contractType) {
        case "primaryEXMContract":
          contractAddress = primaryEXMContract;
        case "featuredChannelsContract":
          contractAddress = featuredChannelsContract;
        case "collectionsContract":
          contractAddress = collectionsContract;
        case "PASOMContract":
          contractAddress = PASOMContract;
      };
    };
    const data = await axios.get(`https://api.exm.dev/read/${contractAddress}`);
    const state = data.data;
    res.status(200).json(state);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  };
};