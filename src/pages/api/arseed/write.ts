import type { NextApiRequest, NextApiResponse } from 'next';
import { EverPayResponse } from '../../../interfaces/everpay';
import { BufferFile } from '../../../interfaces/arseed';
import { uploadFileToArseedViaNode } from '../../../utils/arseed';
import { isValidBody } from '../../../utils/validation/api';


type RequestBody = {
  text?: string;
  attachments?: BufferFile[]
}

interface ResponseData {
  response: string[] | null;
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb'
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!isValidBody<RequestBody>(req.body, ['attachments']) || (!req.body.attachments)) {
    return res.status(402)
  }

  const { attachments } = req.body;

  let status = 200;

  let promises = attachments.map(async (attachment: BufferFile, index: number) => 
    await uploadFileToArseedViaNode(attachment.file, attachment.dataType)
  );

  const allPromises = await Promise.all(promises);

  console.log(allPromises)

  const TXs = allPromises
    .map((uploadTx: EverPayResponse | null) => uploadTx?.order?.itemId)
    .filter(p => (p !== null || p !== undefined));

  if (TXs.length !== allPromises.length) status = 206;
  console.log(TXs)

  // TODO: if some requests fail, stop here and return a partial response + keep stuff in localStorage
  if (status === 206) console.log('some requests failed')

  // TODO test later if this works
  // localStorage.setItem('arseed-finalTx', finalTx?.order ? finalTx.order?.itemId : '')
  res.status(200).json({ response: TXs })
}
