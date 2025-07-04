import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/molecules/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { inventoryService } from '@/services/api/inventoryService';
import { lossService } from '@/services/api/lossService';

const VaccineLoss = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    inventoryId: '',
    quantity: '',
    reason: '',
    details: '',
    reportDate: new Date().toISOString().split('T')[0],
    trainingAcknowledged: false
  });
  const [formErrors, setFormErrors] = useState({});

  const lossReasons = [
    { value: 'expired', label: 'Expired' },
    { value: 'damaged', label: 'Damaged during transport' },
    { value: 'temperature', label: 'Temperature excursion' },
    { value: 'contamination', label: 'Contamination' },
    { value: 'broken-vial', label: 'Broken vial' },
    { value: 'drawing-error', label: 'Drawing error' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await inventoryService.getAll();
      setInventory(data.filter(item => item.quantityOnHand > 0));
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.inventoryId) {
      errors.inventoryId = 'Please select an inventory item';
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      errors.quantity = 'Please enter a valid quantity';
    }

    if (!formData.reason) {
      errors.reason = 'Please select a reason for the loss';
    }

    if (!formData.details) {
      errors.details = 'Please provide details about the loss';
    }

    if (!formData.trainingAcknowledged) {
      errors.trainingAcknowledged = 'Training acknowledgment is required';
    }

    const selectedItem = inventory.find(item => item.Id === parseInt(formData.inventoryId));
    if (selectedItem && parseInt(formData.quantity) > selectedItem.quantityOnHand) {
      errors.quantity = 'Quantity cannot exceed available inventory';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const selectedItem = inventory.find(item => item.Id === parseInt(formData.inventoryId));
      
      // Create loss record
      await lossService.create({
        inventoryId: parseInt(formData.inventoryId),
        quantity: parseInt(formData.quantity),
        reason: formData.reason,
        details: formData.details,
        reportDate: formData.reportDate
      });

      // Update inventory quantity
      const newQuantity = selectedItem.quantityOnHand - parseInt(formData.quantity);
      await inventoryService.update(selectedItem.Id, {
        ...selectedItem,
        quantityOnHand: newQuantity
      });

      toast.success('Vaccine loss recorded successfully');
      
      // Reset form
      setFormData({
        inventoryId: '',
        quantity: '',
        reason: '',
        details: '',
        reportDate: new Date().toISOString().split('T')[0],
        trainingAcknowledged: false
      });

      // Reload inventory
      loadInventory();

    } catch (error) {
      console.error('Error recording loss:', error);
      toast.error('Failed to record vaccine loss');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading type="form" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadInventory} />;
  }

  const inventoryOptions = inventory.map(item => ({
    value: item.Id,
    label: `${item.vaccine?.commercialName || 'Unknown'} - Lot: ${item.lotNumber} (${item.quantityOnHand} available)`
  }));

  const selectedItem = inventory.find(item => item.Id === parseInt(formData.inventoryId));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vaccine Loss Reporting</h1>
          <p className="text-gray-600">Report vaccine wastage, expiration, or other losses</p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Report Vaccine Loss</h2>
          <p className="text-sm text-gray-600 mt-1">
            Use this form to document any vaccine losses including expiration, damage, or wastage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Select
            label="Select Inventory Item"
            name="inventoryId"
            value={formData.inventoryId}
            onChange={handleInputChange}
            options={inventoryOptions}
            placeholder="Choose vaccine lot to report loss for"
            required
            error={formErrors.inventoryId}
          />

          {selectedItem && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Selected Item Details</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Vaccine:</strong> {selectedItem.vaccine?.commercialName}</p>
                <p><strong>Generic Name:</strong> {selectedItem.vaccine?.genericName}</p>
                <p><strong>Lot Number:</strong> {selectedItem.lotNumber}</p>
                <p><strong>Available Quantity:</strong> {selectedItem.quantityOnHand}</p>
                <p><strong>Expiration Date:</strong> {new Date(selectedItem.expirationDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Quantity Lost"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter number of doses lost"
              min="1"
              max={selectedItem?.quantityOnHand || 1}
              required
              error={formErrors.quantity}
            />

            <FormField
              label="Report Date"
              name="reportDate"
              type="date"
              value={formData.reportDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <Select
            label="Loss Reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            options={lossReasons}
            placeholder="Select reason for loss"
            required
            error={formErrors.reason}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Provide detailed explanation of the loss circumstances, prevention measures that could be taken, and any additional relevant information..."
              required
            />
            {formErrors.details && (
              <p className="mt-1 text-sm text-red-600">{formErrors.details}</p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Training Acknowledgment</h4>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="trainingAcknowledged"
                checked={formData.trainingAcknowledged}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">I acknowledge that I have received training on:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Proper vaccine storage and handling procedures</li>
                  <li>Temperature monitoring and excursion protocols</li>
                  <li>Vaccine loss prevention strategies</li>
                  <li>Appropriate documentation and reporting requirements</li>
                </ul>
              </div>
            </div>
            {formErrors.trainingAcknowledged && (
              <p className="mt-2 text-sm text-red-600">{formErrors.trainingAcknowledged}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  inventoryId: '',
                  quantity: '',
                  reason: '',
                  details: '',
                  reportDate: new Date().toISOString().split('T')[0],
                  trainingAcknowledged: false
                });
                setFormErrors({});
              }}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={submitting}
              disabled={submitting}
            >
              Report Loss
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VaccineLoss;