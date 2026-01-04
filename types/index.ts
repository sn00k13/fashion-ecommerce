// Product Types
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	originalPrice?: number;
	images: string[];
	category: Category;
	brand: string;
	tags: string[];
	sizes: string[];
	colors: Color[];
	inStock: boolean;
	stockQuantity: number;
	rating: number;
	reviewCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface Color {
	name: string;
	hex: string;
}

export type Category = 'women' | 'men' | 'kids' | 'best-sellers' | 'brand';

export interface ProductVariant {
	productId: string;
	size: string;
	color: string;
	price: number;
	stock: number;
}

// Cart Types
export interface CartItem {
	id: string;
	productId: string;
	product: Product;
	size: string;
	color: string;
	quantity: number;
	price: number;
}

export interface Cart {
	items: CartItem[];
	subtotal: number;
	discount: number;
	total: number;
	promoCode?: string;
}

// User Types
export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone?: string;
	address?: Address;
	createdAt: string;
}

export interface Address {
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

// Order Types
export interface Order {
	id: string;
	userId?: string;
	email: string;
	items: OrderItem[];
	shippingAddress: Address;
	paymentMethod: 'paystack' | 'bank-transfer';
	paymentStatus: 'pending' | 'completed' | 'failed';
	orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	subtotal: number;
	discount: number;
	shipping: number;
	total: number;
	promoCode?: string;
	createdAt: string;
	updatedAt: string;
}

export interface OrderItem {
	id?: string;
	orderId: string;
	productId: string;
	productRef?: string; // Firebase document reference
	productName: string;
	image: string;
	size: string;
	color: string;
	quantity: number;
	price: number;
	priceAtPurchase: number;
	createdAt?: string | Date;
	updatedAt?: string | Date;
}

// Review Types
export interface Review {
	id: string;
	productId: string;
	userId: string;
	userName: string;
	rating: number;
	comment: string;
	createdAt: string;
}

// Wishlist Types
export interface WishlistItem {
	id: string;
	productId: string;
	product: Product;
	addedAt: string;
}

// Promo Code Types
export interface PromoCode {
	code: string;
	discountType: 'percentage' | 'fixed';
	discountValue: number;
	minPurchase?: number;
	maxDiscount?: number;
	validFrom: string;
	validUntil: string;
	isActive: boolean;
}

// Newsletter Types
export interface NewsletterSubscription {
	id: string;
	email: string;
	subscribedAt: string;
	isActive: boolean;
}
