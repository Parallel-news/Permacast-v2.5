import axios from "axios";
import jsonata from "jsonata";
import { NextApiRequest, NextApiResponse } from "next";
import { getContractVariables } from "../../../utils/contract";
import { EXMState } from "../../../interfaces";

interface Query {
  key: string;
  query: string;
};

interface ResponseData {
  
};

async function executeQueries(queries, state) {
  let result = {};

  await Promise.all(queries.map(async (q) => {
    const { query, key } = q;
    const evaluation = await jsonata(query).evaluate(state);
    result[key] = evaluation;
  }));

  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { contractAddress } = getContractVariables();
    const data = await axios.get(`https://api.exm.dev/read/${contractAddress}`);
    const state: EXMState = data.data;
    if (req.body?.queries) {
      const queries: Query[] = req.body.queries;
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