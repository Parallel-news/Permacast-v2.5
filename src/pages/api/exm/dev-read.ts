import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

const CONTRACT = process.env.EXM_CONTRACT_ADDRESS
const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS

interface ResponseData {
  
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const data = await axios.get(`https://api.exm.dev/read/${DEV_CONTRACT}`)
    res.status(200).json(data.data)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}