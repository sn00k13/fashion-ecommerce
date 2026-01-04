'use client';

import Image from 'next/image';
import Header from '@/components/Header';
import AnimatedText from '@/components/AnimatedText';
import AnimatedButton from '@/components/AnimatedButton';
import React from 'react';

const backgroundImages = [
	'/images/legit-landing.jpg',
	'/images/legit-landing2.jpg',
	'/images/legit-landing3.jpg',
	'/images/legit-landing4.jpg',
];

export default function Home() {
	const [currentImage, setCurrentImage] = React.useState('');
	const [isFading, setIsFading] = React.useState(false);

	React.useEffect(() => {
		const changeImage = () => {
			setIsFading(true);
			setTimeout(() => {
				const currentIndex = backgroundImages.indexOf(currentImage);
				let nextIndex = Math.floor(Math.random() * backgroundImages.length);
				// Ensure we don't show the same image twice in a row
				while (
					backgroundImages[nextIndex] === currentImage &&
					backgroundImages.length > 1
				) {
					nextIndex = Math.floor(Math.random() * backgroundImages.length);
				}
				setCurrentImage(backgroundImages[nextIndex]);
				setIsFading(false);
			}, 500); // Half of the transition time
		};

		// Set initial image
		if (!currentImage) {
			setCurrentImage(
				backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
			);
		}

		// Change image every 3 seconds
		const intervalId = setInterval(changeImage, 3000);

		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<Header />

			{/* Hero Section */}
			<section className="relative w-full h-screen overflow-hidden">
				{/* Hero Image Background */}
				<div className="absolute inset-0 bg-gray-200">
					{currentImage && (
						<Image
							src={currentImage}
							alt="Fashion Model"
							fill
							priority
							quality={100}
							sizes="100vw"
							className={`object-cover transition-opacity duration-1000 ${
								isFading ? 'opacity-0' : 'opacity-100'
							}`}
							style={{
								objectFit: 'cover',
								objectPosition: 'center',
							}}
						/>
					)}
				</div>

				{/* Text Overlay */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center">
						<div
							className="flex flex-col items-center md:flex-row md:justify-center md:items-baseline"
							style={{ fontFamily: 'var(--font-marcellus), serif' }}
						>
							<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wider">
								<AnimatedText text="LOOKS YOU" />
							</h2>
							<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wider md:ml-2 lg:ml-4">
								<AnimatedText text="REMEMBER" />
							</h2>
						</div>
						<div className="w-full flex justify-center mt-8">
							<AnimatedButton
								href="/shop"
								defaultText="Shop Now"
								hoverText="SHOP NOW"
								className="bg-white text-black font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors"
							>
								<svg
									className="w-4 h-4 ml-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							</AnimatedButton>
						</div>
					</div>
				</div>

				{/* Speaker Icon - Bottom Right */}
				<button className="absolute bottom-6 right-6 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
					<svg
						className="w-6 h-6 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343l13.314 13.314M9.879 9.879a3 3 0 000 4.243m4.242-4.242a3 3 0 00-4.242-4.242"
						/>
					</svg>
				</button>
			</section>

			{/* Bottom Navigation Bar */}
			<nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-center space-x-8 md:space-x-12 h-16">
						<a
							href="#"
							className="text-white hover:text-gray-200 transition-colors font-medium text-sm md:text-base uppercase tracking-wide drop-shadow-lg"
						>
							LIMITED DROPS
						</a>
						<a
							href="#"
							className="text-white hover:text-gray-200 transition-colors font-medium text-sm md:text-base uppercase tracking-wide drop-shadow-lg"
						>
							ICONIC STYLING
						</a>
						<a
							href="#"
							className="text-white hover:text-gray-200 transition-colors font-medium text-sm md:text-base uppercase tracking-wide drop-shadow-lg"
						>
							THIS SEASON
						</a>
						<a
							href="#"
							className="text-white hover:text-gray-200 transition-colors font-medium text-sm md:text-base uppercase tracking-wide drop-shadow-lg"
						>
							NS STORY
						</a>
					</div>
				</div>
			</nav>
		</div>
	);
}
