import { useSendTransaction, usePrepareSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';

export default function useEthTransactionHook(addressToSendTo, value) {
  // const { address, isConnecting, isDisconnected } = useAccount();

  // example args: 'permacast.eth', '0.001'
  const { config, error } = usePrepareSendTransaction({
    request: {
      to: addressToSendTo,
      value: parseEther(value),
    },
  })
  const { data, isLoading, isSuccess,  sendTransaction } = useSendTransaction(config);

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
  return [data, isLoading, isSuccess, sendTransaction, error]
}
