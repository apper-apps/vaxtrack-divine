import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select option',
  error, 
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const selectClasses = `
    w-full px-4 py-2 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500
    appearance-none bg-white
    ${error ? 'border-error focus:ring-error' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Select;