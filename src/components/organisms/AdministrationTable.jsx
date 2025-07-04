import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';
import { administrationService } from '@/services/api/administrationService';
import { inventoryService } from '@/services/api/inventoryService';

const AdministrationTable = ({ inventory, onUpdate }) => {
  const [administrationData, setAdministrationData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize administration data state
    const initialData = {};
    inventory.forEach(item => {
      initialData[item.Id] = '';
    });
    setAdministrationData(initialData);
  }, [inventory]);

  const handleInputChange = (inventoryId, value) => {
    setAdministrationData(prev => ({
      ...prev,
      [inventoryId]: value
    }));
  };

  const handleAdminister = async (inventoryItem) => {
    const dosesToAdminister = parseInt(administrationData[inventoryItem.Id]) || 0;
    
    if (dosesToAdminister <= 0) {
      toast.error('Please enter a valid number of doses to administer');
      return;
    }

    if (dosesToAdminister > inventoryItem.quantityOnHand) {
      toast.error('Cannot administer more doses than available in inventory');
      return;
    }

    setLoading(true);

    try {
      // Record administration
      await administrationService.create({
        inventoryId: inventoryItem.Id,
        dosesAdministered: dosesToAdminister,
        administrationDate: new Date().toISOString().split('T')[0]
      });

      // Update inventory quantity
      const newQuantity = inventoryItem.quantityOnHand - dosesToAdminister;
      await inventoryService.update(inventoryItem.Id, {
        ...inventoryItem,
        quantityOnHand: newQuantity
      });

      toast.success(`Successfully administered ${dosesToAdminister} doses`);
      
      // Clear input
      setAdministrationData(prev => ({
        ...prev,
        [inventoryItem.Id]: ''
      }));

      if (onUpdate) {
        onUpdate();
      }

    } catch (error) {
      console.error('Error administering doses:', error);
      toast.error('Failed to record administration');
    } finally {
      setLoading(false);
    }
  };

  const getExpirationStatus = (expirationDate) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return { variant: 'critical', label: 'Expired' };
    } else if (daysUntilExpiry <= 7) {
      return { variant: 'critical', label: 'Critical' };
    } else if (daysUntilExpiry <= 30) {
      return { variant: 'warning', label: 'Warning' };
    } else {
      return { variant: 'good', label: 'Good' };
    }
  };

  const activeInventory = inventory.filter(item => item.quantityOnHand > 0);

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Administer Vaccines</h2>
        <p className="mt-1 text-sm text-gray-600">
          Record administered doses from current inventory. Quantities will be automatically updated.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vaccine Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generic Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lot Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity On Hand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Administer Doses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeInventory.map((item) => {
              const status = getExpirationStatus(item.expirationDate);
              return (
                <tr key={item.Id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.vaccine?.commercialName || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {item.vaccine?.genericName || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">
                      {item.lotNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(item.expirationDate), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.quantityOnHand}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={status.variant} size="sm">
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      type="number"
                      value={administrationData[item.Id] || ''}
                      onChange={(e) => handleInputChange(item.Id, e.target.value)}
                      placeholder="Enter doses"
                      min="0"
                      max={item.quantityOnHand}
                      className="w-24"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAdminister(item)}
                      disabled={loading || !administrationData[item.Id] || parseInt(administrationData[item.Id]) <= 0}
                      loading={loading}
                    >
                      Record
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeInventory.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Syringe" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No vaccines available for administration.</p>
        </div>
      )}
    </Card>
  );
};

export default AdministrationTable;