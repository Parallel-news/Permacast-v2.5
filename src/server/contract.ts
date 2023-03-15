interface variables {
  contractAddress: string;
  contractAPIToken: string;
  isProduction: boolean;
};

//! ONLY CALL FROM API!!!
export const getContractVariables = (): variables => {
  const PROD_CONTRACT = process.env.EXM_PROD_CONTRACT_ADDRESS;
  const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
  const PROD_TOKEN = process.env.EXM_PROD_API_TOKEN;
  const DEV_TOKEN = process.env.EXM_DEV_API_TOKEN;
  const IS_PROD = process.env.IS_PROD;

  const contractAddress = IS_PROD === 'true' ? PROD_CONTRACT : DEV_CONTRACT;
  const contractAPIToken = IS_PROD === 'true' ? PROD_TOKEN : DEV_TOKEN;
  const isProduction = IS_PROD === 'true' ? true : false;

  return { contractAddress, contractAPIToken, isProduction };
};