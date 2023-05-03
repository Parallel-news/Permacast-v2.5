import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { BufferFile } from '../../../interfaces/arseed';
import { uploadFileToArseed } from '../../../utils/arseed';
import { ARWEAVE_READ_LINK } from '../../../constants';

type RequestBody = {
  text?: string;
  covers?: BufferFile[]
}

interface ResponseData {
  // response: string[] | null;
}


// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '25mb'
//     }
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  const url = ARWEAVE_READ_LINK + "wlsmPpFanaCUvxupdL0sTAEhlsfp29puUQPEUPNw3VM";
  const onDownloadProgress = (progressEvent) => res.write(progressEvent);
  const stream = await axios.get(url, { responseType: "stream", onDownloadProgress, });
  const fileUpload = await uploadFileToArseed(stream.data, stream.headers["content-type"]);
  return res.json({ response: stream.data.size });
}