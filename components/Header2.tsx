"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { CartIcon } from '@/components/ui/cart';
import { HeartIcon } from '@/components/ui/heart';
import { UserIcon } from '@/components/ui/user';
import { BoxIcon } from '@/components/ui/box';

export default function Header2() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-gray-900">LOGO</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex ml-6">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Desktop Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors px-3 py-2">
              <BoxIcon className="h-5 w-5 mr-2" />
              <span>Orders</span>
            </button>
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors px-3 py-2">
              <HeartIcon className="h-5 w-5 mr-2" />
              <span>Favorites</span>
            </button>
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors px-3 py-2 relative">
              <CartIcon className="h-5 w-5 mr-2" />
              <span>Cart</span>
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black rounded-full">
                0
              </span>
            </button>
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors px-3 py-2">
              <UserIcon className="h-5 w-5 mr-2" />
              <span>Profile</span>
            </button>
          </div>

          {/* Mobile menu button - Only show on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search - appears below on small screens */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <BoxIcon className="h-5 w-5 mr-3" />
              <span>Orders</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <HeartIcon className="h-5 w-5 mr-3" />
              <span>Favorites</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md relative">
              <CartIcon className="h-5 w-5 mr-3" />
              <span>Cart</span>
              <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black rounded-full">
                0
              </span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <UserIcon className="h-5 w-5 mr-3" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}