import { SendTransactionResult } from "@wagmi/core";
import { useSendTransaction, usePrepareSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';

const useEthTransactionHook = () => {
  // const { address, isConnecting, isDisconnected } = useAccount();

  const { config, error } = usePrepareSendTransaction({
    request: {
      to: "0x197f818c1313DC58b32D88078ecdfB40EA822614",
      value: parseEther('0.001'),
    },
  })

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config);

  // example from wagmi:
  /*
    <>
      <button disabled={!sendTransaction} onClick={() => sendTransaction?.()}>
        Send Transaction
      </button>
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
    </> 
  */
  return [data, isLoading, isSuccess, sendTransaction, error];
}

export default useEthTransactionHook;