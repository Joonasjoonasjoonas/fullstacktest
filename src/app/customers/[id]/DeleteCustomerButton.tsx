'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export function DeleteCustomerButton({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

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
      console.log('Sending DELETE request for customer:', customerId);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete customer');
      }

      console.log('Delete successful, navigating...');
      setTimeout(() => {
        try {
          router.push('/customers');
          setTimeout(() => {
            router.refresh();
          }, 100);
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
      }, 100);

    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('Request timed out');
        alert('Request timed out. Please try again.');
      } else {
        console.error('Delete error:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete customer');
      }
      setDeleteRequested(false);
    } finally {
      setIsDeleting(false);
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