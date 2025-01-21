import Link from 'next/link'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2/promise'

interface Category extends RowDataPacket {
  CategoryID: number;
  CategoryName: string;
  Description: string;
}

interface Customer extends RowDataPacket {
  CustomerID: string;
  CustomerName: string;
  Address: string;
  City: string;
  PostalCode: string;
  Country: string;
}

async function getCategories() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [categories] = await connection.execute<Category[]>(`
      SELECT CategoryID, CategoryName, Description
      FROM Categories
      ORDER BY CategoryName
    `);
    return categories;
  } finally {
    if (connection) connection.release();
  }
}

async function getCustomers() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [customers] = await connection.execute<Customer[]>(`
      SELECT CustomerID, CustomerName, Address, City, PostalCode, Country
      FROM Customers
      ORDER BY CustomerName
    `);
    return customers;
  } finally {
    if (connection) connection.release();
  }
}

export default async function Home() {
  const [categories, customers] = await Promise.all([
    getCategories(),
    getCustomers()
  ]);

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories Section */}
          <section>
            <h1 className="text-3xl font-bold text-white mb-6">Product Categories</h1>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => (
                <Link 
                  href={`/categories/${category.CategoryID}`} 
                  key={category.CategoryID}
                  className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <h2 className="text-xl font-bold text-white mb-2">{category.CategoryName}</h2>
                  <p className="text-gray-300">{category.Description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Customers Section */}
          <section>
            <h1 className="text-3xl font-bold text-white mb-6">Customers</h1>
            <div className="grid grid-cols-1 gap-4">
              {customers.map((customer) => (
                <Link
                  href={`/customers/${customer.CustomerID}`}
                  key={customer.CustomerID}
                  className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <h2 className="text-xl font-bold text-white mb-2">{customer.CustomerName}</h2>
                  <div className="text-gray-300 space-y-1">
                    <p>{customer.Address}</p>
                    <p>{customer.City} {customer.PostalCode}</p>
                    <p>{customer.Country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
