import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow, format } from 'date-fns';

const InventoryTable = ({ inventory, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expirationDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterFamily, setFilterFamily] = useState('');

  const families = [...new Set(inventory.map(item => item.vaccine?.family).filter(Boolean))];

  const getExpirationStatus = (expirationDate) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return { variant: 'critical', label: 'Expired', days: daysUntilExpiry };
    } else if (daysUntilExpiry <= 7) {
      return { variant: 'critical', label: 'Critical', days: daysUntilExpiry };
    } else if (daysUntilExpiry <= 30) {
      return { variant: 'warning', label: 'Warning', days: daysUntilExpiry };
    } else {
      return { variant: 'good', label: 'Good', days: daysUntilExpiry };
    }
  };

  const filteredAndSortedInventory = React.useMemo(() => {
    let filtered = inventory.filter(item => {
      const matchesSearch = 
        item.vaccine?.commercialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vaccine?.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lotNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFamily = !filterFamily || item.vaccine?.family === filterFamily;
      
      return matchesSearch && matchesFamily;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'commercialName':
          aValue = a.vaccine?.commercialName || '';
          bValue = b.vaccine?.commercialName || '';
          break;
        case 'genericName':
          aValue = a.vaccine?.genericName || '';
          bValue = b.vaccine?.genericName || '';
          break;
        case 'family':
          aValue = a.vaccine?.family || '';
          bValue = b.vaccine?.family || '';
          break;
        case 'lotNumber':
          aValue = a.lotNumber || '';
          bValue = b.lotNumber || '';
          break;
        case 'expirationDate':
          aValue = new Date(a.expirationDate);
          bValue = new Date(b.expirationDate);
          break;
        case 'quantityOnHand':
          aValue = a.quantityOnHand || 0;
          bValue = b.quantityOnHand || 0;
          break;
        default:
          aValue = a.expirationDate;
          bValue = b.expirationDate;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [inventory, searchTerm, sortBy, sortOrder, filterFamily]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortBy === field && (
          <ApperIcon 
            name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            className="h-4 w-4" 
          />
        )}
      </div>
    </th>
  );

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">Vaccine Inventory</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search vaccines..."
              className="w-full sm:w-64"
            />
            <Select
              value={filterFamily}
              onChange={(e) => setFilterFamily(e.target.value)}
              options={[
                { value: '', label: 'All Families' },
                ...families.map(family => ({ value: family, label: family }))
              ]}
              className="w-full sm:w-48"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="commercialName">Commercial Name</SortableHeader>
              <SortableHeader field="genericName">Generic Name</SortableHeader>
              <SortableHeader field="family">Family</SortableHeader>
              <SortableHeader field="lotNumber">Lot Number</SortableHeader>
              <SortableHeader field="expirationDate">Expiration</SortableHeader>
              <SortableHeader field="quantityOnHand">Quantity</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedInventory.map((item, index) => {
              const status = getExpirationStatus(item.expirationDate);
              return (
                <motion.tr
                  key={item.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="table-row"
                >
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
                    <div className="text-sm text-gray-600">
                      {item.vaccine?.family || 'Unknown'}
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
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(item.expirationDate), { addSuffix: true })}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEdit && onEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => onDelete && onDelete(item)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedInventory.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Package" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No inventory items found matching your criteria.</p>
        </div>
      )}
    </Card>
  );
};

export default InventoryTable;