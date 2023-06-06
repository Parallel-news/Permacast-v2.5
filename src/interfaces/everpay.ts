import { ChainType } from "everpay";
import { arweaveAddress, chainTicker, signature } from ".";

export interface EverpayTx {
  tokenSymbol: chainTicker;
  action: string;
  from: arweaveAddress;
  to: arweaveAddress;
  amount: string;
  fee: string;
  feeRecipient: string;
  nonce: number;
  tokenID: string;
  chainType: ChainType;
  chainID: string;
  data: string;
  version: string;
  sig: signature;
};

export interface EverpayTxAPIResponse extends EverpayTx {
  rawId: number;
  id: string;
  everHash: string;
  status: string;
  internalStatus: string;
  timestamp: number;
  targetChainTxHash: string;
  express: {
    chainTxHash: string;
    withdrawFee: string;
    refundEverHash: string;
    err: string;
  };
};

export interface Order {
  itemId: string;
  bundler: string;
  currency: string;
  decimals: number;
  fee: string;
  paymentExpiredTime: number;
  expectedBlock: number;
}

export interface EverPayResponse {
  status: string;
  everpayTx?: EverpayTx;
  everHash?: string;
  order?: Order;
}
