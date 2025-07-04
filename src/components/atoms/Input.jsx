import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon, 
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-2 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500
    ${error ? 'border-error focus:ring-error' : ''}
    ${icon ? 'pl-10' : ''}
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
        {icon && (
          <ApperIcon 
            name={icon} 
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;