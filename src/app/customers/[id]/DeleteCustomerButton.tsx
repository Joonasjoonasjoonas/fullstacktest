'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { deleteCustomer } from '@/app/actions';

export function DeleteCustomerButton({ customerId }: { customerId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    if (isDeleting || deleteRequested) {
      console.log('Delete already in progress or requested');
      return;
    }

    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteRequested(true);
      console.log('Attempting to delete customer:', customerId);
      
      const result = await deleteCustomer(customerId);
      console.log('Delete result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete customer');
      }

      console.log('Delete successful, navigating...');
      router.push('/');
      router.refresh();

    } catch (error) {
      console.error('Delete error details:', {
        error,
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      alert(error instanceof Error ? error.message : 'Failed to delete customer');
    } finally {
      setIsDeleting(false);
      setDeleteRequested(false);
    }
  }, [customerId, router, isDeleting, deleteRequested]);

  if (deleteRequested && !isDeleting) {
    return (
      <button
        disabled
        className="bg-gray-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
        type="button"
      >
        Redirecting...
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || deleteRequested}
      className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 
        ${(isDeleting || deleteRequested) ? 'opacity-50 cursor-not-allowed' : ''}`}
      type="button"
    >
      {isDeleting ? 'Deleting...' : 
       deleteRequested ? 'Delete Successful' : 
       'Delete Customer'}
    </button>
  );
} 