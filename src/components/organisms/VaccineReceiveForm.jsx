import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/molecules/Select';
import { vaccineService } from '@/services/api/vaccineService';
import { inventoryService } from '@/services/api/inventoryService';
import { receiptService } from '@/services/api/receiptService';

const VaccineReceiveForm = ({ onSuccess }) => {
  const [vaccines, setVaccines] = useState([]);
  const [formData, setFormData] = useState({
    vaccineId: '',
    lotNumber: '',
    quantitySent: '',
    quantityReceived: '',
    passedInspection: '',
    failedInspection: '',
    discrepancyReason: '',
    expirationDate: '',
    receivedDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    try {
      const vaccineData = await vaccineService.getAll();
      setVaccines(vaccineData);
    } catch (error) {
      console.error('Error loading vaccines:', error);
      toast.error('Failed to load vaccines');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-calculate inspection totals
    if (name === 'quantityReceived' || name === 'passedInspection' || name === 'failedInspection') {
      const received = name === 'quantityReceived' ? parseInt(value) || 0 : parseInt(formData.quantityReceived) || 0;
      const passed = name === 'passedInspection' ? parseInt(value) || 0 : parseInt(formData.passedInspection) || 0;
      const failed = name === 'failedInspection' ? parseInt(value) || 0 : parseInt(formData.failedInspection) || 0;
      
      if (name === 'quantityReceived') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          passedInspection: received.toString(),
          failedInspection: '0'
        }));
      } else if (name === 'passedInspection') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          failedInspection: Math.max(0, received - passed).toString()
        }));
      } else if (name === 'failedInspection') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          passedInspection: Math.max(0, received - failed).toString()
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vaccineId) newErrors.vaccineId = 'Vaccine selection is required';
    if (!formData.lotNumber) newErrors.lotNumber = 'Lot number is required';
    if (!formData.quantitySent) newErrors.quantitySent = 'Quantity sent is required';
    if (!formData.quantityReceived) newErrors.quantityReceived = 'Quantity received is required';
    if (!formData.passedInspection) newErrors.passedInspection = 'Passed inspection count is required';
    if (!formData.failedInspection) newErrors.failedInspection = 'Failed inspection count is required';
    if (!formData.expirationDate) newErrors.expirationDate = 'Expiration date is required';

    const quantityReceived = parseInt(formData.quantityReceived) || 0;
    const passed = parseInt(formData.passedInspection) || 0;
    const failed = parseInt(formData.failedInspection) || 0;

    if (passed + failed !== quantityReceived) {
      newErrors.inspection = 'Passed + Failed inspection must equal quantity received';
    }

    if (failed > 0 && !formData.discrepancyReason) {
      newErrors.discrepancyReason = 'Discrepancy reason is required when vaccines fail inspection';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create receipt record
      const receiptData = {
        ...formData,
        quantitySent: parseInt(formData.quantitySent),
        quantityReceived: parseInt(formData.quantityReceived),
        passedInspection: parseInt(formData.passedInspection),
        failedInspection: parseInt(formData.failedInspection),
        receivedDate: formData.receivedDate
      };

      await receiptService.create(receiptData);

      // Create inventory record for passed inspection doses
      const passedDoses = parseInt(formData.passedInspection);
      if (passedDoses > 0) {
        const inventoryData = {
          vaccineId: formData.vaccineId,
          lotNumber: formData.lotNumber,
          quantityOnHand: passedDoses,
          expirationDate: formData.expirationDate,
          receivedDate: formData.receivedDate
        };

        await inventoryService.create(inventoryData);
      }

      toast.success('Vaccine receipt recorded successfully!');
      
      // Reset form
      setFormData({
        vaccineId: '',
        lotNumber: '',
        quantitySent: '',
        quantityReceived: '',
        passedInspection: '',
        failedInspection: '',
        discrepancyReason: '',
        expirationDate: '',
        receivedDate: new Date().toISOString().split('T')[0]
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Error creating receipt:', error);
      toast.error('Failed to record vaccine receipt');
    } finally {
      setLoading(false);
    }
  };

  const vaccineOptions = vaccines.map(vaccine => ({
    value: vaccine.Id,
    label: `${vaccine.commercialName} (${vaccine.genericName})`
  }));

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Receive Vaccines</h2>
        <p className="mt-1 text-sm text-gray-600">
          Record details of received vaccine shipments and quality inspection results.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Select
              label="Vaccine"
              name="vaccineId"
              value={formData.vaccineId}
              onChange={handleInputChange}
              options={vaccineOptions}
              placeholder="Select vaccine"
              required
              error={errors.vaccineId}
            />
          </div>

          <FormField
            label="Lot Number"
            name="lotNumber"
            value={formData.lotNumber}
            onChange={handleInputChange}
            placeholder="Enter lot number"
            required
            error={errors.lotNumber}
          />

          <FormField
            label="Expiration Date"
            name="expirationDate"
            type="date"
            value={formData.expirationDate}
            onChange={handleInputChange}
            required
            error={errors.expirationDate}
          />

          <FormField
            label="Quantity Sent"
            name="quantitySent"
            type="number"
            value={formData.quantitySent}
            onChange={handleInputChange}
            placeholder="Enter quantity sent"
            required
            error={errors.quantitySent}
          />

          <FormField
            label="Quantity Received"
            name="quantityReceived"
            type="number"
            value={formData.quantityReceived}
            onChange={handleInputChange}
            placeholder="Enter quantity received"
            required
            error={errors.quantityReceived}
          />

          <FormField
            label="Doses Passing Inspection"
            name="passedInspection"
            type="number"
            value={formData.passedInspection}
            onChange={handleInputChange}
            placeholder="Enter doses passed"
            required
            error={errors.passedInspection}
          />

          <FormField
            label="Doses Failed Inspection"
            name="failedInspection"
            type="number"
            value={formData.failedInspection}
            onChange={handleInputChange}
            placeholder="Enter doses failed"
            required
            error={errors.failedInspection}
          />

          <FormField
            label="Received Date"
            name="receivedDate"
            type="date"
            value={formData.receivedDate}
            onChange={handleInputChange}
            required
          />

          <div className="md:col-span-2">
            <FormField
              label="Discrepancy Reason"
              name="discrepancyReason"
              value={formData.discrepancyReason}
              onChange={handleInputChange}
              placeholder="Enter reason for any discrepancies or failed inspections"
              error={errors.discrepancyReason}
            />
          </div>
        </div>

        {errors.inspection && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.inspection}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                vaccineId: '',
                lotNumber: '',
                quantitySent: '',
                quantityReceived: '',
                passedInspection: '',
                failedInspection: '',
                discrepancyReason: '',
                expirationDate: '',
                receivedDate: new Date().toISOString().split('T')[0]
              });
              setErrors({});
            }}
          >
            Clear Form
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Record Receipt
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default VaccineReceiveForm;