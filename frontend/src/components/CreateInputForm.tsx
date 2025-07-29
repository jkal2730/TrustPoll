"use client"
import React from 'react';
import InputField from '@/components/ui/InputField'
import { useDeployContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

// TrustPoll 컨트랙트 JSON 파일에서 import
import TrustPollContract from '@/contracts/TrustPoll.json'

const TRUST_POLL_BYTECODE = TrustPollContract.bytecode.object as `0x${string}`
const TRUST_POLL_ABI = TrustPollContract.abi

const CreateInputForm = () => {
  const { deployContract, data: hash, error, isPending } = useDeployContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError, data: receipt } = useWaitForTransactionReceipt({
    hash,
  })

  const [formData, setFormData] = React.useState({
    entranceFee: '',
    registerDuration: '',
    voteDuration: ''
  });

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 입력값 검증 함수
  const getValidationError = (): string | null => {
    if (!formData.entranceFee) return "Please enter entrance fee";
    if (!formData.registerDuration) return "Please enter register duration";
    if (!formData.voteDuration) return "Please enter vote duration";

    // 숫자 검증
    const fee = parseFloat(formData.entranceFee);
    const regDuration = parseInt(formData.registerDuration);
    const voteDuration = parseInt(formData.voteDuration);

    if (isNaN(fee) || fee <= 0) return "Entrance fee must be a positive number";
    if (isNaN(regDuration) || regDuration <= 0) return "Register duration must be a positive number";
    if (isNaN(voteDuration) || voteDuration <= 0) return "Vote duration must be a positive number";

    return null;
  };

  // 시간을 초로 변환하는 함수
  const convertToSeconds = (days: string): bigint => {
    const daysNum = parseInt(days);
    return BigInt(daysNum * 24 * 60 * 60); // 일 → 초
  };

  const validationError = getValidationError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      // 입력값을 컨트랙트 형식으로 변환
      const entranceFeeWei = parseEther(formData.entranceFee);
      const registerDurationSeconds = convertToSeconds(formData.registerDuration);
      const voteDurationSeconds = convertToSeconds(formData.voteDuration);

      await deployContract({
        abi: TRUST_POLL_ABI,
        bytecode: TRUST_POLL_BYTECODE,
        args: [entranceFeeWei, voteDurationSeconds, registerDurationSeconds],
      });
    } catch (err) {
      console.error('Contract deployment failed:', err);
    }
  };

  const allErrors = error || receiptError;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Deploy Trust Poll Contract</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Entrance Fee (ETH)"
          placeholder="1"
          value={formData.entranceFee}
          onChange={handleInputChange('entranceFee')}
        />

        <InputField
          label="Register Duration (Days)"
          placeholder="2"
          value={formData.registerDuration}
          onChange={handleInputChange('registerDuration')}
        />

        <InputField
          label="Vote Duration (Days)"
          placeholder="1"
          value={formData.voteDuration}
          onChange={handleInputChange('voteDuration')}
        />

        {validationError && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">{validationError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isConfirming || !!validationError}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          {isPending ? 'Deploying...' : isConfirming ? 'Confirming...' : 'Deploy Contract'}
        </button>
      </form>

      {/* Transaction Status */}
      <div className="mt-6 space-y-4">
        {allErrors && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{allErrors.message}</p>
          </div>
        )}

        {hash && isConfirming && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">Confirming deployment...</p>
            <p className="text-xs text-yellow-600 mt-1 font-mono">{hash}</p>
          </div>
        )}

        {isConfirmed && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800 font-medium">Contract deployed successfully!</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-green-600">
                <span className="font-medium">Contract Address:</span>
                <span className="font-mono ml-2">{receipt?.contractAddress}</span>
              </p>
              <p className="text-xs text-green-600">
                <span className="font-medium">Transaction Hash:</span>
                <span className="font-mono ml-2">{hash}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview of converted values */}
      {formData.entranceFee && formData.registerDuration && formData.voteDuration && (
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">Contract Parameters Preview:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Entrance Fee:</span> {formData.entranceFee} ETH</p>
            <p><span className="font-medium">Register Duration:</span> {formData.registerDuration} days ({parseInt(formData.registerDuration) * 24 * 60 * 60} seconds)</p>
            <p><span className="font-medium">Vote Duration:</span> {formData.voteDuration} days ({parseInt(formData.voteDuration) * 24 * 60 * 60} seconds)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInputForm;