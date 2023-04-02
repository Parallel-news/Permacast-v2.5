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
  return { contractAddress: "zyeTjKzVgKS6iu6g7JIeoXwOIBgpu_7LW8pRSjtKzPI", isProduction: true };
}
