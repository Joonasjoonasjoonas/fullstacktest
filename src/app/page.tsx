import Link from 'next/link'
import { getCategories, getCustomers } from '@/app/actions'
import { AddCustomerForm } from '@/app/components/AddCustomerForm'

// Add revalidation to ensure fresh data
export const revalidate = 0;

export default async function Home() {
  const categoriesResult = await getCategories();
  const customersResult = await getCustomers();

  if (!categoriesResult.success || !customersResult.success) {
    return <div>Error loading data</div>;
  }

  const categories = categoriesResult.data;
  const customers = customersResult.data;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8">
          <section>
            <h1 className="text-3xl font-bold text-white mb-6">Product Categories</h1>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => (
                <Link
                  href={`/categories/${category.CategoryID}`}
                  key={category.CategoryID}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <h2 className="text-xl font-semibold text-white">{category.CategoryName}</h2>
                  <p className="mt-2">{category.Description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h1 className="text-3xl font-bold text-white mb-6">Customers</h1>
            <AddCustomerForm />
            <div className="grid grid-cols-1 gap-4">
              {customers.map((customer) => (
                <Link
                  href={`/customers/${customer.CustomerID}`}
                  key={customer.CustomerID}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <h2 className="text-xl font-semibold text-white">{customer.CustomerName}</h2>
                  <p>{customer.ContactName}</p>
                  <p>{customer.Address}</p>
                  <p>{customer.City}, {customer.PostalCode}</p>
                  <p>{customer.Country}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
