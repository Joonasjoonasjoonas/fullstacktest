import Link from 'next/link';
import { getCategoryProducts } from '@/services/db/categories';

export default async function CategoryProducts({ params }: { params: { id: string } }) {
  const products = await getCategoryProducts(params.id);
  const categoryName = products[0]?.CategoryName || 'Category';

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/"
          className="text-blue-300 hover:text-blue-200 flex items-center gap-2 mb-4"
        >
          ← Back to Categories
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">{categoryName} Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Link
              href={`/products/${product.ProductID}`}
              key={product.ProductID}
              className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <h2 className="text-xl font-bold text-white">{product.ProductName}</h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 