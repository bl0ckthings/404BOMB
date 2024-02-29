import React, { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useWriteContract, useWaitForTransactionReceipt, useAccount,  } from 'wagmi';
import {TST404} from '../protocol/typechain-types/Asterix.sol/TST404; 

export default function DefuseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
 
  const { isConnected } = useAccount();

  const { 
    data : hash,
    isPending,
    writeContract 
  } = useWriteContract();

  const defuse = useCallback(async () => {
    setIsLoading(true);

    if (!isConnected || !TST404) {
      console.error('Contract not found or not connected');
      setIsLoading(false);
      return;
    }

    const { data: hash, isPending, writeContract } = useWriteContract({
        address: '0xE4855B974c59d10384eF4400ac8ffF55C283143a',
        contractInterface: abi,
        functionName: 'defuse',
      });
      setTxHash(hash);

      console.log('Transaction sent:', (hash);
    } catch (error) {
      let customErrorMessage = error.message.split('reverted with the following reason:')[1] || '';
      customErrorMessage = customErrorMessage.split('\n')[0] || customErrorMessage;
      customErrorMessage = customErrorMessage.split('Contract Call:')[0] || customErrorMessage;
      customErrorMessage = customErrorMessage.trim();
      toast.error(customErrorMessage);
      setIsLoading(false);
    }
  }, [TST404, isConnected]);

  const { data: txReceipt, isLoading: isTxLoading, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  useEffect(() => {
    if (isSuccess && txReceipt) {
      console.log('Transaction mined:', txReceipt);
      toast.success('Successfully defused! You’re safe.');
      setIsLoading(false);
      setTxHash(null);
    }
  }, [isSuccess, txReceipt]);

  useEffect(() => {
    setIsLoading(isTxLoading);
  }, [isTxLoading]);

  const handleDefuseClick = () => {
    defuse();
  };

  return (
    <div>
      <button onClick={handleDefuseClick} disabled={isLoading} className='secure-nuke'>
        {isLoading ? 'Defusing...' : 'Defuse'}
      </button>
    </div>
  );
}
