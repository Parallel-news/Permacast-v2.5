
import axios from "axios"
import { ConsoleLogger } from "redstone-smartweave";
import { token, virginToken, contractAddress } from './exmvars'

export async function getAllData() {
    try {
        const response = await fetch('/read/5xDf6M5NRDDKGXAysr3ZRBfrW8vybtFocKP70JuuA3Y');
        return await response.json();
    } catch (error) {
        console.error(error)
    }
}

export default async function handler(req, res) {
    console.log("-------------------------------");
    console.log("Stringified req.body Result");
    console.log(JSON.stringify(req));
    try {
        const data = await axios.post(`/api/transactions?token=${virginToken}`, {
            functionId: contractAddress,
            inputs: [{
                'input': JSON.stringify(req),
            }]
        }).then((result) => {
            console.log("-------------------------------");
            console.log("Result from EXM Post: ");
            console.log(result.data);
        })
        console.log("-------------------------------");
        console.log('Result from Response: ');
        console.log(res)
        // res.status(200).json(data.data)
        // console.log(data.data)
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
