import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = 'No data available', 
  description = 'Get started by adding your first item',
  actionLabel = 'Add Item',
  onAction,
  icon = 'Package',
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
        {onAction && (
          <Button 
            onClick={onAction}
            variant="primary"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;