import { EXM_PROD_CONTRACT } from "../constants";

interface ContractVariables {
  contractAddress: string;
  isProduction: boolean;
};

export const getContractVariables = (): ContractVariables => {
  const PROD_CONTRACT = EXM_PROD_CONTRACT;
  const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
  const IS_PROD = process.env.IS_PROD;

  const contractAddress = IS_PROD === 'true' ? PROD_CONTRACT : DEV_CONTRACT;
  const isProduction = IS_PROD === 'true' ? true : false;

  //! DO NOT RETURN API TOKEN TO AVOID EXPOSING IT!
  return { contractAddress, isProduction };
};
