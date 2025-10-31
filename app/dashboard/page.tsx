import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Package, AlertTriangle, TrendingUp } from 'lucide-react';

/**
 * INVENTORY DASHBOARD PAGE - Server-Side Rendering (SSR)
 *
 * Rendering Strategy: SSR (Server-Side Rendering)
 *
 * Why SSR?
 * - Inventory data must be fresh on every request
 * - Dashboard shows real-time statistics and low stock alerts
 * - Cannot be cached as it needs to reflect current state
 * - Suitable for authenticated/admin views with changing data
 *
 * How it works:
 * - Page is rendered on the server for EVERY request
 * - Data is fetched fresh from database each time
 * - No caching between requests
 * - Dynamic metadata and server-only data fetching
 * - Force-dynamic ensures no static optimization
 */

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('inventory', { ascending: true });

  if (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      products: [],
      totalProducts: 0,
      lowStockProducts: [],
      totalValue: 0,
      categories: {},
    };
  }

  const lowStockProducts = products.filter((p) => p.inventory < 5);
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * p.inventory,
    0
  );

  const categories = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    products,
    totalProducts: products.length,
    lowStockProducts,
    totalValue,
    categories,
  };
}

export default async function DashboardPage() {
  const { totalProducts, lowStockProducts, totalValue, categories } =
    await getDashboardData();

  const currentTime = new Date().toLocaleString();

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
          <h1 className="text-3xl font-bold text-slate-900">
            Inventory Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md font-medium">
              SSR
            </span>
            <span>Server-Side Rendering - Fresh data on every request</span>
          </div>
          <div className="text-xs text-slate-500">
            Generated at: {currentTime}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Total Products
              </h3>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {totalProducts}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Low Stock Items
              </h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {lowStockProducts.length}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Inventory Value
              </h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${totalValue.toFixed(0)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Categories</h3>
              <Package className="w-5 h-5 text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {Object.keys(categories).length}
            </div>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden mb-8">
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-red-900">
                  Low Stock Alert
                </h2>
              </div>
              <p className="text-sm text-red-700 mt-1">
                The following products have inventory below 5 units
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {product.inventory}
                      </div>
                      <div className="text-xs text-slate-500">units left</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Category Distribution
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(categories).map(([category, count]) => {
                const countNum = count as number;
                return (
                  <div key={category} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-slate-700">
                      {category}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{
                            width: `${(countNum / totalProducts) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-semibold text-slate-900">
                      {countNum}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">
            About SSR on this page
          </h3>
          <p className="text-sm text-orange-800">
            This dashboard uses Server-Side Rendering to ensure you always see
            the most up-to-date inventory statistics. Every time you refresh,
            the page is rendered fresh on the server with the latest data from
            the database.
          </p>
        </div>
      </main>
    </div>
  );
}
