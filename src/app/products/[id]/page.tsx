import Link from 'next/link';
import { getProductCustomers } from '@/services/db/products';

export default async function ProductCustomers({ params }: { params: { id: string } }) {
  const customers = await getProductCustomers(params.id);
  const productName = customers[0]?.ProductName || 'Product';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/"
          className="text-blue-300 hover:text-blue-200 flex items-center gap-2 mb-4"
        >
          ← Back to Front Page
        </Link>

        <h1 className="text-3xl font-bold text-white mb-6">
          Customers who bought {productName}
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {customers.map((customer: any) => (
            <Link
              key={customer.CustomerID}
              href={`/customers/${customer.CustomerID}`}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <h2 className="text-xl font-semibold text-white">
                {customer.CustomerName}
              </h2>
              <p className="text-gray-300">{customer.ContactName}</p>
              <p className="text-gray-300">
                {customer.City}, {customer.Country}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 