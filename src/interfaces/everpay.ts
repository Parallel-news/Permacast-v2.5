
export interface EverpayTx {
  tokenSymbol: string;
  action: string;
  from: string;
  to: string;
  amount: string;
  fee: string;
  feeRecipient: string;
  nonce: string;
  tokenID: string;
  chainType: string;
  chainID: string;
  data: string;
  version: string;
  sig: string;
}

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
