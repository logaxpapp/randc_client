import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  error?: string | null;
  label?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    isLoading = false,
    error = null,
    label,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleSelect = (val: string) => {
      onChange(val);
      setIsOpen(false);
    };
  
    return (
      <div className="relative w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <div
          className={`relative border rounded-md px-3 py-2 cursor-pointer ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setIsOpen(false)}
          tabIndex={0}
          aria-expanded={isOpen}
        >
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : (
            <span className={`${value ? 'text-black' : 'text-gray-500'}`}>
              {/* Display the selected label or placeholder */}
              {value ? options.find((opt) => opt.value === value)?.label : placeholder}
            </span>
          )}
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">▼</span>
        </div>
        {isOpen && (
          <ul
            className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-60 w-full overflow-auto shadow-lg"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  option.value === value ? 'bg-gray-100 font-semibold' : ''
                }`}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  };
  

export default Select;
