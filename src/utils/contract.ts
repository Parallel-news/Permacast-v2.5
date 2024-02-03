import { NFT_CONTRACT } from "../constants";
interface ContractVariables {
  contractAddress: string;
  isProduction: boolean;
  collectionsContract: string;
  featuredChannelsContract?: string;
  PASOMContract?: string;
}

const collectionsContract = NFT_CONTRACT;

export const getContractVariables = (): ContractVariables => {
  const contractAddress = "umgZPnh_b_AfHHk9x4eCcFGy6QF0OYd9_7oe5ki3Afs";
  return {
    contractAddress,
    isProduction: true,
    collectionsContract,
    featuredChannelsContract: "",
    PASOMContract: "",
  };
};

export const getFeaturedChannelsContract = (): ContractVariables => {
  const isProduction = process.env.IS_PROD === "true" ? true : false;
  const contractAddress = isProduction
    ? process.env.EXM_FEATURED_CHANNEL_PROD_ADDRESS
    : process.env.EXM_FEATURED_CHANNEL_DEV_ADDRESS;
  return { contractAddress, isProduction, collectionsContract };
};

export const getPASOMContract = (): ContractVariables => {
  const isProduction = true; // we are using the official PASOM contract
  const contractAddress = "RwH6UF6fmmCZrtYAu0HKc-_sK31RHlRZThutK0PD5_Y";
  return { contractAddress, isProduction, collectionsContract };
};
