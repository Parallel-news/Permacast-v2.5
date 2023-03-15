// SAFE TO CALL ON UI
export const getContractVariables = () => {
  const PROD_CONTRACT = process.env.EXM_PROD_CONTRACT_ADDRESS;
  const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
  const IS_PROD = process.env.IS_PROD;

  const contractAddress = IS_PROD === 'true' ? PROD_CONTRACT : DEV_CONTRACT;
  const isProduction = IS_PROD === 'true' ? true : false;
  return { contractAddress, isProduction };
}