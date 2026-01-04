import { Product, Category } from '@/types';

// Dummy product data
export const dummyProducts: Product[] = [
  // Women's Products
  {
    id: '1',
    name: 'Elegant Pinstripe Blazer',
    description: 'A sophisticated pinstripe blazer perfect for professional and casual occasions. Made with premium fabric for comfort and style.',
    price: 45000,
    originalPrice: 55000,
    images: ['/images/products/women/blazer-1.jpg', '/images/products/women/blazer-2.jpg'],
    category: 'women',
    brand: 'NS Store',
    tags: ['blazer', 'professional', 'formal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy Blue', hex: '#1e3a8a' },
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#6b7280' }
    ],
    inStock: true,
    stockQuantity: 25,
    rating: 4.5,
    reviewCount: 32,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Classic White Shirt',
    description: 'Timeless white shirt with nautical pattern. Perfect for any occasion, from office to weekend outings.',
    price: 25000,
    images: ['/images/products/women/shirt-1.jpg'],
    category: 'women',
    brand: 'NS Store',
    tags: ['shirt', 'casual', 'classic'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Cream', hex: '#fef3c7' }
    ],
    inStock: true,
    stockQuantity: 40,
    rating: 4.7,
    reviewCount: 48,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Summer Floral Dress',
    description: 'Beautiful floral print dress perfect for summer. Lightweight and comfortable with elegant design.',
    price: 35000,
    originalPrice: 42000,
    images: ['/images/products/women/dress-1.jpg'],
    category: 'women',
    brand: 'NS Store',
    tags: ['dress', 'summer', 'floral'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Multicolor', hex: '#f59e0b' },
      { name: 'Pink', hex: '#ec4899' }
    ],
    inStock: true,
    stockQuantity: 18,
    rating: 4.3,
    reviewCount: 27,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
  },
  {
    id: '4',
    name: 'Designer Handbag',
    description: 'Luxury designer handbag with premium leather. Spacious interior with multiple compartments.',
    price: 85000,
    images: ['/images/products/women/bag-1.jpg'],
    category: 'women',
    brand: 'NS Store',
    tags: ['handbag', 'accessories', 'luxury'],
    sizes: ['One Size'],
    colors: [
      { name: 'Brown', hex: '#92400e' },
      { name: 'Black', hex: '#000000' },
      { name: 'Tan', hex: '#d97706' }
    ],
    inStock: true,
    stockQuantity: 12,
    rating: 4.8,
    reviewCount: 56,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15'
  },
  // Men's Products
  {
    id: '5',
    name: 'Classic Suit Set',
    description: 'Premium two-piece suit perfect for formal occasions. Tailored fit with modern design.',
    price: 95000,
    originalPrice: 120000,
    images: ['/images/products/men/suit-1.jpg'],
    category: 'men',
    brand: 'NS Store',
    tags: ['suit', 'formal', 'business'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Navy', hex: '#1e3a8a' },
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Black', hex: '#000000' }
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.6,
    reviewCount: 41,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-21'
  },
  {
    id: '6',
    name: 'Casual Denim Jeans',
    description: 'Comfortable denim jeans with stretch fabric. Perfect for everyday wear.',
    price: 28000,
    images: ['/images/products/men/jeans-1.jpg'],
    category: 'men',
    brand: 'NS Store',
    tags: ['jeans', 'casual', 'denim'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Blue', hex: '#2563eb' },
      { name: 'Dark Blue', hex: '#1e40af' },
      { name: 'Black', hex: '#000000' }
    ],
    inStock: true,
    stockQuantity: 35,
    rating: 4.4,
    reviewCount: 63,
    createdAt: '2024-01-11',
    updatedAt: '2024-01-17'
  },
  {
    id: '7',
    name: 'Polo Shirt',
    description: 'Classic polo shirt in premium cotton. Versatile and comfortable for any occasion.',
    price: 22000,
    images: ['/images/products/men/polo-1.jpg'],
    category: 'men',
    brand: 'NS Store',
    tags: ['polo', 'casual', 'cotton'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Navy', hex: '#1e3a8a' },
      { name: 'Gray', hex: '#6b7280' },
      { name: 'Black', hex: '#000000' }
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 4.5,
    reviewCount: 89,
    createdAt: '2024-01-09',
    updatedAt: '2024-01-16'
  },
  // Kids Products
  {
    id: '8',
    name: 'Kids Play Set',
    description: 'Comfortable play set for active kids. Durable fabric that withstands playtime.',
    price: 18000,
    images: ['/images/products/kids/playset-1.jpg'],
    category: 'kids',
    brand: 'NS Store',
    tags: ['playset', 'casual', 'comfortable'],
    sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
    colors: [
      { name: 'Blue', hex: '#3b82f6' },
      { name: 'Pink', hex: '#ec4899' },
      { name: 'Green', hex: '#10b981' }
    ],
    inStock: true,
    stockQuantity: 28,
    rating: 4.6,
    reviewCount: 34,
    createdAt: '2024-01-13',
    updatedAt: '2024-01-20'
  },
  {
    id: '9',
    name: 'Kids School Uniform',
    description: 'Classic school uniform set. Comfortable and durable for daily wear.',
    price: 15000,
    images: ['/images/products/kids/uniform-1.jpg'],
    category: 'kids',
    brand: 'NS Store',
    tags: ['uniform', 'school', 'formal'],
    sizes: ['6Y', '8Y', '10Y', '12Y', '14Y'],
    colors: [
      { name: 'Navy', hex: '#1e3a8a' },
      { name: 'Gray', hex: '#6b7280' }
    ],
    inStock: true,
    stockQuantity: 42,
    rating: 4.4,
    reviewCount: 25,
    createdAt: '2024-01-07',
    updatedAt: '2024-01-14'
  },
  // Best Sellers
  {
    id: '10',
    name: 'Designer Sunglasses',
    description: 'Stylish designer sunglasses with UV protection. Perfect accessory for any outfit.',
    price: 32000,
    originalPrice: 40000,
    images: ['/images/products/accessories/sunglasses-1.jpg'],
    category: 'best-sellers',
    brand: 'NS Store',
    tags: ['sunglasses', 'accessories', 'designer'],
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#92400e' },
      { name: 'Tortoise', hex: '#78350f' }
    ],
    inStock: true,
    stockQuantity: 20,
    rating: 4.7,
    reviewCount: 112,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12'
  },
  {
    id: '11',
    name: 'Leather Watch',
    description: 'Elegant leather strap watch with classic design. Perfect for both casual and formal wear.',
    price: 55000,
    images: ['/images/products/accessories/watch-1.jpg'],
    category: 'best-sellers',
    brand: 'NS Store',
    tags: ['watch', 'accessories', 'leather'],
    sizes: ['One Size'],
    colors: [
      { name: 'Brown', hex: '#92400e' },
      { name: 'Black', hex: '#000000' }
    ],
    inStock: true,
    stockQuantity: 16,
    rating: 4.9,
    reviewCount: 78,
    createdAt: '2024-01-06',
    updatedAt: '2024-01-13'
  },
  {
    id: '12',
    name: 'Premium Sneakers',
    description: 'Comfortable and stylish sneakers for everyday wear. High-quality materials and modern design.',
    price: 42000,
    originalPrice: 50000,
    images: ['/images/products/shoes/sneakers-1.jpg'],
    category: 'best-sellers',
    brand: 'NS Store',
    tags: ['sneakers', 'shoes', 'casual'],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#6b7280' }
    ],
    inStock: true,
    stockQuantity: 30,
    rating: 4.6,
    reviewCount: 95,
    createdAt: '2024-01-04',
    updatedAt: '2024-01-11'
  }
];

// Helper functions
export const getProductsByCategory = (category: Category): Product[] => {
  return dummyProducts.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return dummyProducts.find(product => product.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return dummyProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getBestSellers = (): Product[] => {
  return dummyProducts.filter(product => product.category === 'best-sellers');
};

export const getFeaturedProducts = (limit: number = 8): Product[] => {
  return dummyProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

