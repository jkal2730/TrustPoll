"use client"
import React from 'react';
import InputField from '@/components/ui/InputField'
import { chainsToTSender, tsenderAbi, erc20Abi } from '@/constants';
import { useChainId } from 'wagmi'

const CreateInputForm = () => {
  const chainId = useChainId()
  const [formData, setFormData] = React.useState({
    pollName: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    //e.preventDefault();
    //console.log('Form submitted:', formData);
    const tSenderAddress = chainsToTSender[chainId]["tsender"]
    console.log("tsenderAddress: ", tSenderAddress)
    console.log(chainId)
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter the following information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Poll Name"
          placeholder="Trust Poll"
          value={formData.pollName}
          onChange={handleInputChange('pollName')}
        />

        <InputField
          label="Entrance Fee"
          placeholder="1 ETH"
          value={formData.entranceFee}
          onChange={handleInputChange('entranceFee')}
        />

        <InputField
          label="Register Duration"
          placeholder="2 Days"
          value={formData.registerDuration}
          onChange={handleInputChange('registerDuration')}
        />

        <InputField
          label="Vote Duration"
          placeholder="1 Days"
          value={formData.voteDuration}
          onChange={handleInputChange('voteDuration')}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Submit
        </button>
      </form>

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

export default CreateInputForm;