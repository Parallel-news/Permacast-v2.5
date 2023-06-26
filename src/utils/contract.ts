import { NFT_CONTRACT } from "../constants";
interface ContractVariables {
  contractAddress: string;
  isProduction: boolean;
  collectionsContract: string;
  featuredChannelsContract?: string;
  PASOMContract?: string;
};

const collectionsContract = NFT_CONTRACT;

export const getContractVariables = (): ContractVariables => {
  const PROD_CONTRACT = process.env.EXM_PROD_CONTRACT_ADDRESS;
  const DEV_CONTRACT = process.env.EXM_DEV_CONTRACT_ADDRESS;
  const IS_PROD = process.env.IS_PROD;
  

  const contractAddress = IS_PROD === 'true' ? PROD_CONTRACT : DEV_CONTRACT;
  const isProduction = IS_PROD === 'true' ? true : false;  
  const { contractAddress: PASOMContract } = getPASOMContract();
  const { contractAddress: featuredChannelsContract } = getFeaturedChannelsContract();

  //! DO NOT RETURN API TOKEN TO AVOID EXPOSING IT!
  return { contractAddress, isProduction, collectionsContract, featuredChannelsContract, PASOMContract };
};

export const getFeaturedChannelsContract = (): ContractVariables => {
  const isProduction = process.env.IS_PROD === 'true' ? true : false;
  const contractAddress = isProduction ? process.env.EXM_FEATURED_CHANNEL_PROD_ADDRESS: process.env.EXM_FEATURED_CHANNEL_DEV_ADDRESS;
  return { contractAddress, isProduction, collectionsContract };
};

export const getPASOMContract = (): ContractVariables => {
  const isProduction = true; // we are using the official PASOM contract
  const contractAddress = "RwH6UF6fmmCZrtYAu0HKc-_sK31RHlRZThutK0PD5_Y";
  return { contractAddress, isProduction, collectionsContract };
};