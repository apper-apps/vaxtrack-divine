import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { inventoryService } from '@/services/api/inventoryService';
import { administrationService } from '@/services/api/administrationService';

const Reports = () => {
  const [inventory, setInventory] = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
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
      console.error('Error loading report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalDoses: inventory.reduce((sum, item) => sum + item.quantityOnHand, 0),
        totalAdministered: administrations.reduce((sum, admin) => sum + admin.dosesAdministered, 0),
        activeLots: inventory.filter(item => item.quantityOnHand > 0).length,
        expiredLots: inventory.filter(item => new Date(item.expirationDate) < new Date()).length
      },
      inventory: inventory,
      administrations: administrations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaccine-inventory-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vaccine Inventory Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #0066CC; padding-bottom: 20px; margin-bottom: 30px; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f5f5f5; }
            .status-good { color: #00A651; }
            .status-warning { color: #FFA500; }
            .status-critical { color: #DC3545; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>VaxTrack Pro - Inventory Report</h1>
            <p>Generated on: ${format(new Date(), 'PPP')}</p>
          </div>
          
          <div class="summary">
            <div class="summary-card">
              <h3>Total Doses</h3>
              <p>${inventory.reduce((sum, item) => sum + item.quantityOnHand, 0).toLocaleString()}</p>
            </div>
            <div class="summary-card">
              <h3>Administered</h3>
              <p>${administrations.reduce((sum, admin) => sum + admin.dosesAdministered, 0).toLocaleString()}</p>
            </div>
            <div class="summary-card">
              <h3>Active Lots</h3>
              <p>${inventory.filter(item => item.quantityOnHand > 0).length}</p>
            </div>
            <div class="summary-card">
              <h3>Expired Lots</h3>
              <p>${inventory.filter(item => new Date(item.expirationDate) < new Date()).length}</p>
            </div>
          </div>

          <h2>Current Inventory</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Lot Number</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${inventory.map(item => {
                const expiry = new Date(item.expirationDate);
                const daysUntilExpiry = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                let statusClass = 'status-good';
                let statusText = 'Good';
                
                if (daysUntilExpiry <= 0) {
                  statusClass = 'status-critical';
                  statusText = 'Expired';
                } else if (daysUntilExpiry <= 30) {
                  statusClass = 'status-warning';
                  statusText = 'Expiring Soon';
                }
                
                return `
                  <tr>
                    <td>${item.vaccine?.commercialName || 'Unknown'}</td>
                    <td>${item.lotNumber}</td>
                    <td>${item.quantityOnHand}</td>
                    <td>${format(expiry, 'MMM d, yyyy')}</td>
                    <td class="${statusClass}">${statusText}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReportData} />;
  }

  const now = new Date();
  const totalDoses = inventory.reduce((sum, item) => sum + item.quantityOnHand, 0);
  const totalAdministered = administrations.reduce((sum, admin) => sum + admin.dosesAdministered, 0);
  const activeLots = inventory.filter(item => item.quantityOnHand > 0).length;
  const expiredLots = inventory.filter(item => new Date(item.expirationDate) < now).length;
  const expiringLots = inventory.filter(item => {
    const expiry = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and view inventory reports</p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            icon="Printer"
            onClick={printReport}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            icon="Download"
            onClick={generateReport}
          >
            Download Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Doses</p>
              <p className="text-3xl font-bold text-blue-700">{totalDoses.toLocaleString()}</p>
            </div>
            <ApperIcon name="Package" className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Administered</p>
              <p className="text-3xl font-bold text-green-700">{totalAdministered.toLocaleString()}</p>
            </div>
            <ApperIcon name="Syringe" className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Active Lots</p>
              <p className="text-3xl font-bold text-purple-700">{activeLots}</p>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Expired Lots</p>
              <p className="text-3xl font-bold text-orange-700">{expiredLots}</p>
            </div>
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Current Inventory Summary</h2>
          <p className="text-sm text-gray-600">As of {format(new Date(), 'PPP')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vaccine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lot Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => {
                const expiry = new Date(item.expirationDate);
                const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                
                let status = { variant: 'good', label: 'Good' };
                if (daysUntilExpiry <= 0) {
                  status = { variant: 'critical', label: 'Expired' };
                } else if (daysUntilExpiry <= 7) {
                  status = { variant: 'critical', label: 'Critical' };
                } else if (daysUntilExpiry <= 30) {
                  status = { variant: 'warning', label: 'Expiring Soon' };
                }

                return (
                  <tr key={item.Id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.vaccine?.commercialName || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.vaccine?.genericName || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{item.lotNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.quantityOnHand.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(expiry, 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;