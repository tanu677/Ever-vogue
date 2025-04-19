import React, { useState } from 'react';
import { useStore } from '../context/storecontext';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState(product.image);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, size: selectedSize, color: selectedColor, image: mainImage });
  };

  const handleAddToWishlist = () => {
    addToWishlist({ ...product, size: selectedSize, color: selectedColor, image: mainImage });
  };

  return (
    <div className="border p-4 rounded-lg max-w-sm">
      <img src={mainImage} alt={product.name} className="w-full h-64 object-cover mb-2 rounded" />

      <div className="flex gap-2 mb-2">
        {product.thumbnails?.map((thumb, idx) => (
          <img
            key={idx}
            src={thumb}
            onClick={() => setMainImage(thumb)}
            className={`w-12 h-12 object-cover rounded cursor-pointer ${mainImage === thumb ? 'ring-2 ring-blue-500' : ''}`}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold product-name">{product.name}</h2>
      <p className="text-sm text-gray-500 product-category">{product.category}</p>

      <div className="flex items-center gap-2 my-2">
        <span className="text-gray-400 line-through old-price">Rs {product.oldPrice.toFixed(2)}</span>
        <span className="text-red-600 font-bold current-price">Rs {product.price.toFixed(2)}</span>
      </div>

      <div className="flex gap-2 mb-2">
        {product.sizes.map(size => (
          <button key={size} onClick={() => setSelectedSize(size)}
            className={`size-option px-3 py-1 border rounded ${selectedSize === size ? 'bg-black text-white' : ''}`}>
            {size}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        {product.colors.map(color => (
          <button key={color} onClick={() => setSelectedColor(color)}
            className={`color-option px-3 py-1 border rounded ${selectedColor === color ? 'bg-black text-white' : ''}`}>
            {color}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 my-3">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <input type="text" value={quantity} readOnly className="w-12 text-center border rounded" />
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>

      <button onClick={handleAddToCart} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Add to Cart</button>
      <button onClick={handleAddToWishlist} className="bg-gray-300 px-4 py-2 rounded">Add to Wishlist</button>
    </div>
  );
};

export default ProductCard;
