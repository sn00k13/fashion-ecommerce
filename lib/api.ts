// lib/api.ts
import {
	collection,
	doc,
	getDoc,
	DocumentData,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
	updateDoc,
	addDoc,
	deleteDoc,
	increment,
	serverTimestamp,
	getCountFromServer,
	writeBatch,
	DocumentSnapshot,
	DocumentReference,
} from 'firebase/firestore';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	User as FirebaseUser,
	UserCredential,
} from 'firebase/auth';
import { db, auth } from './firebase/config';
import { Product, CartItem, Order, OrderItem } from '../types';

interface ApiResponse<T> {
	data: T | null;
	error: string | null;
}

// Define the ProductData interface for Firestore product documents
interface ProductData {
	name?: string;
	price?: number;
	// Add other product fields as needed
}

interface StockUpdate {
	ref: string;
	quantity: number;
}

// Helper function to handle Firestore errors
const handleFirestoreError = (error: unknown): never => {
	console.error('Firestore error:', error);
	if (error instanceof Error) {
		throw error;
	}
	throw new Error('An unknown error occurred');
};

// Products API
export const productsApi = {
	async getProducts(category?: string, itemsPerPage = 20, lastVisible = null) {
		try {
			const productsRef = collection(db, 'products');
			let q = query(
				productsRef,
				orderBy('created_at', 'desc'),
				limit(itemsPerPage)
			);

			if (category && category !== 'All Categories') {
				q = query(q, where('category', '==', category));
			}

			if (lastVisible) {
				q = query(q, startAfter(lastVisible));
			}

			const snapshot = await getDocs(q);
			const products = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Get total count for pagination
			const countSnapshot = await getCountFromServer(productsRef);
			const totalCount = countSnapshot.data().count;

			return {
				data: products,
				error: null,
				totalCount,
			};
		} catch (error) {
			return handleFirestoreError(error);
		}
	},

	async getProductById(id: string) {
		try {
			const docRef = doc(db, 'products', id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				return { data: null, error: 'Product not found' };
			}

			return {
				data: { id: docSnap.id, ...docSnap.data() },
				error: null,
			};
		} catch (error) {
			return handleFirestoreError(error);
		}
	},
};

// Cart API
export const cartApi = {
	async getCart() {
		const user = auth.currentUser;
		if (!user) return { data: null, error: 'Not authenticated' };

		try {
			const cartRef = collection(db, 'cart_items');
			const q = query(
				cartRef,
				where('user_id', '==', user.uid),
				where('order_id', '==', null) // Only get items not yet in an order
			);

			const querySnapshot = await getDocs(q);
			const cartItems = await Promise.all(
				querySnapshot.docs.map(async (doc) => {
					const cartItemData = doc.data();
					if (!cartItemData || !cartItemData.product_ref) {
						return null;
					}

					const productDoc = await getDoc(cartItemData.product_ref);
					if (!productDoc.exists()) {
						return null;
					}

					const productData = productDoc.data() as Product;
					if (!productData) {
						return null;
					}

					// Map the data to match the CartItem interface
					const cartItem: CartItem = {
						id: doc.id,
						productId: cartItemData.product_id, // Using product_id from Firestore data
						product: productData,
						size: cartItemData.size || '',
						color: cartItemData.color || '',
						quantity: cartItemData.quantity || 1,
						price: cartItemData.price || productData.price || 0,
					};

					return cartItem;
				})
			);

			// Filter out any null values from the cart items
			const validCartItems = cartItems.filter(
				(item): item is CartItem => item !== null
			);

			return { data: validCartItems, error: null };
		} catch (error) {
			return handleFirestoreError(error);
		}
	},

	async addToCart(productId: string, quantity = 1) {
		const user = auth.currentUser;
		if (!user) return { error: 'Not authenticated' };

		try {
			const cartRef = collection(db, 'cart_items');
			const q = query(
				cartRef,
				where('user_id', '==', user.uid),
				where('product_id', '==', productId)
			);

			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				// Update existing cart item
				const existingItem = querySnapshot.docs[0];
				await updateDoc(existingItem.ref, {
					quantity: increment(quantity),
					updated_at: serverTimestamp(),
				});
			} else {
				// Add new item to cart
				await addDoc(cartRef, {
					user_id: user.uid,
					product_id: productId,
					product_ref: doc(db, 'products', productId),
					quantity,
					created_at: serverTimestamp(),
					updated_at: serverTimestamp(),
				});
			}

			return { data: { success: true }, error: null };
		} catch (error) {
			return handleFirestoreError(error);
		}
	},

	async updateCartItem(cartItemId: string, quantity: number) {
		try {
			const cartItemRef = doc(db, 'cart_items', cartItemId);
			await updateDoc(cartItemRef, {
				quantity,
				updated_at: serverTimestamp(),
			});
			return { data: { success: true }, error: null };
		} catch (error) {
			return handleFirestoreError(error);
		}
	},

	async removeFromCart(cartItemId: string) {
		try {
			await deleteDoc(doc(db, 'cart_items', cartItemId));
			return { data: { success: true }, error: null };
		} catch (error) {
			return handleFirestoreError(error);
		}
	},
};

