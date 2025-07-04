import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import AlertCard from "@/components/molecules/AlertCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { inventoryService } from "@/services/api/inventoryService";
import { administrationService } from "@/services/api/administrationService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [inventoryData, administrationData] = await Promise.all([
        inventoryService.getAll(),
        administrationService.getAll()
      ]);
      
      setInventory(inventoryData);
      setAdministrations(administrationData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  // Calculate metrics
  const totalDoses = inventory.reduce((sum, item) => sum + item.quantityOnHand, 0);
  const totalAdministered = administrations.reduce((sum, admin) => sum + admin.dosesAdministered, 0);
  
  const now = new Date();
  const expiringDoses = inventory.filter(item => {
    const expiry = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });
  
  const expiredDoses = inventory.filter(item => {
    const expiry = new Date(item.expirationDate);
    return expiry < now;
  });

  const lowStockItems = inventory.filter(item => {
    const threshold = item.vaccine?.alertThreshold || 10;
    return item.quantityOnHand <= threshold;
  });

  const criticalAlerts = inventory.filter(item => {
    const expiry = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  });

  const stats = [
    {
      title: 'Total Doses',
      value: totalDoses.toLocaleString(),
      icon: 'Package',
      color: 'blue',
      gradient: true
    },
    {
      title: 'Administered',
      value: totalAdministered.toLocaleString(),
      icon: 'Syringe',
      color: 'green',
      gradient: true
    },
    {
      title: 'Expiring Soon',
      value: expiringDoses.reduce((sum, item) => sum + item.quantityOnHand, 0).toLocaleString(),
      icon: 'Clock',
      color: 'orange',
      gradient: true
    },
    {
      title: 'Expired',
      value: expiredDoses.reduce((sum, item) => sum + item.quantityOnHand, 0).toLocaleString(),
      icon: 'AlertTriangle',
      color: 'red',
      gradient: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="primary"
            icon="PackagePlus"
            onClick={() => navigate('/receive')}
            className="w-full"
          >
            Receive Vaccines
          </Button>
          <Button
            variant="secondary"
            icon="Syringe"
            onClick={() => navigate('/administer')}
            className="w-full"
          >
            Record Administration
          </Button>
          <Button
            variant="outline"
            icon="Package"
            onClick={() => navigate('/inventory')}
            className="w-full"
          >
            View Inventory
          </Button>
          <Button
            variant="outline"
            icon="FileText"
            onClick={() => navigate('/reports')}
            className="w-full"
          >
            Generate Reports
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
            <Badge variant="critical" size="sm">
              {criticalAlerts.length}
            </Badge>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {criticalAlerts.length > 0 ? (
              criticalAlerts.map((item) => {
                const expiry = new Date(item.expirationDate);
                const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                return (
                  <AlertCard
                    key={item.Id}
                    vaccine={item}
                    daysUntilExpiry={daysUntilExpiry}
                  />
                );
              })
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">No critical alerts</p>
              </div>
            )}
          </div>
        </Card>

        {/* Inventory Status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Low Stock Items</p>
                  <p className="text-sm text-orange-600">Below alert threshold</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {lowStockItems.length}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Package" className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Active Lots</p>
                  <p className="text-sm text-blue-600">Currently in inventory</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {inventory.filter(item => item.quantityOnHand > 0).length}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Administration Rate</p>
                  <p className="text-sm text-green-600">This month</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {totalAdministered > 0 ? Math.round((totalAdministered / (totalAdministered + totalDoses)) * 100) : 0}%
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;