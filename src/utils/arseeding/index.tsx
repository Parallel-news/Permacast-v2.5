import { genArweaveAPI } from 'arseeding-js'
import { ARSEED_URL, TEXTMARKDOWN, ARSEED_CURRENCY } from '../../constants';

export default function ArseedingTools() {
    return false
}

// 1. Interfaces
interface UploadDescriptionInter {
    description: string;
}

interface CheckContentTypeInter {
    url: string;
}

// 2. Stylings

// 3. Custom Functions
export const upload2DMedia = async (props: UploadDescriptionInter) => {
    const instance = await genArweaveAPI(window.arweaveWallet)
    console.log("Instance: ", instance)
    const data = Buffer.from(props.description)
    const res = await instance.sendAndPay(ARSEED_URL, data, ARSEED_CURRENCY, TEXTMARKDOWN)
    console.log(res)
}

export const checkContentType = async (props: CheckContentTypeInter) => {
    try {
      const response = await fetch(props.url, { method: 'HEAD' });
      const ct = response.headers.get('content-type');
      return ct
    } catch (error) {
      console.error('Error fetching content type:', error);
    }
};