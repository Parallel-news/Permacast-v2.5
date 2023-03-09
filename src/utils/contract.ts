export const getContractVariables = () => {
  const PROD_CONTRACT = process.env.EXM_PROD_CONTRACT_ADDRESS;
  const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
  const PROD_TOKEN = process.env.EXM_PROD_API_TOKEN;
  const DEV_TOKEN = process.env.EXM_DEV_API_TOKEN;
  const IS_PROD = process.env.IS_PROD;

  const contractAddress = IS_PROD === 'true' ? PROD_CONTRACT : DEV_CONTRACT;
  const contractAPIToken = IS_PROD === 'true' ? PROD_TOKEN : DEV_TOKEN;
  return { contractAddress, contractAPIToken };
}