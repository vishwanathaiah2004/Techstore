import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import ProductList from '@/components/ProductList';
import Link from 'next/link';

/**
 * HOME PAGE - Static Site Generation (SSG)
 *
 * Rendering Strategy: SSG (Static Site Generation)
 *
 * Why SSG?
 * - Product catalog is public data that doesn't change frequently
 * - Pre-rendering at build time provides fastest possible loading
 * - Great for SEO as pages are fully rendered
 * - Reduces server load by serving static HTML
 *
 * How it works:
 * - This is a server component that fetches data at BUILD TIME
 * - No 'revalidate' option means the page is generated once and cached
 * - To update, you need to rebuild the application
 * - Client-side filtering is added via a separate client component
 */

async function getProducts(): Promise<Product[]> {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-green-100 shadow-sm border-b ">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">TechStore</h1>
              <p className="text-sm text-slate-600 mt-1">Your one-stop tech shop</p>
            </div>
            <nav className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors "
              >
                Dashboard
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/recommendations"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Recommendations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md font-medium">
              SSG
            </span>
            <span>Static Site Generation - Built at compile time</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            All Products
          </h2>
          <p className="text-slate-600 mt-1">
            Browse our complete catalog of tech products
          </p>
        </div>

        <ProductList products={products} />
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-slate-600 text-sm">
            TechStore E-Commerce Demo - Next.js Rendering Strategies
          </p>
        </div>
      </footer>
    </div>
  );
}
