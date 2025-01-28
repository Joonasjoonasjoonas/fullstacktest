import Link from 'next/link';
import { getCustomerOrders } from '@/services/db/customers';
import { DeleteCustomerButton } from './DeleteCustomerButton';
import { RowDataPacket } from 'mysql2';
import { getCustomerById } from '@/app/actions';

interface CustomerOrder extends RowDataPacket {
  OrderID: number;
  CustomerID: string;
  EmployeeID: number;
  OrderDate: Date;
  ShipperID: number;
  ProductID: number;
  Quantity: number;
  ProductName: string;
  Unit: string;
  Price: number;
}

export default async function CustomerPage({ params }: { params: { id: string } }) {
  const result = await getCustomerById(params.id);
  
  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  const customer = result.data;
  const orders = await getCustomerOrders(params.id) as CustomerOrder[];

  console.log('Rendering customer page with ID:', params.id);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">{customer.CustomerName}</h1>
            <Link 
              href="/" 
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Home Page
            </Link>
          </div>
          
          {customer && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">{customer.CustomerName}</h1>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p className="font-semibold">Customer ID:</p>
                  <p>{customer.CustomerID}</p>
                </div>
                <div>
                  <p className="font-semibold">Contact:</p>
                  <p>{customer.ContactName}</p>
                </div>
                <div>
                  <p className="font-semibold">Location:</p>
                  <p>{customer.City}, {customer.Country}</p>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mb-4">Order History</h2>
          
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={`${order.OrderID}-${order.ProductName}`} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-gray-300">{order.OrderID}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(order.OrderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{order.ProductName}</td>
                    <td className="px-6 py-4 text-gray-300">{order.Quantity}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-300">
                      No orders found for this customer
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <DeleteCustomerButton customerId={params.id} />
          </div>
        </div>
      </main>
    </div>
  );
} 