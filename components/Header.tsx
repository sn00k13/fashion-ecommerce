'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CartIcon } from '@/components/ui/cart';
import { HeartIcon } from '@/components/ui/heart';
import { Menu, X } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import dynamic from 'next/dynamic';

const UserDropdown = dynamic(() => import('@/components/UserDropdown'), {
	ssr: false,
});

export default function Header() {
	const { getTotalItems } = useCart();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const cartItemCount = getTotalItems();

	return (
		<>
			<nav className="sticky top-0 z-50 bg-gradient-to-r from-[#3D0B1C] via-[#5A1A2E] to-[#3D0B1C] relative overflow-hidden group">
				{/* Shimmer effect */}
				<div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full"
					style={{
						backgroundSize: '200% 100%',
						animation: 'shimmer 2s infinite',
					}}
				/>
				<div className="relative z-10">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 md:h-20">
							{/* Mobile menu button - Hidden on larger screens */}
							<button
								onClick={() => setIsMenuOpen(true)}
								className="p-2 text-[#F2CC7C] hover:text-gray-600 md:hidden"
								aria-label="Open menu"
							>
								<Menu className="w-6 h-6" />
							</button>

							{/* Center Logo - Takes remaining space on mobile, centered on larger screens */}
							<div className="flex-1 md:flex-none md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
								<Link href="/" className="flex flex-col items-center">
									<h1
										className="text-2xl font-bold text-[#F2CC7C] tracking-tight"
										style={{ fontFamily: 'var(--font-marcellus), serif' }}
									>
										DEZORA
									</h1>
									<span className="text-xs text-[#F2CC7C] font-light tracking-wider">
										LUXE BRAND
									</span>
								</Link>
							</div>

							{/* Desktop Navigation - Hidden on mobile */}
							<div className="hidden md:flex items-center space-x-6 lg:space-x-8">
								<Link
									href="/shop?category=women"
									className="text-[#F2CC7C] hover:text-gray-600 transition-colors font-medium text-sm lg:text-base uppercase tracking-wide"
								>
									WOMEN
								</Link>
								<Link
									href="/shop?category=men"
									className="text-[#F2CC7C] hover:text-gray-600 transition-colors font-medium text-sm lg:text-base uppercase tracking-wide"
								>
									MEN
								</Link>
								<Link
									href="/shop?category=best-sellers"
									className="text-[#F2CC7C] hover:text-gray-600 transition-colors font-medium text-sm lg:text-base uppercase tracking-wide"
								>
									BEST SELLERS
								</Link>
							</div>

							{/* Right Icons - Hidden on mobile, shown on md and up */}
							<div className="hidden md:flex items-center space-x-4 lg:space-x-6">
								<Link
									href="/wishlist"
									className="p-2 text-[#F2CC7C] hover:text-gray-600 transition-colors"
									aria-label="Wishlist"
								>
									<HeartIcon className="w-5 h-5 md:w-6 md:h-6" />
								</Link>

								<div className="relative">
									<Link
										href="/cart"
										className="p-2 text-[#F2CC7C] hover:text-gray-600 transition-colors relative flex items-center"
										aria-label="Shopping Cart"
									>
										<CartIcon className="w-5 h-5 md:w-6 md:h-6" />
										{cartItemCount > 0 && (
											<span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
												{cartItemCount > 9 ? '9+' : cartItemCount}
											</span>
										)}
									</Link>
								</div>

								<UserDropdown />
							</div>

							{/* Empty div to balance the flex layout on mobile */}
							<div className="w-10 md:hidden" />
						</div>
					</div>
				</div>
				<style jsx global>{`
					@keyframes shimmer {
						0% {
							transform: translateX(-100%);
						}
						100% {
							transform: translateX(100%);
						}
					}
				`}</style>
			</nav>

			{/* Mobile Menu Modal */}
			{isMenuOpen && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div
						className="fixed inset-0 bg-black bg-opacity-50"
						onClick={() => setIsMenuOpen(false)}
					></div>
					<div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-lg flex flex-col">
						<div className="flex-1 overflow-y-auto">
							<div className="flex items-center justify-between p-4 border-b">
								<h2 className="text-xl font-semibold">Menu</h2>
								<button
									onClick={() => setIsMenuOpen(false)}
									className="p-2 text-black hover:text-gray-600"
									aria-label="Close menu"
								>
									<X className="w-6 h-6" />
								</button>
							</div>
							<nav className="p-4 space-y-4">
								<Link
									href="/shop?category=women"
									className="block py-3 text-black hover:text-gray-600 transition-colors font-medium text-base uppercase tracking-wide"
									onClick={() => setIsMenuOpen(false)}
								>
									WOMEN
								</Link>
								<Link
									href="/shop?category=men"
									className="block py-3 text-black hover:text-gray-600 transition-colors font-medium text-base uppercase tracking-wide"
									onClick={() => setIsMenuOpen(false)}
								>
									MEN
								</Link>
								<Link
									href="/shop?category=best-sellers"
									className="block py-3 text-black hover:text-gray-600 transition-colors font-medium text-base uppercase tracking-wide"
									onClick={() => setIsMenuOpen(false)}
								>
									BEST SELLERS
								</Link>
							</nav>
						</div>

						{/* Icons at the bottom of the mobile menu - Only shown on mobile */}
						<div className="border-t border-gray-200 p-4 md:hidden">
							<div className="flex justify-around items-center">
								<Link
									href="/wishlist"
									className="p-2 text-black hover:text-gray-600 transition-colors"
									aria-label="Wishlist"
									onClick={() => setIsMenuOpen(false)}
								>
									<HeartIcon className="w-6 h-6" />
								</Link>

								<div className="relative">
									<Link
										href="/cart"
										className="p-2 text-black hover:text-gray-600 transition-colors relative flex items-center"
										aria-label="Shopping Cart"
										onClick={() => setIsMenuOpen(false)}
									>
										<CartIcon className="w-6 h-6" />
										{cartItemCount > 0 && (
											<span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
												{cartItemCount > 9 ? '9+' : cartItemCount}
											</span>
										)}
									</Link>
								</div>

								<div className="p-2">
									<UserDropdown />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
