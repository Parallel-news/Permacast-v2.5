import { BufferFile } from "../interfaces/arseed";
import { genNodeAPI } from "arseeding-js";
import { EverPayResponse } from "../interfaces/everpay";


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

export async function uploadFileToArseed(file: Buffer, dataType: string): Promise<EverPayResponse | null> {
  const fundingWalletPK = process.env.ARSEED_FUNDING_WALLET_PK!;
  const currency = process.env.ARSEED_FUNDING_CURRENCY || 'ETH';
  const instance = await genNodeAPI(fundingWalletPK);

  const ops = {
    tags: [
      {name: "Content-Type", value: dataType},
    ]
  };

  try {
    return await instance.sendAndPay("https://arseed.web3infra.dev", file, currency, ops)
  } catch(err) {
    console.log(err)
    return null
  }
}

