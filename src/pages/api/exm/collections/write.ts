import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { getContractVariables } from "../../../../utils/contract";

interface ResponseData {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

    const PROD_TOKEN = process.env.EXM_PROD_API_TOKEN;
    const DEV_TOKEN = process.env.EXM_DEV_API_TOKEN;
    const IS_PROD = process.env.IS_PROD;
    const contractAPIToken = IS_PROD === 'true' ? PROD_TOKEN : DEV_TOKEN;

  try {
    const { collectionsContract } = getContractVariables();
    
    const data = await axios.post(`https://api.exm.dev/api/transactions?token=${contractAPIToken}`, {
      functionId: collectionsContract,
      inputs: [{
        "input": JSON.stringify(req.body)
      }],
    }, {})
    
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  };
};