import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getPASOMContract } from "../../../../utils/contract";

interface ResponseData {};

//! DO NOT EXPOSE THIS FUNCTION TO THE UI
const getContractVariables = () => {
  const PROD_TOKEN = process.env.EXM_PROD_API_TOKEN;

  const contractAPIToken = PROD_TOKEN;
  const { contractAddress } = getPASOMContract();
  return { contractAddress, contractAPIToken };
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    throw new Error('API is in maintenance')
    const { contractAddress, contractAPIToken } = getContractVariables();

    const data = await axios.post(`https://api.exm.dev/api/transactions?token=${contractAPIToken}`, {
      functionId: contractAddress,
      inputs: [{
        "input": JSON.stringify(req.body)
      }],
    }, {})
    res.status(200).json(data.data)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  };
};