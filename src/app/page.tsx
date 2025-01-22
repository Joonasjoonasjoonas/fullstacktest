import Link from 'next/link'
import { getCategories, getCustomers, type Category, type Customer } from '@/services/db'

function AddCustomerForm() {
  return (
    <form className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Add New Customer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Add Customer
          </button>
        </div>
      </div>
    </form>
  );
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
            <AddCustomerForm />
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
