import React from 'react';

// InputField.tsx
interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (value: string) => void;
}
const InputField = ({
  label,
  placeholder = '',
  value,
  type = 'text',
  large = false,
  onChange
}: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";

  const textareaClasses = `${baseClasses} min-h-[120px] resize-vertical`;

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {large ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={textareaClasses}
          rows={5}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={`${baseClasses} placeholder:text-gray-400 value:text-gray-400`}
        />
      )}
    </div>
  );
};

export default InputField