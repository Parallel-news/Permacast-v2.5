import type { NextApiRequest, NextApiResponse } from 'next';

import { EverPayResponse } from '../../../interfaces/everpay';
import { BufferFile } from '../../../interfaces/arseed';
import { uploadFileToArseedViaNode } from '../../../utils/arseed';

type RequestBody = {
  text?: string;
  covers?: BufferFile[]
}

interface ResponseData {
  response: string[] | null;
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // if (!isValidBody<RequestBody>(req.body, ['covers']) || (!req.body.covers)) {
  //   return res.status(402)
  // }

  let status = 200;

  const { covers } = req.body;
  if (covers.length !== 2) return res.status(402);

  let promises = covers.map(async (attachment: BufferFile, index: number) => 
    await uploadFileToArseedViaNode(attachment.file, attachment.dataType)
  );

  const allPromises = await Promise.all(promises);

  console.log(allPromises)

  const TXs = allPromises
    .map((uploadTx: EverPayResponse | null) => uploadTx?.order?.itemId)
    .filter(p => (p !== null || p !== undefined));

  if (TXs.length !== allPromises.length) status = 206;
  console.log(TXs)

  res.status(status).json({ response: TXs })
}
