"use client"
import React from 'react';
import InputField from '@/components/ui/InputField'
import TrustPollContract from '@/contracts/TrustPoll.json'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'


interface FormData {
  pollAddress: string;
}

const trustPollAbi = TrustPollContract.abi;

// 타입 정의 추가 - 컨트랙트에 맞게 수정
type PollResult = [string, bigint[]] | undefined;

const CountInputForm: React.FC = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  const [formData, setFormData] = React.useState<FormData>({
    pollAddress: '',
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

  const { data: pollResult } = useReadContract({
    address: formData.pollAddress as `0x${string}`,
    abi: trustPollAbi,
    functionName: 'getPollResult',
    args: [],
  }) as { data: PollResult }

  const { data: resultCalculated } = useReadContract({
    address: formData.pollAddress as `0x${string}`,
    abi: trustPollAbi,
    functionName: 'resultCalculatedStatus',
    args: [],
  }) as { data: boolean | undefined }

  const getValidationError = (): string | null => {
    if (!formData.pollAddress) return "Please enter poll address.";

    if (pollPhase !== undefined && pollPhase !== 2) {
      const phaseNames: string[] = ['REGISTER', 'VOTING', 'ENDED'];
      return `Poll must be ended to count results. Current: ${phaseNames[pollPhase as number]}`;
    }

    return null;
  };

  const validationError: string | null = getValidationError();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (validationError) {
      alert(validationError);
      return;
    }

    if (resultCalculated) {
      return;
    }

    try {
      await writeContract({
        address: formData.pollAddress as `0x${string}`,
        abi: trustPollAbi,
        functionName: 'countPollResult',
        args: [],
      });
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  const allErrors = error || receiptError;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Count Poll Results</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Poll Address"
          placeholder="0x..."
          value={formData.pollAddress}
          onChange={handleInputChange('pollAddress')}
        />

        {formData.pollAddress && (
          <div className="p-4 bg-gray-50 rounded-md space-y-2">
            <div className="text-sm">
              <span className="font-medium">Phase: </span>
              <span className={pollPhase === 2 ? 'text-green-600' : 'text-red-600'}>
                {pollPhase !== undefined ? ['REGISTER', 'VOTING', 'ENDED'][pollPhase as number] : 'Loading...'}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Results Calculated: </span>
              <span className={resultCalculated ? 'text-green-600' : 'text-gray-600'}>
                {resultCalculated !== undefined ?
                  (resultCalculated ? 'Yes' : 'No') : 'Checking...'}
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
          {isPending ? 'Sending...' :
            isConfirming ? 'Confirming...' :
              resultCalculated ? 'View Results (No Gas Required)' :
                'Count Results'}
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
            <p className="text-sm text-green-800">Poll results counted successfully!</p>
          </div>
        )}

        {(isConfirmed || resultCalculated) && pollResult && pollResult[0] && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Poll Results:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><span className="font-medium">Winner:</span>
                <span className="font-mono text-xs ml-2">{pollResult[0]}</span>
              </p>
              {pollResult[1] && Array.isArray(pollResult[1]) && (
                <div>
                  <span className="font-medium">Vote Counts:</span>
                  <ul className="mt-1 ml-4 space-y-1">
                    {pollResult[1].map((votes, index) => (
                      <li key={index} className="text-xs">
                        Candidate {index + 1}: {votes.toString()} votes
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountInputForm;