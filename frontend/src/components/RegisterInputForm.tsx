"use client"
import React from 'react';
import InputField from '@/components/ui/InputField'
import { trustPollAbi } from '../abi/trustPollAbi'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem';

interface FormData {
  pollAddress: string;
  entranceFee: string;
}

const RegisterInputForm: React.FC = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { address } = useAccount()

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  const [formData, setFormData] = React.useState<FormData>({
    pollAddress: '',
    entranceFee: ''
  });

  const handleInputChange = (field: keyof FormData) => (value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const { data: pollPhase } = useReadContract({
    address: formData.pollAddress as `0x${string}`,
    abi: trustPollAbi,
    functionName: 'getPollPhase',
    args: [],
  })

  const { data: isRegistered } = useReadContract({
    address: formData.pollAddress as `0x${string}`,
    abi: trustPollAbi,
    functionName: 'isRegistered',
    args: [address],
  })

  const { data: requiredEntranceFee } = useReadContract({
    address: formData.pollAddress as `0x${string}`,
    abi: trustPollAbi,
    functionName: 'getEntranceFee',
    args: [],
  })

  const getValidationError = (): string | null => {
    if (!formData.pollAddress) return "Please enter poll address.";
    if (!formData.entranceFee) return "Please enter entrance fee.";
    if (!address) return "Please connect your wallet.";

    if (pollPhase !== undefined && pollPhase !== 0) {
      const phaseNames: string[] = ['REGISTER', 'VOTING', 'ENDED'];
      return `Not in registration phase. Current: ${phaseNames[pollPhase as number]}`;
    }

    if (isRegistered) {
      return "Address already registered.";
    }

    if (requiredEntranceFee && formData.entranceFee) {
      try {
        const inputFee: bigint = parseEther(formData.entranceFee);
        const requiredFee: bigint = requiredEntranceFee as bigint;
        if (inputFee < requiredFee) {
          return `Insufficient amount. Required: ${formatEther(requiredFee)} ETH`;
        }
      } catch {
        return "Invalid ETH amount.";
      }
    }

    return null;
  };

  const validationError: string | null = getValidationError();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      await writeContract({
        address: formData.pollAddress as `0x${string}`,
        abi: trustPollAbi,
        functionName: 'register',
        args: [],
        value: parseEther(formData.entranceFee),
      });
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  const allErrors = error || receiptError;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Poll Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Poll Address"
          placeholder="0x..."
          value={formData.pollAddress}
          onChange={handleInputChange('pollAddress')}
        />

        <div>
          <InputField
            label="Entrance Fee (ETH)"
            placeholder="1.0"
            value={formData.entranceFee}
            onChange={handleInputChange('entranceFee')}
          />
          {requiredEntranceFee !== undefined && (
            <p className="text-sm text-gray-600 mt-1">
              Required: {formatEther(requiredEntranceFee as bigint)} ETH
            </p> // consider gas fee later 
          )}
        </div>

        {formData.pollAddress && (
          <div className="p-4 bg-gray-50 rounded-md space-y-2">
            <div className="text-sm">
              <span className="font-medium">Phase: </span>
              <span className={pollPhase === 0 ? 'text-green-600' : 'text-red-600'}>
                {pollPhase !== undefined ? ['REGISTER', 'VOTING', 'ENDED'][pollPhase as number] : 'Loading...'}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Status: </span>
              <span className={isRegistered ? 'text-red-600' : 'text-green-600'}>
                {isRegistered !== undefined ?
                  (isRegistered ? 'Registered' : 'Available') : 'Checking...'}
              </span>
            </div>
          </div>
        )}

        {validationError && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">{validationError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isConfirming || !!validationError}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {allErrors && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{allErrors.message}</p>
          </div>
        )}

        {hash && isConfirming && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">Confirming...</p>
          </div>
        )}

        {isConfirmed && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">Registration successful!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterInputForm;