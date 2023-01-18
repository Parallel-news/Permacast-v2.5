import axios from "axios"

const CONTRACT = process.env.EXM_CONTRACT_ADDRESS
const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS

export default async function handler(req, res) {
  try {
    const data = await axios.get(`https://api.exm.dev/read/${CONTRACT}`)
    res.status(200).json(data.data)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}