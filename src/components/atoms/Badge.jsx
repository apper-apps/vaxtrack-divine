import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full uppercase tracking-wide';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary to-blue-600 text-white',
    secondary: 'bg-gradient-to-r from-secondary to-green-600 text-white',
    success: 'bg-gradient-to-r from-success to-green-600 text-white',
    warning: 'bg-gradient-to-r from-warning to-orange-600 text-white',
    error: 'bg-gradient-to-r from-error to-red-600 text-white',
    info: 'bg-gradient-to-r from-info to-cyan-600 text-white',
    critical: 'bg-gradient-to-r from-error to-red-600 text-white pulse-alert',
    expiring: 'bg-gradient-to-r from-warning to-orange-600 text-white',
    good: 'bg-gradient-to-r from-success to-green-600 text-white'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;