import type { Metadata } from 'next';
import { Geist, Geist_Mono, Marcellus } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import { AuthProvider } from '@/lib/context/AuthContext';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const marcellus = Marcellus({
	variable: '--font-marcellus',
	subsets: ['latin'],
	weight: ['400'],
});

export const metadata: Metadata = {
	title: "Fashion Store - Women's Fashion Apparel",
	description:
		"Discover the latest trends in women's fashion. Shop stylish apparel, accessories, and more with free shipping across Nigeria.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${marcellus.variable} antialiased`}
			>
				<AuthProvider>
					<CartProvider>{children}</CartProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
