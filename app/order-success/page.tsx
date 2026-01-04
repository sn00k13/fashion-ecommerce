'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
          <h2 className="font-semibold mb-4">What's Next?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• You will receive an order confirmation email shortly</li>
            <li>• We'll notify you when your order ships</li>
            <li>• Estimated delivery: 3-5 business days</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="inline-block border-2 border-black text-black px-8 py-3 rounded-md font-semibold hover:bg-black hover:text-white transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

