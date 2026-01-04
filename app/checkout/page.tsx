'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/context/CartContext';
import { formatCurrency } from '@/lib/utils/format';
import { Address } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotal, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'bank-transfer'>('paystack');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handlePromoCode = () => {
    // Dummy promo codes
    const promoCodes: Record<string, number> = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'SUMMER15': 15,
    };

    const discountPercent = promoCodes[promoCode.toUpperCase()];
    if (discountPercent) {
      const discountAmount = (getSubtotal() * discountPercent) / 100;
      setDiscount(discountAmount);
      alert(`Promo code applied! You saved ${formatCurrency(discountAmount)}`);
    } else {
      alert('Invalid promo code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      // In a real app, this would call your API
      const orderData = {
        email,
        items,
        shippingAddress,
        paymentMethod,
        total: getTotal() - discount,
        promoCode: promoCode || undefined,
      };

      // Save order to localStorage (in real app, send to API)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({
        ...orderData,
        id: `ORD-${Date.now()}`,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();
      router.push(`/order-success?orderId=ORD-${Date.now()}`);
    }, 2000);
  };

  const finalTotal = getTotal() - discount;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Email Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Lagos"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="100001"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      value={shippingAddress.country}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paystack')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Paystack</p>
                    <p className="text-sm text-gray-600">Pay with card, bank transfer, or USSD</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-4 border-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <input
                    type="radio"
                    name="payment"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank-transfer')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Bank Transfer</p>
                    <p className="text-sm text-gray-600">Transfer directly to our bank account</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={handlePromoCode}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

