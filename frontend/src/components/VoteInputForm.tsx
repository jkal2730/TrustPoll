"use client"
import React from 'react';
import InputField from '@/components/ui/InputField'
import TrustPollContract from '@/contracts/TrustPoll.json'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'

interface FormData {
  pollAddress: string;
  candidateAddress: string;
}

const trustPollAbi = TrustPollContract.abi;

const VoteInputForm: React.FC = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { address } = useAccount()

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  const [forcePhase, setForcePhase] = React.useState<string>('0');

  const [formData, setFormData] = React.useState<FormData>({
    pollAddress: '',
    candidateAddress: '',
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

  const { data: isCandidateRegistered } = useReadContract({
    address: formData.pollAddress as `0x${string}`,
    abi: trustPollAbi,
    functionName: 'isRegistered',
    args: [formData.candidateAddress],
  })

  const { data: hasVoted } = useReadContract({
    address: formData.pollAddress as `0x${string}`,
    abi: trustPollAbi,
    functionName: 'hasVoted',
    args: [address],
  })

  const getValidationError = (): string | null => {
    if (!formData.pollAddress) return "Please enter poll address.";
    if (!formData.candidateAddress) return "Please enter candidate address.";
    if (!address) return "Please connect your wallet.";

    if (pollPhase !== undefined && pollPhase !== 1) {
      const phaseNames: string[] = ['REGISTER', 'VOTING', 'ENDED'];
      return `Not in voting phase. Current: ${phaseNames[pollPhase as number]}`;
    }

    if (hasVoted) {
      return "You have already voted.";
    }

    if (isCandidateRegistered === false) {
      return "Candidate is not registered.";
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

    try {
      await writeContract({
        address: formData.pollAddress as `0x${string}`,
        abi: trustPollAbi,
        functionName: 'vote',
        args: [formData.candidateAddress],
      });
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  const handleForceSetPhase = async (): Promise<void> => {
    if (!formData.pollAddress) {
      alert('Please enter poll address first.');
      return;
    }

    try {
      await writeContract({
        address: formData.pollAddress as `0x${string}`,
        abi: trustPollAbi,
        functionName: 'forceSetPhase',
        args: [parseInt(forcePhase)],
      });
    } catch (err) {
      console.error('Force set phase failed:', err);
    }
  };

  const allErrors = error || receiptError;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cast Your Vote</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Poll Address"
          placeholder="0x..."
          value={formData.pollAddress}
          onChange={handleInputChange('pollAddress')}
        />

        <InputField
          label="Candidate Address"
          placeholder="0x..."
          value={formData.candidateAddress}
          onChange={handleInputChange('candidateAddress')}
        />

        {formData.pollAddress && (
          <div className="p-4 bg-gray-50 rounded-md space-y-2">
            <div className="text-sm">
              <span className="font-medium">Phase: </span>
              <span className={pollPhase === 1 ? 'text-green-600' : 'text-red-600'}>
                {pollPhase !== undefined ? ['REGISTER', 'VOTING', 'ENDED'][pollPhase as number] : 'Loading...'}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Vote Status: </span>
              <span className={hasVoted ? 'text-red-600' : 'text-green-600'}>
                {hasVoted !== undefined ?
                  (hasVoted ? 'Already Voted' : 'Can Vote') : 'Checking...'}
              </span>
            </div>
            {formData.candidateAddress && (
              <div className="text-sm">
                <span className="font-medium">Candidate: </span>
                <span className={isCandidateRegistered ? 'text-green-600' : 'text-red-600'}>
                  {isCandidateRegistered !== undefined ?
                    (isCandidateRegistered ? 'Registered' : 'Not Registered') : 'Checking...'}
                </span>
              </div>
            )}
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
          {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Vote'}
        </button>
      </form>

      {/* Owner Controls */}
      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Owner Controls</h3>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Force Set Phase
            </label>
            <select
              value={forcePhase}
              onChange={(e) => setForcePhase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
            >
              <option value="0">REGISTER (0)</option>
              <option value="1">VOTING (1)</option>
              <option value="2">ENDED (2)</option>
            </select>
          </div>
          <button
            onClick={handleForceSetPhase}
            disabled={isPending || isConfirming || !formData.pollAddress}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed h-10"
          >
            Force Set
          </button>
        </div>
      </div>

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
            <p className="text-sm text-green-800">Vote cast successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteInputForm;