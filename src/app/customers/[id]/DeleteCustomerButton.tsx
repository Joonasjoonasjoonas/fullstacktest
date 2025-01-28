'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { deleteCustomer } from '@/app/actions';

export function DeleteCustomerButton({ customerId }: { customerId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setShowConfirmModal(false);
      
      const result = await deleteCustomer(customerId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setShowSuccessModal(true);

    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleReturnHome = () => {
    router.push('/');
    router.refresh();
  };

  return (
    <div>
      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 
          ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        type="button"
      >
        {isDeleting ? 'Deleting...' : 'Delete Customer'}
      </button>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this customer?</p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Success!</h2>
            <p className="text-gray-300 mb-6">Customer was deleted successfully</p>
            <button
              onClick={handleReturnHome}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Return to Home Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 