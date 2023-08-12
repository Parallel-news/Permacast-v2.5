import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

interface ResponseData {}

//! DO NOT EXPOSE THIS FUNCTION TO THE UI
const getContractVariables = () => {
  const PROD_CONTRACT = process.env.EXM_PROD_CONTRACT_ADDRESS;
  const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
  const PROD_TOKEN = process.env.EXM_PROD_API_TOKEN;
  const DEV_TOKEN = process.env.EXM_DEV_API_TOKEN;
  const IS_PROD = process.env.IS_PROD;

  const contractAddress = IS_PROD === 'true' ? PROD_CONTRACT : DEV_CONTRACT;
  const contractAPIToken = IS_PROD === 'true' ? PROD_TOKEN : DEV_TOKEN;
  const isProduction = IS_PROD === 'true' ? true : false;

  return { contractAddress, contractAPIToken, isProduction };
};

// Optional params:
// parsed: boolean - if true, will return JSON parsed data from the contract instead of stringified

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    throw new Error('API is being migrated')
    const { contractAddress, contractAPIToken } = getContractVariables();
    
    const data = await axios.post(`https://api.exm.dev/api/transactions?token=${contractAPIToken}`, {
      functionId: contractAddress,
      inputs: [{
        "input": JSON.stringify(req.body)
      }],
    }, {});
    if (req.body?.parsed) {
      res.status(200).json(data.data);
      return;
    }
    const responseData = JSON.stringify(data.data, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (
          key === "socket" &&
          value.constructor.name === "TLSSocket"
        ) {
          // Exclude the 'socket' property
          return undefined;
        }
      }
      return value;
    });
    res.status(200).json(responseData)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  };
};