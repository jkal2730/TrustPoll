"use client"
import React from 'react';
import InputField from '@/components/ui/InputField'
import { trustPollAbi } from '../abi/trustPollAbi'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

const VoteInputForm: React.FC = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [formData, setFormData] = React.useState({
    pollAddress: '',
    candidateAddress: '',
  });

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await writeContract({
        address: formData.pollAddress as `0x${string}`,
        abi: trustPollAbi,
        functionName: 'vote',
        args: [formData.candidateAddress],
      });

    } catch (err: any) {
      console.error('Transaction failed:', err)

      const errorMessage = err?.message || err?.toString() || 'Unknown error'

      if (errorMessage.includes('VoteNotOpen') || errorMessage.includes('0x3a81d6fc')) {
        alert('It is not voting period')
      } else if (errorMessage.includes('IsNotCandidate')) {
        alert('Please enter the correct candidate')
      } else if (errorMessage.includes('AlreadyVoted')) {
        alert('You have already voted')
      } else if (errorMessage.includes('User rejected')) {
        alert('The transaction has been cancelled')
      } else {
        alert(`Transaction failed: ${errorMessage}`)
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter the following information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Poll Address"
          placeholder="0x"
          value={formData.pollAddress}
          onChange={handleInputChange('pollAddress')}
        />

        <InputField
          label="Candidate Address"
          placeholder="0x"
          value={formData.candidateAddress}
          onChange={handleInputChange('candidateAddress')}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Submit
        </button>
      </form>
      {/* Transaction Status */}
      {hash && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Transaction Hash: {hash}
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <p className="text-sm text-green-700">
            Transaction confirmed successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="text-sm text-red-700">
            Error: {error.message}
          </p>
        </div>
      )}

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Form Data:</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default VoteInputForm;