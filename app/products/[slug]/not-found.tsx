import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <PackageX className="w-24 h-24 text-slate-300 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}