// Orders API
export const ordersApi = {
	async createOrder(
		items: Array<{ product_id: string; quantity: number }>,
		shippingAddress: string
	): Promise<ApiResponse<Order>> {
		const user = auth.currentUser;
		if (!user) return { data: null, error: 'Not authenticated' };

		const batch = writeBatch(db);

		try {
			// 1. Get products to calculate total and check stock
			const productsPromises = items.map((item) =>
				getDoc(doc(db, 'products', item.product_id))
			);
			const productsSnapshots = await Promise.all(productsPromises);

			const products = productsSnapshots.map(
				(snap: DocumentSnapshot, index: number) => {
					const productData = snap.data() as Omit<Product, 'id'>;
					return {
						id: snap.id,
						...productData,
						quantity: items[index].quantity,
					};
				}
			);

			// 2. Calculate total and validate stock
			let totalAmount = 0;
			const stockUpdates: StockUpdate[] = [];

			for (const product of products) {
				if (product.stockQuantity < product.quantity) {
					throw new Error(`Not enough stock for ${product.name}`);
				}
				totalAmount += product.price * product.quantity;
				stockUpdates.push({
					ref: `products/${product.id}`,
					quantity: product.quantity,
				});
			}

			// 3. Create order
			const orderRef = doc(collection(db, 'orders'));
			const orderData: Omit<Order, 'id' | 'items'> = {
				userId: user.uid,
				total: totalAmount,
				orderStatus: 'pending',
				shippingAddress: {
					street: shippingAddress,
					city: '',
					state: '',
					zipCode: '',
					country: '',
				},
				paymentStatus: 'pending',
				paymentMethod: 'paystack',
				subtotal: totalAmount,
				shipping: 0,
				discount: 0,
				email: user.email || '',
				createdAt: serverTimestamp() as unknown as string,
				updatedAt: serverTimestamp() as unknown as string,
			};

			// 4. Create order items
			const orderItemsRef = collection(db, 'order_items');
			const orderItems: Omit<OrderItem, 'id'>[] = products.map((product) => ({
				orderId: orderRef.id,
				productId: product.id,
				productRef: `products/${product.id}`,
				productName: product.name,
				image: product.images?.[0] || '',
				size: product.sizes?.[0] || '',
				color: product.colors?.[0]?.name || '',
				quantity: product.quantity,
				price: product.price,
				priceAtPurchase: product.price,
				createdAt: serverTimestamp() as unknown as string,
				updatedAt: serverTimestamp() as unknown as string,
			}));

			// Add order to batch
			batch.set(orderRef, orderData);

			// Add order items to batch
			orderItems.forEach((item) => {
				const itemRef = doc(orderItemsRef);
				batch.set(itemRef, item);
			});

			// 5. Update product stock
			stockUpdates.forEach((update) => {
				const productRef = doc(db, update.ref);
				batch.update(productRef, {
					stockQuantity: increment(-update.quantity),
					updatedAt: serverTimestamp(),
				});
			});

			// 6. Clear cart (optional)
			const cartQuery = query(
				collection(db, 'cart_items'),
				where('user_id', '==', user.uid),
				where('order_id', '==', null)
			);

			const cartSnapshot = await getDocs(cartQuery);
			cartSnapshot.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});

			// 7. Commit the batch
			await batch.commit();

			const createdOrder: Order = {
				id: orderRef.id,
				...orderData,
				items: orderItems,
				shippingAddress: {
					street: shippingAddress,
					city: '',
					state: '',
					zipCode: '',
					country: '',
				},
				paymentMethod: 'paystack',
				paymentStatus: 'pending',
				subtotal: totalAmount,
				shipping: 0,
				discount: 0,
				total: totalAmount,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			return {
				data: createdOrder,
				error: null,
			};
		} catch (error: unknown) {
			console.error('Order creation failed:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to create order';
			return {
				data: null,
				error: errorMessage,
			};
		}
	},

	async getOrderById(orderId: string) {
		try {
			const orderRef = doc(db, 'orders', orderId);
			const orderSnap = await getDoc(orderRef);

			if (!orderSnap.exists()) {
				return { data: null, error: 'Order not found' };
			}

			// Get order items
			const orderItemsRef = collection(db, 'order_items');
			const q = query(orderItemsRef, where('order_id', '==', orderId));

			const itemsSnapshot = await getDocs(q);
			const items = await Promise.all(
				itemsSnapshot.docs.map(async (doc) => {
					const itemData = doc.data();
					const productSnap = await getDoc<
						DocumentData,
						DocumentReference<DocumentData>
					>(itemData.product_ref);
					const productData = productSnap.data();
					return {
						id: doc.id,
						...itemData,
						product:
							productSnap.exists() && productData
								? { id: productSnap.id, ...(productData as ProductData) }
								: null,
					};
				})
			);

			return {
				data: {
					id: orderSnap.id,
					...orderSnap.data(),
					items,
				},
				error: null,
			};
		} catch (error) {
			return handleFirestoreError(error);
		}
	},

	async getUserOrders() {
		const user = auth.currentUser;
		if (!user) return { data: null, error: 'Not authenticated' };

		try {
			const ordersRef = collection(db, 'orders');
			const q = query(
				ordersRef,
				where('user_id', '==', user.uid),
				orderBy('created_at', 'desc')
			);

			const snapshot = await getDocs(q);
			const orders = await Promise.all(
				snapshot.docs.map(async (doc) => {
					// Get first item for preview
					const orderItemsRef = collection(db, 'order_items');
					const itemsQuery = query(
						orderItemsRef,
						where('order_id', '==', doc.id),
						limit(1)
					);
					const itemsSnapshot = await getDocs(itemsQuery);

					let previewItem = null;
					if (!itemsSnapshot.empty) {
						const itemDoc = itemsSnapshot.docs[0];
						const productSnap = await getDoc(itemDoc.data().product_ref);
						previewItem = {
							product: productSnap.exists()
								? { id: productSnap.id, ...(productSnap.data() as ProductData) }
								: null,
							quantity: itemDoc.data().quantity,
						};
					}

					return {
						id: doc.id,
						...doc.data(),
						preview_item: previewItem,
						item_count: (
							await getCountFromServer(
								query(
									collection(db, 'order_items'),
									where('order_id', '==', doc.id)
								)
							)
						).data().count,
					};
				})
			);

			return { data: orders, error: null };
		} catch (error) {
			return handleFirestoreError(error);
		}
	},
};

