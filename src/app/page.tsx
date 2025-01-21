'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Customer {
  CustomerID: number;
  CustomerName: string;
  ContactName: string;
  Address: string;
  City: string;
  PostalCode: string;
  Country: string;
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        console.log('Fetched customers:', data)
        setCustomers(data)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-pulse text-2xl text-gray-300">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="text-2xl text-red-400 bg-red-900/50 p-4 rounded-lg shadow-lg">
        Error: {error}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Customer Directory
          </h1>
          <div className="text-gray-400">
            {customers.length} customers found
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <div 
              key={customer.CustomerID} 
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 
                       border border-gray-700 overflow-hidden hover:border-gray-600"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">
                    {customer.CustomerName}
                  </h2>
                  <span className="bg-blue-900/50 text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ID: {customer.CustomerID}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{customer.ContactName}</span>
                  </div>

                  <div className="flex items-start text-gray-300">
                    <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p>{customer.Address}</p>
                      <p>{customer.City}, {customer.PostalCode}</p>
                      <p className="font-medium text-gray-200">{customer.Country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-700/50 border-t border-gray-700">
                <Link 
                  href={`/customers/${customer.CustomerID}`}
                  className="text-blue-300 hover:text-blue-200 text-sm font-medium group"
                >
                  View Details 
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
