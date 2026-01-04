'use client';

import Header2 from '@/components/Header2';
import { useState } from 'react';
import Image from 'next/image';

const categories = [
	'All Categories',
	'Men',
	'Women',
	'Shoes',
	'Handbags',
	'Tops',
	'Pants',
	'Accessories',
	'Wigs',
	'Sunglasses',
];

// Sample product data
const products = Array(12)
	.fill(0)
	.map((_, i) => ({
		id: i + 1,
		name: `Product ${i + 1}`,
		category: ['Men', 'Women', 'Shoes', 'Accessories'][
			Math.floor(Math.random() * 4)
		],
		price: (Math.random() * 100 + 20).toFixed(2),
		image: `/images/product-${(i % 6) + 1}.jpg`,
		rating: Math.floor(Math.random() * 5) + 1,
	}));

function ShopPage() {
	const [activeCategory, setActiveCategory] = useState('All Categories');
	const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

	const filteredProducts =
		activeCategory === 'All Categories'
			? products
			: products.filter((product) => product.category === activeCategory);

	return (
		<>
			<Header2 />
			<div className="w-full overflow-x-auto py-4 px-4 bg-white shadow-sm sticky top-0 z-10">
				<div className="flex justify-center space-x-2 min-w-max">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setActiveCategory(category)}
							className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
								activeCategory === category
									? 'bg-[#eb6404] text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							{category}
						</button>
					))}
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
						<div
							key={product.id}
							className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
							onMouseEnter={() => setHoveredProduct(product.id)}
							onMouseLeave={() => setHoveredProduct(null)}
						>
							<div className="relative h-80 overflow-hidden">
								<div
									className={`w-full h-full transition-transform duration-700 ease-out ${
										hoveredProduct === product.id ? 'scale-110' : 'scale-100'
									}`}
									style={{
										transform:
											hoveredProduct === product.id ? 'scale(1.1)' : 'scale(1)',
										transition: 'transform 0.5s ease-out',
									}}
								>
									<Image
										src={product.image}
										alt={product.name}
										fill
										className="object-cover"
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									/>
								</div>
								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
							</div>
							<div className="p-4">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold">{product.name}</h3>
										<p className="text-gray-600">{product.category}</p>
									</div>
									<span className="text-lg font-bold text-[#eb6404]">
										${product.price}
									</span>
								</div>
								<div className="mt-2 flex items-center">
									{[...Array(5)].map((_, i) => (
										<svg
											key={i}
											className={`w-4 h-4 ${
												i < product.rating ? 'text-yellow-400' : 'text-gray-300'
											}`}
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
								<button className="mt-4 w-full bg-gray-900 text-white py-2 rounded-md hover:bg-[#eb6404] transition-colors duration-300">
									Add to Cart
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default ShopPage;