// Auth API
export const authApi = {
	async signIn(
		email: string,
		password: string
	): Promise<ApiResponse<FirebaseUser>> {
		try {
			const userCredential: UserCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			return { data: userCredential.user, error: null };
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to sign in';
			return { data: null, error: errorMessage };
		}
	},

	async signUp(email: string, password: string, fullName: string) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Create user profile
			await addDoc(collection(db, 'profiles'), {
				id: user.uid,
				email,
				full_name: fullName,
				created_at: serverTimestamp(),
				updated_at: serverTimestamp(),
			});

			return {
				data: { user },
				error: null,
			};
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to sign up';
			return {
				data: null,
				error: errorMessage,
			};
		}
	},

	async signOut() {
		try {
			await firebaseSignOut(auth);
			return { error: null };
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to sign out';
			return {
				error: errorMessage,
			};
		}
	},

	async getCurrentUser() {
		try {
			const user = auth.currentUser;
			if (!user) return { data: null, error: 'No user logged in' };

			// Get additional user data from profiles collection
			const profileQuery = query(
				collection(db, 'profiles'),
				where('id', '==', user.uid),
				limit(1)
			);

			const profileSnapshot = await getDocs(profileQuery);
			const profile = profileSnapshot.empty
				? null
				: {
						id: profileSnapshot.docs[0].id,
						...profileSnapshot.docs[0].data(),
				  };

			return {
				data: {
					...user,
					...profile,
				},
				error: null,
			};
		} catch (error) {
			return handleFirestoreError(error);
		}
	},

	onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
		return onAuthStateChanged(auth, callback);
	},
};
