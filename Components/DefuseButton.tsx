import React, { useCallback, useState, useEffect } from 'react';
import { useContracts } from '../utils/ContractsProvider';
import toast from 'react-hot-toast';
import { useWaitForTransactionReceipt } from 'wagmi'; // Ensure you're importing hooks from wagmi
import { usePublicClient, useAccount } from 'wagmi';




export default function DefuseButton() {

  const contracts = useContracts();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

 




  
  const defuse = useCallback(async () => {
    setIsLoading(true);

    // if (!contracts || !contracts.TST404) {
    //   console.error('Contract not found');
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const contractHandlers = contracts.TST404('0x9CA8c793E5edFcE3732a3685a591e262E799530b');
      const txResponse = await contractHandlers.defuse();
      
      if (txResponse && typeof txResponse[0] === 'string') {
        // Assuming the first element of txResponse is the transaction hash
        const transactionHash = txResponse[0];
        setTxHash(transactionHash);
         // Set the transaction hash
        console.log('Transaction sent:', transactionHash);
    } else {
        throw new Error('Transaction response is undefined or missing hash.');
    }


      console.log// Store the transaction hash to state
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows `error` is an Error object, so you can access `error.message`
            let customErrorMessage = error.message.split('reverted with the following reason:')[1] || '';
            customErrorMessage = customErrorMessage.split('\n')[0] || customErrorMessage; 
            customErrorMessage = customErrorMessage.split('Contract Call:')[0] || customErrorMessage; 
            customErrorMessage = customErrorMessage.trim();
            toast.error(customErrorMessage);
          } else {
            // If it's not an Error object, handle it differently or log a generic message
            toast.error('An unexpected error occurred.');
          }
          setIsLoading(false);
  }
  }, [contracts]);
  const { data: txReceipt, isLoading: isTxLoading, isSuccess } = useWaitForTransactionReceipt({
    confirmations : 1,
    hash: txHash,
  });
  
  useEffect(() => {
    if (isSuccess && txReceipt) {

      console.log('Transaction mined:', txReceipt);
     
      toast.success('Successfully defused! You’re safe.');
    
      setIsLoading(false); // Adjust based on your transaction flow
      setTxHash(undefined)
    }
  }, [isSuccess, txReceipt, isLoading]);
  

  useEffect(() => {
    setIsLoading(isTxLoading);
  }, [isTxLoading]);
  
  

  const handleDefuseClick = () => {
    defuse();
    
  };

  return (
    <div >
      
        <button onClick={handleDefuseClick} disabled={isLoading} >
      {isLoading ? 'Defusing...' : 'Defuse'}
    </button>
    </div>
  
  );
}
