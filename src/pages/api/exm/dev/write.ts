import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

const CONTRACT = process.env.EXM_CONTRACT_ADDRESS
const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS
const TOKEN = process.env.EXM_API_TOKEN
const DEV_TOKEN = process.env.EXM_DEV_API_TOKEN

interface ResponseData {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const data = await axios.post(`https://api.exm.dev/api/transactions?token=${DEV_TOKEN}`, {
      functionId: DEV_CONTRACT,
      inputs: [{
        "input": JSON.stringify({function: "reserve", ...req.body})
      }],
    }, {})
    res.status(200).json(data.data)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}