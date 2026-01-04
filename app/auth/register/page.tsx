// app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
	createUserWithEmailAndPassword,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords don't match");
			return;
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters long');
			return;
		}

		setLoading(true);

		try {
			console.log('Attempting to create user with email:', formData.email);

			// 1. Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				formData.email,
				formData.password
			);
			console.log('User created successfully:', userCredential.user.uid);

			// 2. Update user profile with display name
			try {
				await updateProfile(userCredential.user, {
					displayName: `${formData.firstName} ${formData.lastName}`,
				});
				console.log('User profile updated with display name');
			} catch (profileError) {
				console.error('Error updating profile:', profileError);
				// Continue even if profile update fails
			}

			// 3. Create user document in Firestore
			try {
				const userData = {
					uid: userCredential.user.uid,
					email: formData.email,
					firstName: formData.firstName,
					lastName: formData.lastName,
					displayName: `${formData.firstName} ${formData.lastName}`,
					emailVerified: false,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				await setDoc(doc(db, 'users', userCredential.user.uid), userData);
				console.log('User document created in Firestore');

				// 4. Send email verification
				// await sendEmailVerification(userCredential.user);
				// console.log('Verification email sent');

				// 5. Redirect to home page after successful registration
				router.push('/');
			} catch (firestoreError) {
				console.error('Firestore error:', firestoreError);
				// If Firestore fails but auth succeeded, we should still consider this a success
				// but log the error for debugging
				router.push('/');
			}
		} catch (error: unknown) {
			const firebaseError = error as { code?: string; message: string };
			console.error('Registration error:', error);
			// More specific error messages
			if (firebaseError.code === 'auth/email-already-in-use') {
				setError(
					'This email is already registered. Please use a different email or sign in.'
				);
			} else if (firebaseError.code === 'auth/weak-password') {
				setError('The password is too weak. Please use a stronger password.');
			} else if (firebaseError.code === 'auth/invalid-email') {
				setError('The email address is not valid.');
			} else {
				setError(
					`Failed to create an account: ${
						firebaseError.message || 'Please try again.'
					}`
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			// Create user document if it doesn't exist
			const userDoc = doc(db, 'users', result.user.uid);
			await setDoc(
				userDoc,
				{
					uid: result.user.uid,
					email: result.user.email,
					displayName: result.user.displayName,
					photoURL: result.user.photoURL,
					provider: 'google.com',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{ merge: true }
			);

			router.push('/');
		} catch (error) {
			console.error('Google sign in error:', error);
			setError('Failed to sign in with Google');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-[#3D0B1C]">
						Create your account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Already have an account?{' '}
						<Link
							href="/auth/login"
							className="font-medium text-[#3D0B1C] hover:text-[#d45703]"
						>
							Sign in
						</Link>
					</p>
				</div>

				{error && (
					<div
						className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
						role="alert"
					>
						<span className="block sm:inline">{error}</span>
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label htmlFor="first-name" className="sr-only">
									First name
								</label>
								<Input
									id="first-name"
									name="firstName"
									type="text"
									required
									value={formData.firstName}
									onChange={handleChange}
									className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D0B1C] focus:border-[#3D0B1C] focus:z-10 sm:text-sm"
									placeholder="First name"
								/>
							</div>
							<div>
								<label htmlFor="last-name" className="sr-only">
									Last name
								</label>
								<Input
									id="last-name"
									name="lastName"
									type="text"
									required
									value={formData.lastName}
									onChange={handleChange}
									className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D0B1C] focus:border-[#3D0B1C] focus:z-10 sm:text-sm"
									placeholder="Last name"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="email-address" className="sr-only">
								Email address
							</label>
							<Input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D0B1C] focus:border-[#3D0B1C] focus:z-10 sm:text-sm"
								placeholder="Email address"
							/>
						</div>

						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={handleChange}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D0B1C] focus:border-[#3D0B1C] focus:z-10 sm:text-sm"
								placeholder="Password (min 6 characters)"
							/>
						</div>

						<div>
							<label htmlFor="confirm-password" className="sr-only">
								Confirm Password
							</label>
							<Input
								id="confirm-password"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D0B1C] focus:border-[#3D0B1C] focus:z-10 sm:text-sm"
								placeholder="Confirm password"
							/>
						</div>
					</div>

					<div className="flex items-center">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							required
							className="h-4 w-4 text-[#eb6404] focus:ring-[#3D0B1C] border-gray-300 rounded"
						/>
						<label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
							I agree to the{' '}
							<Link
								href="/terms"
								className="text-[#eb6404] hover:text-[#3D0B1C]"
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<Link
								href="/privacy"
								className="text-[#eb6404] hover:text-[#3D0B1C]"
							>
								Privacy Policy
							</Link>
						</label>
					</div>

					<div>
						<Button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3D0B1C] hover:bg-[#3D0B1C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb6404] disabled:opacity-50 disabled:cursor-not-allowed
    							transition-all duration-200 ease-in-out
    							hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
    							active:scale-[0.98] active:duration-150"
						>
							{loading ? 'Creating account...' : 'Create account'}
						</Button>
					</div>
				</form>

				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								Or sign up with
							</span>
						</div>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleGoogleSignIn}
							className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
						>
							<FcGoogle className="h-5 w-5 mr-2" />
							Google
						</Button>
						<Button
							type="button"
							variant="outline"
							className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
						>
							<FaGithub className="h-5 w-5 mr-2" />
							GitHub
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
