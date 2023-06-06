import axios from "axios";
import jsonata from "jsonata";
import { NextApiRequest, NextApiResponse } from "next";

import { getContractVariables } from "@/utils/contract";
import { EXMState, contractType } from "@/interfaces/index";
import { JsonattaQuery } from "@/interfaces/jsonatta";

async function executeQueries(queries: JsonattaQuery[], state: any) {
  let result = {};
  console.log(queries)
  await Promise.all(queries.map(async (q) => {
    const { query, key } = q;
    const evaluation = await jsonata(query).evaluate(state);
    result[key] = evaluation;
  }));
  console.log(result)
  return result;
};

interface ResponseData {
  
};

interface body {
  contractType?: contractType;
  queries?: JsonattaQuery[];
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
    const state: EXMState = data.data;
    if (req.body?.queries) {
      const queries: JsonattaQuery[] = req.body.queries;
      const result = await executeQueries(queries, state);
      res.status(200).json(result);
    } else {
      res.status(200).json(state);
    };
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  };
};