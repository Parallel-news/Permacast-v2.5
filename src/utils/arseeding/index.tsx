import { genArweaveAPI } from 'arseeding-js'
import { ARSEED_URL, TEXTMARKDOWN, ARSEED_CURRENCY } from '../../constants';

export default function ArseedingTools() {
    return false
}

interface UploadDescriptionInter {
    description: string;
}
const upload2DMedia = async (props: UploadDescriptionInter) => {
    const instance = await genArweaveAPI(window.arweaveWallet)
    console.log("Instance: ", instance)
    const data = Buffer.from(props.description)
    const res = await instance.sendAndPay(ARSEED_URL, data, ARSEED_CURRENCY, TEXTMARKDOWN)
    console.log(res)
}