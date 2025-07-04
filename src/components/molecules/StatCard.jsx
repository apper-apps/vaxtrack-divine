import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue',
  gradient = false,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'text-primary',
    green: 'text-secondary',
    orange: 'text-warning',
    red: 'text-error',
    gray: 'text-gray-600'
  };

  const gradientClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'bg-gradient-to-br from-green-50 to-green-100',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100',
    red: 'bg-gradient-to-br from-red-50 to-red-100',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100'
  };

  return (
    <Card 
      hover 
      className={`p-6 ${gradient ? gradientClasses[color] : ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[color]} gradient-text`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className={`w-4 h-4 mr-1 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`} 
              />
              <span className={`text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${gradientClasses[color]}`}>
          <ApperIcon name={icon} className={`w-8 h-8 ${colorClasses[color]}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;