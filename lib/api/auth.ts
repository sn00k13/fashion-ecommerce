import { auth, db } from '../firebase/config';
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
	UserCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const signIn = async (email: string, password: string) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return { user: userCredential.user, error: null };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return { user: null, error: error.message };
		}
		return { user: null, error: 'An unknown error occurred' };
	}
};

export const signUp = async (
	email: string,
	password: string,
	displayName: string
) => {
	try {
		// Create user with email and password
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const { user } = userCredential;

		// Update user profile with display name
		await updateProfile(user, { displayName });

		// Create user document in Firestore
		await setDoc(doc(db, 'users', user.uid), {
			uid: user.uid,
			email: user.email,
			displayName,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		return { user, error: null };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred';
		return { user: null, error: errorMessage };
	}
};

export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	try {
		const result = await signInWithPopup(auth, provider);
		const { user } = result;

		// Check if user is new
		const userDoc = doc(db, 'users', user.uid);
		await setDoc(
			userDoc,
			{
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
				provider: 'google.com',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{ merge: true }
		);

		return { user, error: null };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred';
		return { user: null, error: errorMessage };
	}
};

export const signOut = async () => {
	try {
		await auth.signOut();
		return { error: null };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred';
		return { error: errorMessage };
	}
};
