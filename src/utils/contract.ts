interface ContractVariables {
  contractAddress: string;
  isProduction: boolean;
};

export const getContractVariables = (): ContractVariables => {
  const PROD_CONTRACT = process.env.EXM_PROD_CONTRACT_ADDRESS;
  const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
  const IS_PROD = process.env.IS_PROD;

  const contractAddress = IS_PROD === 'true' ? PROD_CONTRACT : DEV_CONTRACT;
  const isProduction = IS_PROD === 'true' ? true : false;

  //! DO NOT RETURN API TOKEN TO AVOID EXPOSING IT!
  return { contractAddress, isProduction };
};

export const getFeaturedChannelsContract = (): ContractVariables => {
  const isProduction = process.env.IS_PROD === 'true' ? true : false;
  const contractAddress = isProduction ? process.env.EXM_FEATURED_CHANNEL_PROD_ADDRESS: process.env.EXM_FEATURED_CHANNEL_DEV_ADDRESS;
  return { contractAddress, isProduction };
};
