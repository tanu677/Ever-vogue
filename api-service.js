// ==== API SERVICE FUNCTIONS ====

const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Authentication helper
function getAuthHeader() {
  token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
}

// Cart API functions
async function fetchCartFromApi() {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    return data.success ? data.data.items : [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return getCart(); // Fallback to local cart if API fails
  }
}

async function addToCartApi(product) {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: product.quantity || 1
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    // Fallback to local storage
    addToLocalCart(product);
  }
}

async function removeFromCartApi(productId) {
  try {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    console.error('Error removing from cart:', error);
    // Fallback to local
    removeFromLocalCart(productId);
  }
}

// Orders API functions
async function createOrderApi() {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (data.success) {
      // Clear local cart after successful order
      saveCart([]);
      updateCartCount();
    }
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Failed to create order' };
  }
}
// Wishlist API functions
async function fetchWishlistFromApi() {
  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    return data.success ? data.data.items : [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return getWishlist(); // Fallback to local wishlist if API fails
  }
}

async function addToWishlistApi(productId) {
  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ productId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    // Fallback to local storage
    addToLocalWishlist(product);
    return { success: false, message: error.message };
  }
}

async function removeFromWishlistApi(productId) {
  try {
    const response = await fetch(`${API_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    // Fallback to local
    removeFromLocalWishlist(productId);
    return { success: false, message: error.message };
  }
}