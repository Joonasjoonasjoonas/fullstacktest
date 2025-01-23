'use client';

import { useState, useRef } from 'react';

interface FormErrors {
  customerName?: string;
  contactName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

function validateInput(name: string, value: string): string | undefined {
  if (!value.trim()) {
    return `${name} is required`;
  }
  if (value.length < 2) {
    return `${name} must be at least 2 characters`;
  }
  if (value.length > 100) {
    return `${name} must be less than 100 characters`;
  }
  // Check for SQL injection patterns
  if (value.toLowerCase().includes('select') || 
      value.toLowerCase().includes('insert') || 
      value.toLowerCase().includes('delete') || 
      value.toLowerCase().includes('update') ||
      value.includes(';') ||
      value.includes('--') ||
      value.includes('/*')) {
    return 'Invalid input';
  }
  return undefined;
}

export function AddCustomerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      customerName: formData.get('customerName') as string,
      contactName: formData.get('contactName') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string
    };

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      const error = validateInput(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting form data:', data);
      
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (result.success) {
        setMessageType('success');
        setMessage(`Customer added successfully!`);
        formRef.current?.reset();
      } else {
        throw new Error(result.error || 'Failed to add customer');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setMessageType('error');
      setMessage('Failed to add customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Add New Customer</h2>
      {message && (
        <div className={`p-3 rounded mb-4 ${
          messageType === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
        }`}>
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            className={`w-full bg-gray-700 border ${errors.customerName ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.customerName && (
            <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            className={`w-full bg-gray-700 border ${errors.contactName ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.contactName && (
            <p className="text-red-400 text-sm mt-1">{errors.contactName}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={`w-full bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.address && (
            <p className="text-red-400 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className={`w-full bg-gray-700 border ${errors.city ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.city && (
            <p className="text-red-400 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            className={`w-full bg-gray-700 border ${errors.postalCode ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.postalCode && (
            <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            className={`w-full bg-gray-700 border ${errors.country ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.country && (
            <p className="text-red-400 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-md transition-colors`}
          >
            {isSubmitting ? 'Adding Customer...' : 'Add Customer'}
          </button>
        </div>
      </div>
    </form>
  );
} 