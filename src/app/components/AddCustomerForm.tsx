'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCustomer } from '@/app/actions';
import type { CreateCustomerData } from '@/services/db/customers';

interface FormErrors {
  customerName?: string;
  contactName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

function validateInput(name: string, value: string): string | undefined {
  const displayName = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();

  if (!value.trim()) {
    return `${displayName} is required`;
  }
  if (value.length < 2) {
    return `${displayName} must be at least 2 characters`;
  }
  if (value.length > 100) {
    return `${displayName} must be less than 100 characters`;
  }
  return undefined;
}

export function AddCustomerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const getInputClassName = (error?: string) => `w-full bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} 
    rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:bg-gray-700 caret-gray-100
    [&:-webkit-autofill]:bg-gray-700 
    [&:-webkit-autofill]:border-gray-600
    [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_rgb(55,65,81)_inset]
    [-webkit-text-fill-color:rgb(243,244,246)]
    [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(243,244,246)]`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleReturnToForm = () => {
    setShowSuccessModal(false);
    formRef.current?.reset();
    setErrors({});
    router.refresh();
  };

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true);
      const customerData: CreateCustomerData = {
        customerName: formData.get('customerName') as string,
        contactName: formData.get('contactName') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
      };

      // Validate all fields
      const newErrors: FormErrors = {};
      Object.entries(customerData).forEach(([key, value]) => {
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

      const result = await createCustomer(customerData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert(error instanceof Error ? error.message : 'Failed to create customer');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form ref={formRef} action={handleSubmit} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Add New Customer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              onChange={handleInputChange}
              className={getInputClassName(errors.customerName)}
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
              onChange={handleInputChange}
              className={getInputClassName(errors.contactName)}
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
              onChange={handleInputChange}
              className={getInputClassName(errors.address)}
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
              onChange={handleInputChange}
              className={getInputClassName(errors.city)}
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
              onChange={handleInputChange}
              className={getInputClassName(errors.postalCode)}
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
              onChange={handleInputChange}
              className={getInputClassName(errors.country)}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Success!</h2>
            <p className="text-gray-300 mb-6">Customer was added successfully</p>
            <button
              onClick={handleReturnToForm}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}