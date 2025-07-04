import React, { useState } from 'react';
import VaccineReceiveForm from '@/components/organisms/VaccineReceiveForm';

const ReceiveVaccines = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receive Vaccines</h1>
          <p className="text-gray-600">Record incoming vaccine shipments and quality inspections</p>
        </div>
      </div>

      <VaccineReceiveForm key={refreshKey} onSuccess={handleSuccess} />
    </div>
  );
};

export default ReceiveVaccines;