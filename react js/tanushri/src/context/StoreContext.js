import React, { createContext, useContext, useEffect, useState } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + product.quantity } : p);
      }
      return [...prev, product];
    });
    alert('Added to cart!');
  };

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) {
        alert('Already in wishlist');
        return prev;
      }
      alert('Added to wishlist!');
      return [...prev, product];
    });
  };

  const moveToCartFromWishlist = (productId) => {
    const product = wishlist.find(p => p.id === productId);
    if (product) {
      setCart(prev => [...prev, { ...product, quantity: 1 }]);
      setWishlist(prev => prev.filter(p => p.id !== productId));
    }
  };

  return (
    <StoreContext.Provider value={{ cart, wishlist, addToCart, addToWishlist, moveToCartFromWishlist }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
