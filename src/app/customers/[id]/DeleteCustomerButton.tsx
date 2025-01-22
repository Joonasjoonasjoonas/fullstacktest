'use client';

import { useRouter } from 'next/navigation';

export function DeleteCustomerButton({ customerId }: { customerId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      router.push('/customers');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete customer');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Delete Customer
    </button>
  );
} 