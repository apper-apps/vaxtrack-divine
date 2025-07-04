import React, { useState, useEffect } from 'react';
import InventoryTable from '@/components/organisms/InventoryTable';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { inventoryService } from '@/services/api/inventoryService';
import { toast } from 'react-toastify';

const Inventory = () => {
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

  const handleEdit = (item) => {
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await inventoryService.delete(item.Id);
        toast.success('Inventory item deleted successfully');
        loadInventory();
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        toast.error('Failed to delete inventory item');
      }
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadInventory} />;
  }

  if (inventory.length === 0) {
    return (
      <Empty
        title="No Inventory Items"
        description="Start by receiving vaccine shipments to build your inventory."
        actionLabel="Receive Vaccines"
        onAction={() => window.location.href = '/receive'}
        icon="Package"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Monitor vaccine stock levels and expiration dates</p>
        </div>
      </div>

      <InventoryTable
        inventory={inventory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Inventory;