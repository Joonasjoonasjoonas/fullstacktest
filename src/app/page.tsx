import Link from 'next/link'
import { getCategories, getCustomers, type Category, type Customer } from '@/services/db'
import { AddCustomerForm } from '@/app/components/AddCustomerForm'

// Add revalidation to ensure fresh data
export const revalidate = 0;

export default async function Home() {
  const categories = await getCategories();
  const customers = await getCustomers();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8">
          <section>
            <h1 className="text-3xl font-bold text-white mb-6">Product Categories</h1>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => (
                <div key={category.CategoryID} className="bg-gray-800 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-white">{category.CategoryName}</h2>
                  <p className="mt-2">{category.Description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h1 className="text-3xl font-bold text-white mb-6">Customers</h1>
            <AddCustomerForm />
            <div className="grid grid-cols-1 gap-4">
              {customers.map((customer) => (
                <div key={customer.CustomerID} className="bg-gray-800 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-white">{customer.CustomerName}</h2>
                  <p>{customer.ContactName}</p>
                  <p>{customer.Address}</p>
                  <p>{customer.City}, {customer.PostalCode}</p>
                  <p>{customer.Country}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
