import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  ...props 
}) => {
  return (
    <div className="space-y-1">
      <Input
        label={label}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        error={error}
        required={required}
        {...props}
      />
    </div>
  );
};

export default FormField;