import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';

/**
 * RECOMMENDATIONS PAGE - React Server Components (RSC)
 *
 * Rendering Strategy: Hybrid RSC (Server + Client Components)
 *
 * Why RSC?
 * - Demonstrates the power of hybrid rendering in Next.js 13+
 * - Server component fetches data and renders product cards on server
 * - Client components handle interactive features (wishlist button)
 * - Reduces JavaScript bundle size sent to client
 * - Better performance as server does the heavy lifting
 *
 * How it works:
 * - This is a SERVER COMPONENT (default in Next.js App Router)
 * - Fetches recommended products on the server
 * - Renders static content server-side
 * - Embeds WishlistButton as a CLIENT COMPONENT for interactivity
 * - Only the interactive parts require client-side JavaScript
 */

async function getRecommendedProducts(): Promise<Product[]> {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .gte('inventory', 10)
    .order('price', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }

  return products || [];
}

export default async function RecommendationsPage() {
  const recommendations = await getRecommendedProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <h1 className="text-3xl font-bold text-slate-900">
              Recommended For You
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-md font-medium">
              RSC
            </span>
            <span>React Server Components - Hybrid server/client rendering</span>
          </div>
          <p className="text-slate-600">
            Premium products with high availability, rendered on the server for
            optimal performance
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No recommendations available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">
                        {product.name}
                      </h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    <WishlistButton productId={product.id} productName={product.name} />
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {product.inventory} available
                      </div>
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-3 border-t border-yellow-100">
                  <div className="flex items-center gap-2 text-xs">
                    <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                    <span className="text-yellow-800 font-medium">
                      Recommended based on availability
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="font-semibold text-teal-900 mb-3">
              Server Component Benefits
            </h3>
            <ul className="text-sm text-teal-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Products fetched and rendered on the server</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Zero JavaScript for product display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Faster initial page load</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Better SEO with server-rendered content</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              Client Component Integration
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Wishlist buttons are client components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Only interactive parts use JavaScript</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Reduced bundle size for better performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Best of both worlds: static + interactive</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
