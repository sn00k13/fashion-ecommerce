import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

// Types
export interface Product {
	id?: string;
	name: string;
	description?: string;
	price: number;
	category: string;
	rating?: number;
	stock_quantity: number;
	image_urls?: string[];
	is_featured?: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface CartItem {
	id?: string;
	user_id: string;
	product_id: string;
	quantity: number;
	created_at?: string;
}

export interface Order {
	id?: string;
	user_id: string;
	total_amount: number;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	shipping_address: string;
	payment_status: 'unpaid' | 'paid' | 'refunded';
	created_at?: string;
	updated_at?: string;
}

export interface OrderItem {
	id?: string;
	order_id: string;
	product_id: string;
	quantity: number;
	price_at_purchase: number;
	created_at?: string;
}
