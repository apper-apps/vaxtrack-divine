import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { vaccineService } from '@/services/api/vaccineService';

const Settings = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    commercialName: '',
    genericName: '',
    family: '',
    alertThreshold: '10'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    try {
      setLoading(true);
      const data = await vaccineService.getAll();
      setVaccines(data);
    } catch (error) {
      console.error('Error loading vaccines:', error);
      toast.error('Failed to load vaccines');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.commercialName || !formData.genericName || !formData.family) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const vaccineData = {
        ...formData,
        alertThreshold: parseInt(formData.alertThreshold)
      };

      if (editingId) {
        await vaccineService.update(editingId, vaccineData);
        toast.success('Vaccine updated successfully');
        setEditingId(null);
      } else {
        await vaccineService.create(vaccineData);
        toast.success('Vaccine added successfully');
      }

      setFormData({
        commercialName: '',
        genericName: '',
        family: '',
        alertThreshold: '10'
      });

      loadVaccines();
    } catch (error) {
      console.error('Error saving vaccine:', error);
      toast.error('Failed to save vaccine');
    }
  };

  const handleEdit = (vaccine) => {
    setFormData({
      commercialName: vaccine.commercialName,
      genericName: vaccine.genericName,
      family: vaccine.family,
      alertThreshold: vaccine.alertThreshold.toString()
    });
    setEditingId(vaccine.Id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vaccine?')) {
      try {
        await vaccineService.delete(id);
        toast.success('Vaccine deleted successfully');
        loadVaccines();
      } catch (error) {
        console.error('Error deleting vaccine:', error);
        toast.error('Failed to delete vaccine');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      commercialName: '',
      genericName: '',
      family: '',
      alertThreshold: '10'
    });
  };

  const families = ['COVID-19', 'Influenza', 'Hepatitis', 'Pneumococcal', 'Meningococcal', 'HPV', 'Tdap', 'MMR', 'Varicella', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure vaccine types and system settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add/Edit Vaccine Form */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Vaccine' : 'Add New Vaccine'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure vaccine information for inventory management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Commercial Name"
              name="commercialName"
              value={formData.commercialName}
              onChange={handleInputChange}
              placeholder="e.g., Pfizer-BioNTech COVID-19"
              required
            />

            <FormField
              label="Generic Name"
              name="genericName"
              value={formData.genericName}
              onChange={handleInputChange}
              placeholder="e.g., COVID-19 mRNA Vaccine"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vaccine Family <span className="text-red-500">*</span>
              </label>
              <select
                name="family"
                value={formData.family}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select family</option>
                {families.map(family => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </select>
            </div>

            <FormField
              label="Alert Threshold"
              name="alertThreshold"
              type="number"
              value={formData.alertThreshold}
              onChange={handleInputChange}
              placeholder="10"
              min="1"
              required
            />

            <div className="flex justify-end space-x-3 pt-4">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary">
                {editingId ? 'Update Vaccine' : 'Add Vaccine'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Vaccine List */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Configured Vaccines</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage existing vaccine configurations
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <ApperIcon name="Loader2" className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading vaccines...</p>
              </div>
            ) : vaccines.length === 0 ? (
              <div className="p-6 text-center">
                <ApperIcon name="Package" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No vaccines configured yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {vaccines.map((vaccine) => (
                  <div key={vaccine.Id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {vaccine.commercialName}
                        </h4>
                        <p className="text-sm text-gray-600">{vaccine.genericName}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {vaccine.family}
                          </span>
                          <span className="text-xs text-gray-500">
                            Alert: {vaccine.alertThreshold} doses
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEdit(vaccine)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDelete(vaccine.Id)}
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Shield" className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">VaxTrack Pro</p>
                  <p className="text-sm text-green-600">Version 1.0.0</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Database" className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Database Status</p>
                  <p className="text-sm text-blue-600">Connected</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Clock" className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Last Sync</p>
                  <p className="text-sm text-purple-600">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;