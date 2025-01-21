import Link from 'next/link';
import pool from '@/lib/db';

async function getProductCustomers(productId: string) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(`
      SELECT DISTINCT
        Customers.CustomerID,
        Customers.CustomerName,
        Customers.ContactName,
        Customers.City,
        Customers.Country,
        Products.ProductName
      FROM Customers
      JOIN Orders ON Customers.CustomerID = Orders.CustomerID
      JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
      JOIN Products ON OrderDetails.ProductID = Products.ProductID
      WHERE Products.ProductID = ?
      ORDER BY Customers.CustomerName
    `, [productId]);
    return results;
  } finally {
    if (connection) connection.release();
  }
}

export default async function ProductCustomers({ params }: { params: { id: string } }) {
  const customers = await getProductCustomers(params.id);
  const productName = customers[0]?.ProductName || 'Product';

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/"
          className="text-blue-300 hover:text-blue-200 flex items-center gap-2 mb-4"
        >
          ← Back to Front Page
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Customers who ordered {productName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer: any) => (
            <Link
              href={`/customers/${customer.CustomerID}`}
              key={customer.CustomerID}
              className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <h2 className="text-xl font-bold text-white mb-2">{customer.CustomerName}</h2>
              <p className="text-gray-300">{customer.ContactName}</p>
              <p className="text-gray-400">{customer.City}, {customer.Country}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 