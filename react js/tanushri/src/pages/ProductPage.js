import React from 'react';
import ProductCard from '../components/ProductCard';

const sampleProducts = [
  {
    id: '101',
    name: 'Elegant Kurta',
    category: 'Women',
    price: 699,
    oldPrice: 999,
    image: '/images/kurta1.jpg',
    thumbnails: ['/images/kurta1.jpg', '/images/kurta2.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Blue']
  },
  {
    id: '102',
    name: 'Stylish Shirt',
    category: 'Men',
    price: 799,
    oldPrice: 1199,
    image: '/images/shirt1.jpg',
    thumbnails: ['/images/shirt1.jpg', '/images/shirt2.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Green', 'Black']
  }
];

const ProductPage = () => {
  return (
    <div className="grid gap-6 p-6 md:grid-cols-2">
      {sampleProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductPage;
