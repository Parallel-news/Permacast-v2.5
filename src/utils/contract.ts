export const PROD_CONTRACT = process.env.EXM_CONTRACT_ADDRESS;
export const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
export const PROD_TOKEN = process.env.EXM_API_TOKEN;
export const DEV_TOKEN = process.env.EXM_DEV_API_TOKEN;
export const IS_PROD = process.env.IS_PROD;

export const getContractVariables = () => {
  const contractAddress = IS_PROD ? PROD_CONTRACT : DEV_CONTRACT;
  const contractAPIToken = IS_PROD ? PROD_TOKEN : DEV_TOKEN;
  console.log({ contractAddress, contractAPIToken })
  return { contractAddress, contractAPIToken };
}