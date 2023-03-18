import { genArweaveAPI } from 'arseeding-js'
import { readFileAsArrayBuffer } from '../fileTools';
import { ARSEED_URL, TEXTMARKDOWN, ARSEED_CURRENCY } from '../../constants';

// a. Upload Media Functions
// Text
export const upload2DMedia = async (description: string) => {
    const instance = await genArweaveAPI(window.arweaveWallet)
    console.log("Instance: ", instance)
    const data = Buffer.from(description)
    const res = await instance.sendAndPay(ARSEED_URL, data, ARSEED_CURRENCY, TEXTMARKDOWN)
    console.log(res)
}

// Image, Audio and Video Uploads
export const upload3DMedia = async (file: File, mediaType: string) => {
    if (!file) {
        console.log("No file selected");
        return;
    }
    try {
        // Convert Data to Array Buffer
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const dataBuffer = Buffer.from(arrayBuffer);
    
        const instance = await genArweaveAPI(window.arweaveWallet);
        console.log("Instance: ", instance);
        const ops = {
        tags: [{ name: "Content-Type", value: mediaType }], // Adjust the MIME type based on your audio file type
        };
        const res = await instance.sendAndPay(ARSEED_URL, dataBuffer, ARSEED_CURRENCY, ops);
    
        // Handle the response
        console.log("Upload response:", res);
    } catch (error) {
        console.error("Error reading file:", error);
    }
};


