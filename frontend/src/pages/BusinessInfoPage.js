import React, { useState } from 'react';
import BusinessInfoForm from '../components/BusinessInfoForm';

const BusinessInfoPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBusinessInfoSubmit = async (data) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Business Information:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Handle successful submission
      console.log('Business information saved successfully!');
      alert('Business information saved successfully!');
      
    } catch (error) {
      console.error('Business info submission error:', error);
      alert('Failed to save business information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const initialData = {
    businessName: '',
    coreOffering: '',
    uniqueSellingProposition: '',
    targetAudience: '',
    businessMission: ''
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <BusinessInfoForm
        onSubmit={handleBusinessInfoSubmit}
        initialData={initialData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BusinessInfoPage;