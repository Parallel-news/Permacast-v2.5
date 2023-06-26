import { genArweaveAPI, getBundleFee } from 'arseeding-js'
import { useQuery } from "@tanstack/react-query";

import { ARSEED_CURRENCY, ARSEED_URL, AR_DECIMALS, GIGABYTE, TEXTMARKDOWN } from "@/constants/index";
import { GIGABYTE_PRICE_KEY } from "@/constants/query-keys";

import { readFileAsArrayBuffer } from '@/utils/fileTools';

// a. Upload Media Functions
// Text
export const upload2DMedia = async (description: string) => {
    const instance = await genArweaveAPI(window.arweaveWallet)
    console.log("Instance: ", instance)
    const data = Buffer.from(description)
    const res = await instance.sendAndPay(ARSEED_URL, data, ARSEED_CURRENCY, TEXTMARKDOWN)
    console.log(res)
    return res
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
        console.log("Upload response:", res);
        return res;
    } catch (error) {
        console.error("Error reading file:", error);
    }
};

//! pls deprecate this
export const getBundleArFee = async (size: string) => {
    const res = await getBundleFee(ARSEED_URL, size, ARSEED_CURRENCY)
    return res?.finalFee
};

// returns the cost of 1 gigabyte in AR, as a floating point string
const fetchGigabyteCost = async () => {
  const cost = (await getBundleFee(ARSEED_URL, String(GIGABYTE), ARSEED_CURRENCY))?.finalFee;
  return cost ? (cost / AR_DECIMALS) : 0;
};

export function getGigabyteCost() {
  return useQuery({
    queryKey: [GIGABYTE_PRICE_KEY],
    queryFn: fetchGigabyteCost,
    cacheTime: 1000 * 30, // 30 seconds
  });
};

export const calculateSizeCost = (gigabyteCost: number, bytes: number) => {
  return gigabyteCost * bytes / GIGABYTE;
};

export const calculateARCost = (gigabyteCost: number, bytes: number) => {
    return gigabyteCost * bytes / GIGABYTE;
}

export const getReadableSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const s = bytes / Math.pow(1024, i);
    return Number(s.toFixed(2)) * 1 + ' ' + sizes[i];
}