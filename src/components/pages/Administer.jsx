import React, { useState, useEffect } from 'react';
import AdministrationTable from '@/components/organisms/AdministrationTable';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { inventoryService } from '@/services/api/inventoryService';

const Administer = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    loadInventory();
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadInventory} />;
  }

  const activeInventory = inventory.filter(item => item.quantityOnHand > 0);

  if (activeInventory.length === 0) {
    return (
      <Empty
        title="No Vaccines Available"
        description="No vaccines are currently available for administration. Receive vaccines first to build your inventory."
        actionLabel="Receive Vaccines"
        onAction={() => window.location.href = '/receive'}
        icon="Syringe"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administer Vaccines</h1>
          <p className="text-gray-600">Record administered doses and update inventory levels</p>
        </div>
      </div>

      <AdministrationTable
        inventory={activeInventory}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Administer;