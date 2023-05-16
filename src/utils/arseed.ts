import axios, { AxiosProgressEvent } from "axios";
import { genNodeAPI } from "arseeding-js";

import { BufferFile, SendAndPayInterface } from "../interfaces/arseed";
import { EverPayResponse } from "../interfaces/everpay";
import { determineMediaType } from "./reusables";

/**
  Converts a list of files into an array of objects containing their data as Buffers and their data type.
  @dev This function only works if called on the frontend, because it uses the File type, which is only available in the browser.
  @param {File[]} fileList - The list of files to convert.
  @returns {Promise<BufferFile[]>} A promise that resolves to the array of converted files.
*/
export async function convertFilesToBuffer(fileList: File[]): Promise<BufferFile[]> {
  // Convert the files to Buffers
  const promiseBufferedFiles = fileList.map(async (file: File) =>
    Buffer.from(new Uint8Array(await file.arrayBuffer()))
  );
  const promised: Buffer[] = await Promise.all(promiseBufferedFiles);
  
  // Return an array of objects containing the Buffers and their data type
  return fileList.map((file: File, index: number) => (
    {file: promised[index], dataType: file.type}
  ));
}

export async function uploadFileToArseedViaNode(file: Buffer, dataType: string): Promise<EverPayResponse | null> {
  const fundingWalletPK = process.env.ARSEED_FUNDING_WALLET_PK!;
  const currency = "AR";
  const instance = await genNodeAPI(fundingWalletPK);
  const sendAndPay = instance.sendAndPay as SendAndPayInterface;

  const options = {
    tags: [{ name: "Content-Type", value: dataType }]
  };

  try {
    const result = await sendAndPay(
      "https://arseed.web3infra.dev",
      file,
      currency,
      options,
      false
    );
    console.log(result)
    return result;
  } catch(err) {
    console.log(err);
    return null;
  };
};

export const uploadURLAndCheckPayment = async (url: string, debug=false) => {
  // TODO add check for cost
  const downloadedFile = await axios.get(url, { 
    responseType: "arraybuffer",
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
      if (debug) console.log(progressEvent.progress);
    },
  });

  // TODO: add a check for supported filetypes
  const mimeType = downloadedFile?.headers["content-type"] || '';
  const validMimeType = determineMediaType(mimeType);
  if (validMimeType === null) throw new Error('Invalid file type', mimeType);

  const fileUpload: EverPayResponse = await uploadFileToArseedViaNode(downloadedFile.data, mimeType);
  const tx = fileUpload?.order?.itemId;
  return tx;
};
