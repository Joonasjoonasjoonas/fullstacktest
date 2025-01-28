'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { deleteCustomer } from '@/app/actions';

export function DeleteCustomerButton({ customerId }: { customerId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteCustomer(customerId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setMessage('Customer deleted successfully');
      // Wait for 1.5 seconds to show the success message before redirecting
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);

    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete customer');
      setIsDeleting(false);
    }
  }, [customerId, router, isDeleting]);

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 
          ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        type="button"
      >
        {isDeleting ? 'Deleting...' : 'Delete Customer'}
      </button>
      {message && (
        <p className="mt-2 text-green-400">{message}</p>
      )}
    </div>
  );
} 