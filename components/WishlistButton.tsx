'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

/**
 * WishlistButton Component - Client Component
 *
 * This is a CLIENT COMPONENT used within a Server Component page
 *
 * Why Client Component?
 * - Needs interactivity (onClick handler)
 * - Uses React state (useState hook)
 * - Changes appearance based on user interaction
 *
 * This demonstrates how Server and Client components work together:
 * - Parent (recommendations page) is a Server Component
 * - This button is a Client Component for interactivity
 * - Only this small part requires JavaScript on the client
 */

export default function WishlistButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);

    if (!isInWishlist) {
      console.log(`Added "${productName}" to wishlist`);
    } else {
      console.log(`Removed "${productName}" from wishlist`);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      className={`p-2 rounded-full transition-all ${
        isInWishlist
          ? 'bg-red-100 text-red-600'
          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
      }`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`w-5 h-5 ${isInWishlist ? 'fill-red-600' : ''}`}
      />
    </button>
  );
}
