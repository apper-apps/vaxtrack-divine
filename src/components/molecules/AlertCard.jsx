import React from 'react';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const AlertCard = ({ 
  vaccine, 
  type = 'expiring', 
  daysUntilExpiry, 
  className = '' 
}) => {
  const getAlertConfig = () => {
    if (daysUntilExpiry <= 0) {
      return {
        badge: 'critical',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: 'AlertTriangle',
        iconColor: 'text-red-600',
        title: 'Expired',
        message: 'This vaccine has expired and should be removed from inventory.'
      };
    } else if (daysUntilExpiry <= 7) {
      return {
        badge: 'critical',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: 'AlertTriangle',
        iconColor: 'text-red-600',
        title: 'Critical',
        message: 'Expires in less than 7 days'
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        badge: 'warning',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: 'Clock',
        iconColor: 'text-orange-600',
        title: 'Warning',
        message: 'Expires within 30 days'
      };
    } else {
      return {
        badge: 'good',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: 'CheckCircle',
        iconColor: 'text-green-600',
        title: 'Good',
        message: 'Expires in more than 30 days'
      };
    }
  };

  const config = getAlertConfig();

  return (
    <Card className={`p-4 ${config.bgColor} border-l-4 ${config.borderColor} ${className}`}>
      <div className="flex items-start space-x-3">
        <ApperIcon name={config.icon} className={`w-5 h-5 ${config.iconColor} mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{vaccine.commercialName}</h4>
            <Badge variant={config.badge} size="xs">
              {config.title}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Lot: {vaccine.lotNumber} • Qty: {vaccine.quantityOnHand}
          </p>
          <p className="text-sm text-gray-500">
            {config.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Expires: {formatDistanceToNow(new Date(vaccine.expirationDate), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AlertCard;