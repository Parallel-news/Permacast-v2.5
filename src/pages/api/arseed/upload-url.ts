import type { NextApiRequest, NextApiResponse } from 'next';

import { BufferFile } from '@/interfaces/arseed';
import { uploadURLAndCheckPayment } from '@/utils/arseed';

type RequestBody = {
  text?: string;
  covers?: BufferFile[]
}

interface ResponseData {
  // response: string[] | null;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { url, uploadPaymentTX } = req.body;

  const tx = await uploadURLAndCheckPayment(url);
  if (!tx) return res.json({ status: 'ERROR', error: "Upload failed", response: tx });

  return res.json({ status: 'SUCCESS', response: tx });
}