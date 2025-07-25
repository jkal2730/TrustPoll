"use client"
import React from 'react';
import InputField from '@/components/ui/InputField'
import { trustPollAbi } from '../abi/trustPollAbi'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem';

const RegisterInputForm = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  const [formData, setFormData] = React.useState({
    pollAddress: '',
    entranceFee: ''
  });

  const allErrors = error || receiptError;

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('=== TRANSACTION START ===');
    console.log('Form data:', formData);
    console.log('Poll address:', formData.pollAddress);
    console.log('Entrance fee:', formData.entranceFee);

    try {
      const result = await writeContract({
        address: formData.pollAddress as `0x${string}`,
        abi: trustPollAbi,
        functionName: 'register',
        args: [],
        value: parseEther(formData.entranceFee),
      });

      console.log('WriteContract result:', result);
    } catch (err) {
      console.error('=== CAUGHT ERROR ===');
      console.error('Full error object:', err);
      console.error('Error stringified:', JSON.stringify(err, null, 2));
      console.error('Error message:', (err as any)?.message);
      console.error('Error name:', (err as any)?.name);
      console.error('Error cause:', (err as any)?.cause);
    }
  };

  // 에러 상태 변화 감지
  React.useEffect(() => {
    if (error) {
      console.error('=== WAGMI ERROR DETECTED ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stringified:', JSON.stringify(error, null, 2));
    }
  }, [error]);

  React.useEffect(() => {
    if (receiptError) {
      console.error('=== RECEIPT ERROR DETECTED ===');
      console.error('Receipt error object:', receiptError);
      console.error('Receipt error message:', receiptError.message);
      console.error('Receipt error stringified:', JSON.stringify(receiptError, null, 2));
    }
  }, [receiptError]);

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
          label="Entrance Fee"
          placeholder="1 ETH"
          value={formData.entranceFee}
          onChange={handleInputChange('entranceFee')}
        />

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting...' : isConfirming ? 'Confirming...' : 'Submit'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {allErrors && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
            <div className="text-sm text-red-700 space-y-2">
              <div>
                <strong>Message:</strong>
                <pre className="mt-1 whitespace-pre-wrap break-words">{allErrors.message}</pre>
              </div>
              {(allErrors as any).cause && (
                <div>
                  <strong>Cause:</strong>
                  <pre className="mt-1 whitespace-pre-wrap break-words">{JSON.stringify((allErrors as any).cause, null, 2)}</pre>
                </div>
              )}
              {(allErrors as any).name && (
                <div>
                  <strong>Error Type:</strong> {(allErrors as any).name}
                </div>
              )}
              <div>
                <strong>Full Error Object:</strong>
                <pre className="mt-1 whitespace-pre-wrap break-words text-xs">{JSON.stringify(allErrors, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}

        {hash && isConfirming && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">Transaction confirming...</p>
          </div>
        )}

        {isConfirmed && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">Transaction successful!</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Form Data:</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default RegisterInputForm;