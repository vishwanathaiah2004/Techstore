import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Package, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';

/**
 * PRODUCT DETAIL PAGE - Incremental Static Regeneration (ISR)
 *
 * Rendering Strategy: ISR (Incremental Static Regeneration)
 *
 * Why ISR?
 * - Product details may change (price, stock) but not constantly
 * - Pre-render for performance and SEO benefits
 * - Automatically regenerate on a schedule (60 seconds)
 * - Best of both worlds: static performance + dynamic freshness
 *
 * How it works:
 * - Pages are generated at build time using generateStaticParams
 * - After 60 seconds, Next.js regenerates the page in the background
 * - First request after revalidation period serves stale content
 * - Subsequent requests get the fresh content
 * - No request to origin if within revalidation window
 */

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return product;
}

export async function generateStaticParams() {
  const { data: products } = await supabase
    .from('products')
    .select('slug');

  return (products || []).map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const lastUpdated = new Date(product.last_updated);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">
              ISR
            </span>
            <span>Incremental Static Regeneration - Revalidates every 60s</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  {product.name}
                </h1>
                <span className="inline-block text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  ${product.price.toFixed(2)}
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    product.inventory < 5
                      ? 'bg-red-100 text-red-700'
                      : product.inventory < 10
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  {product.inventory} in stock
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Product Description
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-slate-200 mt-6 pt-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Product Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Product ID</div>
                  <div className="font-mono text-sm text-slate-900">
                    {product.id}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">SKU</div>
                  <div className="font-mono text-sm text-slate-900">
                    {product.slug.toUpperCase()}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Category</div>
                  <div className="text-sm text-slate-900">{product.category}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Availability</div>
                  <div className="text-sm text-slate-900">
                    {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            About ISR on this page
          </h3>
          <p className="text-sm text-blue-800">
            This page is statically generated at build time and automatically
            regenerates every 60 seconds. This means you get fast load times with
            relatively fresh data. Try updating the inventory in the admin panel
            and refresh this page after 60 seconds to see the changes.
          </p>
        </div>
      </main>
    </div>
  );
}
