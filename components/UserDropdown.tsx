'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { UserIcon } from '@/components/ui/user';

const UserDropdown = () => {
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			setIsOpen(false);
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 text-[#F2CC7C] hover:text-gray-600 transition-colors"
				aria-label="Account"
				aria-expanded={isOpen}
			>
				<UserIcon className="w-5 h-5 md:w-6 md:h-6" />
			</button>

			{/* Desktop Dropdown */}
			<div
				className={`hidden md:block absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-50 transition-all duration-200 ease-in-out transform ${
					isOpen
						? 'opacity-100 translate-y-0'
						: 'opacity-0 -translate-y-2 pointer-events-none'
				}`}
				style={{ borderRadius: '4px' }}
			>
				{user ? (
					<div className="py-1">
						<div className="px-4 py-2 border-b border-gray-100">
							<p className="text-sm font-medium text-gray-900">
								{user.displayName || 'My Account'}
							</p>
							<p className="text-xs text-gray-500 truncate">{user.email}</p>
						</div>
						<Link
							href="/account"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							onClick={() => setIsOpen(false)}
						>
							My Account
						</Link>
						<Link
							href="/orders"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							onClick={() => setIsOpen(false)}
						>
							My Orders
						</Link>
						<Link
							href="/wishlist"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							onClick={() => setIsOpen(false)}
						>
							Wishlist
						</Link>
						<button
							onClick={handleSignOut}
							className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
						>
							Sign Out
						</button>
					</div>
				) : (
					<div className="p-4">
						<h3 className="text-sm font-medium text-[#3D0B1C] mb-3">Welcome</h3>
						<div className="space-y-2">
							<Link
								href="/auth/login"
								className="block w-full text-center px-4 py-2 text-sm text-white bg-[#3D0B1C] hover:bg-gray-800 rounded-md transition-colors"
								onClick={() => setIsOpen(false)}
							>
								Sign In
							</Link>
							<p className="text-xs text-center text-gray-500">
								New customer?{' '}
								<Link
									href="/auth/register"
									className="text-[#3D0B1C] hover:underline"
									onClick={() => setIsOpen(false)}
								>
									Register
								</Link>
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Mobile Bottom Sheet */}
			<div
				className={`md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
					isOpen ? 'translate-y-0' : 'translate-y-full'
				}`}
				style={{ borderRadius: '16px 16px 0 0' }}
			>
				<div className="p-4">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-medium">
							{user ? user.displayName || 'My Account' : 'Welcome'}
						</h3>
						<button
							onClick={() => setIsOpen(false)}
							className="text-gray-500 hover:text-gray-700"
							aria-label="Close menu"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{user ? (
						<div className="space-y-2">
							{user.email && (
								<p className="text-sm text-gray-500 mb-3">{user.email}</p>
							)}
							<Link
								href="/account"
								className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
								onClick={() => setIsOpen(false)}
							>
								My Account
							</Link>
							<Link
								href="/orders"
								className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
								onClick={() => setIsOpen(false)}
							>
								My Orders
							</Link>
							<Link
								href="/wishlist"
								className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
								onClick={() => setIsOpen(false)}
							>
								Wishlist
							</Link>
							<button
								onClick={handleSignOut}
								className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 rounded-md"
							>
								Sign Out
							</button>
						</div>
					) : (
						<div className="space-y-3">
							<Link
								href="/auth/login"
								className="block w-full text-center px-4 py-3 text-white bg-black hover:bg-gray-800 rounded-md"
								onClick={() => setIsOpen(false)}
							>
								Sign In
							</Link>
							<p className="text-sm text-center text-gray-500">
								Don&apos;t have an account?{' '}
								<Link
									href="/auth/register"
									className="text-black font-medium"
									onClick={() => setIsOpen(false)}
								>
									Register
								</Link>
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/80 z-40 md:bg-opacity-0"
					onClick={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
};

export default UserDropdown;
