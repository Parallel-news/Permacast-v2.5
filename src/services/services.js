
import axios from "axios"
import { token, contractAddress } from './exmvars'

export async function getAllData() {
    try {
        const response = await fetch('/read/5xDf6M5NRDDKGXAysr3ZRBfrW8vybtFocKP70JuuA3Y');
        return await response.json();
    } catch (error) {
        console.error(error)
    }
}

export default async function handler(req, res) {
    try {
        const data = await axios.post(`https://api.exm.dev/api/transactions?token=${token}`, {
            functionId: contractAddress,
            inputs: [{
                "input": JSON.stringify({ function: "reserve", evm_address: req.body.evm_address, ans: req.body.ans })
            }],
        }, {})
        res.status(200).json(data.data)
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}


// { 
//     "function": "createPodcast",
//     "jwk_n": "$USER_ARWEAVE_PUBKEY",
//     "name": "$PODCAST_NAME",
//     "desc": "$PODCAST_DESCRIPTION",
//     "author": "$AUTHOR_NAME",
//     "lang": "$LANG_CHAR_CODE",
//     "isExplicit": "yes OR no",
//     "categories": "Technology",
//     "email": "test@permacast.dev",
//     "contentType": "v OR a", // v for video and a for audio
//     "cover": "$PODCAST_COVER_TXID", // must have "image/*" MIME type
//     "master_network": "EVM", // currently constant
//     "network": "ethereum", // currently constant
//     "token": "eth", // currently constant
//     "label": "test", // check N.B
//     "txid": "$PAYMENT_TXID", // check N.B
//     "sig": "$USER_ARWEAVE_SIGNATURE" // check N.B
//   }