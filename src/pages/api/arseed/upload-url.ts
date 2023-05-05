import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { BufferFile } from '../../../interfaces/arseed';
import { uploadURLAndCheckPayment } from '../../../utils/arseed';

type RequestBody = {
  text?: string;
  covers?: BufferFile[]
}

interface ResponseData {
  // response: string[] | null;
}

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { url, uploadPaymentTX, episodeMetadata } = req.body;

  const { tx, mimeType} = await uploadURLAndCheckPayment(url, uploadPaymentTX, '', true);

  if (!tx) return res.json({ status: 'ERROR', error: "Upload failed", response: tx });
  console.log('tx', tx )
  const createEpPayload = {
    "function": "addEpisode",
    "content": tx,
    mimeType,
    ...episodeMetadata
  };
  createEpPayload['content'] = tx;
  console.log(createEpPayload)
  const { contractAddress, contractAPIToken } = getContractVariables();

  const data = await axios.post(`https://api.exm.dev/api/transactions?token=${contractAPIToken}`, {
    functionId: contractAddress,
    inputs: [{ "input": JSON.stringify(createEpPayload) }],
  }, {});

  return res.json({ status: 'SUCCESS', response: data.data });
}