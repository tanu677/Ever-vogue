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

// Cart API functions removed - using local storage only

// Wishlist API functions removed - using local storage only

// Orders API functions removed - checkout handled locally

// Main add to cart function (uses local storage only)
async function addToCart(product) {
  addToLocalCart(product);
  alert("Added to cart!");
}

// Main add to wishlist function (uses local storage only)
async function addToWishlist(product) {
  const wishlist = getWishlist();
  if (!wishlist.find(p => p.id === product.id)) {
    wishlist.push(product);
    saveWishlist(wishlist);
    updateWishlistCount();
    alert("Added to wishlist!");
  } else {
    alert("Already in wishlist");
  }
}

// Checkout function handled locally
async function checkout() {
  // Handle checkout fully on frontend using local storage
  if (!isLoggedIn()) {
    alert("Please login to checkout");
    window.location.href = 'login.html';
    return;
  }

  // Simulate order placement success
  alert("Order placed successfully! (Simulated - no backend call)");
  // Clear local cart after checkout
  saveCart([]);
  updateCartCount();
  // Redirect to order confirmation page (can be static or simulated)
  window.location.href = 'order-confirmation.html';
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

// ==== AUTH FUNCTIONS ====

async function login(email, password) {
  console.log('Attempting login for:', email);
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    if (data.success) {
      localStorage.setItem('token', data.token);
      console.log('Token stored:', data.token);
      // Removed syncCartWithBackend and syncWishlistWithBackend calls
      return true;
    } else {
      alert('Login failed: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
    return false;
  }
}

// New function to fetch all products from backend API
async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      alert('Failed to fetch products: ' + data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Error fetching products. Please try again.');
    return [];
  }
}

// Export the new function
window.fetchProducts = fetchProducts;

// New function to update product via API
async function updateProductApi(product) {
  try {
    const response = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(product)
    });
    const data = await response.json();
    if (data.success) {
      alert('Product updated successfully');
      return data.data;
    } else {
      alert('Failed to update product: ' + data.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating product:', error);
    alert('Error updating product. Please try again.');
    return null;
  }
}

// Export the new function
window.updateProductApi = updateProductApi;

async function register(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      return true;
    } else {
      alert('Registration failed: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
    return false;
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// ==== CART FUNCTIONS ====

// Get cart from local storage (fallback)
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to local storage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to local cart (fallback)
function addToLocalCart(product) {
  const cart = getCart();
  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 });
  }

  saveCart(cart);
  updateCartCount();
}

// Remove from local cart (fallback)
function removeFromLocalCart(productId) {
  let cart = getCart();
  cart = cart.filter(p => p.id !== productId);
  saveCart(cart);
  updateCartCount();
}

// Sync local cart with backend after login removed

// Sync local wishlist with backend after login removed

// Function to update cart count in the header
async function updateCartCount() {
  const cart = getCart();
  const cartLength = cart.reduce((total, item) => total + item.quantity, 0);

  const cartIcon = document.querySelector('.icons a[href="cart.html"] i');

  if (cartIcon) {
    // Create or update the count indicator
    let countBadge = cartIcon.nextElementSibling;
    if (!countBadge || !countBadge.classList.contains('count-badge')) {
      countBadge = document.createElement('span');
      countBadge.classList.add('count-badge');
      cartIcon.parentNode.appendChild(countBadge);
    }

    countBadge.textContent = cartLength;
    countBadge.style.display = cartLength > 0 ? 'block' : 'none';
  }
}

// Function to update wishlist count in the header
async function updateWishlistCount() {
  const wishlist = getWishlist();
  const wishlistLength = wishlist.length;

  const wishlistIcon = document.querySelector('.icons a[href="wishlist.html"] i, .icons a[href="wishlisht.html"] i');

  if (wishlistIcon) {
    // Create or update the count indicator
    let countBadge = wishlistIcon.nextElementSibling;
    if (!countBadge || !countBadge.classList.contains('count-badge')) {
      countBadge = document.createElement('span');
      countBadge.classList.add('count-badge');
      wishlistIcon.parentNode.appendChild(countBadge);
    }

    countBadge.textContent = wishlistLength;
    countBadge.style.display = wishlistLength > 0 ? 'block' : 'none';
  }
}

// Sync local cart with backend after login
async function syncCartWithBackend() {
  console.log('Syncing cart with backend...');
  if (!isLoggedIn()) {
    console.log('User not logged in, skipping cart sync.');
    return;
  }
  
  const localCart = getCart();
  console.log('Local cart items to sync:', localCart.length);
  if (localCart.length > 0) {
    // Add each item to backend cart
    let allSuccess = true;
    for (const item of localCart) {
      const result = await addToCartApi(item);
      console.log('Sync addToCartApi result:', result);
      if (!result.success) {
        allSuccess = false;
      }
    }
    // Clear local cart only if all API calls succeeded
    if (allSuccess) {
      saveCart([]);
    } else {
      console.warn('Some items failed to sync to backend cart.');
    }
  }
  
  // Update UI with backend cart
  const cartData = await fetchCartFromApi();
  console.log('Fetched cart data from API:', cartData);
  updateCartUI(cartData);
}

// Function to update cart count in the header
async function updateCartCount() {
  let cartLength = 0;
  
  if (isLoggedIn()) {
    try {
      const cartData = await fetchCartFromApi();
      cartLength = cartData.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error updating cart count:', error);
      // Fallback to local storage
      const cart = getCart();
      cartLength = cart.reduce((total, item) => total + item.quantity, 0);
    }
  } else {
    const cart = getCart();
    cartLength = cart.reduce((total, item) => total + item.quantity, 0);
  }
  
  const cartIcon = document.querySelector('.icons a[href="cart.html"] i');
  
  if (cartIcon) {
    // Create or update the count indicator
    let countBadge = cartIcon.nextElementSibling;
    if (!countBadge || !countBadge.classList.contains('count-badge')) {
      countBadge = document.createElement('span');
      countBadge.classList.add('count-badge');
      cartIcon.parentNode.appendChild(countBadge);
    }
    
    countBadge.textContent = cartLength;
    countBadge.style.display = cartLength > 0 ? 'block' : 'none';
  }
}

// ==== WISHLIST FUNCTIONS ====

// Get wishlist from local storage (fallback)
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

// Save wishlist to local storage
function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Add to local wishlist (fallback)
function addToLocalWishlist(product) {
  const wishlist = getWishlist();
  if (!wishlist.find(p => p.id === product.id)) {
    wishlist.push(product);
    saveWishlist(wishlist);
    updateWishlistCount();
  }
}

// Remove from local wishlist (fallback)
function removeFromLocalWishlist(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(p => p.id !== productId);
  saveWishlist(wishlist);
  updateWishlistCount();
}

// Main add to wishlist function (uses API if user is logged in)
async function addToWishlist(product) {
  if (isLoggedIn()) {
    const result = await addToWishlistApi(product.id);
    if (result.success) {
      updateWishlistCount();
      alert("Added to wishlist!");
    } else {
      if (result.message === "Item already in wishlist") {
        alert("Already in wishlist");
      } else {
        alert("Failed to add to wishlist: " + result.message);
      }
    }
  } else {
    // Use local storage for non-logged in users
    const wishlist = getWishlist();
    if (!wishlist.find(p => p.id === product.id)) {
      wishlist.push(product);
      saveWishlist(wishlist);
      updateWishlistCount();
      alert("Added to wishlist!");
    } else {
      alert("Already in wishlist");
    }
  }
}

// Sync local wishlist with backend after login
async function syncWishlistWithBackend() {
  if (!isLoggedIn()) return;
  
  const localWishlist = getWishlist();
  if (localWishlist.length > 0) {
    // Add each item to backend wishlist
    for (const item of localWishlist) {
      await addToWishlistApi(item.id);
    }
    // Clear local wishlist after sync
    saveWishlist([]);
  }
  
  // Update UI with backend wishlist
  const wishlistData = await fetchWishlistFromApi();
  updateWishlistUI(wishlistData);
}

// Function to update wishlist count in the header
async function updateWishlistCount() {
  let wishlistLength = 0;
  
  if (isLoggedIn()) {
    try {
      const wishlistData = await fetchWishlistFromApi();
      wishlistLength = wishlistData.length;
    } catch (error) {
      console.error('Error updating wishlist count:', error);
      // Fallback to local storage
      const wishlist = getWishlist();
      wishlistLength = wishlist.length;
    }
  } else {
    const wishlist = getWishlist();
    wishlistLength = wishlist.length;
  }
  
  const wishlistIcon = document.querySelector('.icons a[href="wishlist.html"] i, .icons a[href="wishlisht.html"] i');
  
  if (wishlistIcon) {
    // Create or update the count indicator
    let countBadge = wishlistIcon.nextElementSibling;
    if (!countBadge || !countBadge.classList.contains('count-badge')) {
      countBadge = document.createElement('span');
      countBadge.classList.add('count-badge');
      wishlistIcon.parentNode.appendChild(countBadge);
    }
    
    countBadge.textContent = wishlistLength;
    countBadge.style.display = wishlistLength > 0 ? 'block' : 'none';
  }
}

// Move item from wishlist to cart
async function moveToCartFromWishlist(productId) {
  if (isLoggedIn()) {
    // Get product details first
    const wishlistData = await fetchWishlistFromApi();
    const product = wishlistData.find(item => item.product._id === productId || item.product.id === productId);
    
    if (product) {
      // Add to cart via API
      await addToCartApi({
        productId: product.product._id || product.product.id,
        quantity: 1
      });
      
      // Remove from wishlist
      await removeFromWishlistApi(productId);
      
      // Update UI
      renderWishlistItems();
      updateCartCount();
      updateWishlistCount();
    }
  } else {
    // Use local storage
    let wishlist = getWishlist();
    let cart = getCart();
  
    const product = wishlist.find(p => p.id === productId);
    if (product) {
      cart.push({ ...product, quantity: 1 });
      wishlist = wishlist.filter(p => p.id !== productId);
      saveCart(cart);
      saveWishlist(wishlist);
      updateCartCount();
      updateWishlistCount();
    }
  }
}

// ==== RENDER CART ====

async function renderCartItems() {
  const container = document.querySelector('.cart-items');
  if (!container) return;

  // Always use local cart regardless of login state
  const cart = getCart();
  console.log('renderCartItems - local cart:', cart);

  container.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">Your cart is empty. <a href="index.html">Continue shopping</a></div>';
    return;
  }

  cart.forEach(item => {
    // Use local format
    const product = item;
    const quantity = item.quantity;
    const price = product.price;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <img src="${product.image}" class="cart-item-image">
      <div class="cart-item-details">
          <div class="cart-item-top">
              <div class="cart-item-info">
                  <h3>${product.name}</h3>
                  <p class="cart-item-category">${product.category}</p>
                  <p class="cart-item-meta">Size: ${product.size || 'Default'} | Color: ${product.color || 'Default'}</p>
              </div>
              <button class="cart-item-remove" data-id="${product.id}">
                  <i class="fas fa-times"></i>
              </button>
          </div>
          <div class="cart-item-bottom">
              <div class="quantity-control">
                  <button class="quantity-btn" data-id="${product.id}" data-action="decrease">-</button>
                  <input type="text" class="quantity-input" value="${quantity}" readonly>
                  <button class="quantity-btn" data-id="${product.id}" data-action="increase">+</button>
              </div>
              <div class="cart-item-price">
                  ${product.oldPrice !== product.price ? 
                    `<span class="old-price">Rs ${product.oldPrice.toFixed(2)}</span>` : ''}
                  <span class="current-price">Rs ${price.toFixed(2)}</span>
              </div>
          </div>
      </div>
    `;
    container.appendChild(itemElement);
    subtotal += quantity * price;
  });

  // Update summary
  const summarySubtotal = document.querySelector('.summary-row span:nth-child(2)');
  if (summarySubtotal) summarySubtotal.textContent = `Rs ${subtotal.toFixed(2)}`;

  const totalSpan = document.querySelector('.summary-total span:nth-child(2)');
  if (totalSpan) {
    const shipping = subtotal > 0 ? 100 : 0;
    const discount = subtotal > 500 ? 500 : 0;
    const total = subtotal + shipping - discount;
    totalSpan.textContent = `Rs ${total.toFixed(2)}`;
  }

  setupCartControls();
}

// ==== RENDER WISHLIST ====

async function renderWishlistItems() {
  const container = document.querySelector('.wishlist-container');
  if (!container) return;

  let wishlistItems;
  
  if (isLoggedIn()) {
    // Get wishlist from API
    wishlistItems = await fetchWishlistFromApi();
  } else {
    // Use local storage
    wishlistItems = getWishlist();
  }

  container.innerHTML = '';
  
  if (!wishlistItems || wishlistItems.length === 0) {
    container.innerHTML = '<div class="empty-wishlist">Your wishlist is empty. <a href="index.html">Continue shopping</a></div>';
    return;
  }

  wishlistItems.forEach(item => {
    // Handle both API response format and local storage format
    const product = item.product || item;
    const productId = product._id || product.id;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'wishlist-item';
    itemElement.innerHTML = `
      <div class="wishlist-item-remove" data-id="${productId}">
        <i class="fas fa-times"></i>
      </div>
      <img src="${product.image}" class="wishlist-item-image">
      <div class="wishlist-item-info">
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p>Size: ${product.size || 'Default'} | Color: ${product.color || 'Default'}</p>
        <div class="wishlist-item-price">
          ${product.oldPrice !== product.price ? 
            `<span class="old-price">Rs ${product.oldPrice.toFixed(2)}</span>` : ''}
          <span class="current-price">Rs ${product.price.toFixed(2)}</span>
        </div>
        <button class="move-to-cart-btn" data-id="${productId}">Move to Cart</button>
      </div>
    `;
    container.appendChild(itemElement);
  });

  // Set up move to cart buttons
  document.querySelectorAll('.move-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      moveToCartFromWishlist(btn.dataset.id);
    });
  });

  // Set up remove from wishlist buttons
  document.querySelectorAll('.wishlist-item-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.id;
      
      if (isLoggedIn()) {
        await removeFromWishlistApi(productId);
      } else {
        removeFromLocalWishlist(productId);
      }
      
      renderWishlistItems();
      updateWishlistCount();
    });
  });
}

// ==== CART CONTROLS ====

function setupCartControls() {
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      // Always use local storage for cart
      const cart = getCart();
      const product = cart.find(p => p.id === id);
      if (!product) return;

      if (action === 'increase') {
        product.quantity += 1;
      } else if (action === 'decrease' && product.quantity > 1) {
        product.quantity -= 1;
      }

      saveCart(cart);
      renderCartItems();
      updateCartCount();
    });
  });

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;

      // Always use local storage for cart
      let cart = getCart();
      cart = cart.filter(p => p.id !== id);
      saveCart(cart);

      renderCartItems();
      updateCartCount();
    });
  });
}

// ==== CHECKOUT FUNCTION ====

async function checkout() {
  if (!isLoggedIn()) {
    alert("Please login to checkout");
    window.location.href = 'login.html';
    return;
  }
  
  // Handle checkout locally - clear cart and show success message
  saveCart([]);
  updateCartCount();
  alert("Order placed successfully! (Simulated locally)");
  window.location.href = 'order-confirmation.html'; // Redirect to confirmation page (adjust as needed)
}

// ==== PRODUCT PAGE FUNCTIONS ====

function setupProductButtons() {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const addToWishlistBtn = document.querySelector('.add-to-wishlist-btn');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const product = getProductFromPage();
      if (product) {
        addToCart(product);
      }
    });
  }
  
  if (addToWishlistBtn) {
    addToWishlistBtn.addEventListener('click', () => {
      const product = getProductFromPage();
      if (product) {
        addToWishlist(product);
      }
    });
  }
}

function getProductFromPage() {
  // Extract product info from the product page
  const productId = new URLSearchParams(window.location.search).get('id');
  const name = document.querySelector('.product-title')?.textContent;
  const category = document.querySelector('.product-category')?.textContent;
  const price = parseFloat(document.querySelector('.product-price .current-price')?.textContent.replace('Rs ', '') || '0');
  const oldPrice = parseFloat(document.querySelector('.product-price .old-price')?.textContent?.replace('Rs ', '') || price);
  const image = document.querySelector('.product-main-image')?.src;
  const size = document.querySelector('.size-options .selected')?.textContent;
  const color = document.querySelector('.color-options .selected')?.getAttribute('data-color');
  
  if (!productId || !name || !price || !image) {
    alert('Could not get product information');
    return null;
  }
  
  return {
    id: productId,
    name,
    category,
    price,
    oldPrice,
    image,
    size,
    color
  };
}

// Function to update UI elements with cart data
function updateCartUI(cartData) {
  updateCartCount();
  if (document.querySelector('.cart-items')) {
    renderCartItems();
  }
}

// Function to update UI elements with wishlist data
function updateWishlistUI(wishlistData) {
  updateWishlistCount();
  if (document.querySelector('.wishlist-container')) {
    renderWishlistItems();
  }
}

// Add styles for count badges
function addCountBadgeStyles() {
  if (!document.getElementById('count-badge-styles')) {
    const style = document.createElement('style');
    style.id = 'count-badge-styles';
    style.textContent = `
      .count-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: red;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icons a {
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }
}

// Update UI elements based on auth state
function updateAuthUI() {
  const loginButtons = document.querySelectorAll('.login-btn');
  const logoutButtons = document.querySelectorAll('.logout-btn');
  const profileLinks = document.querySelectorAll('.profile-link');
  
  if (isLoggedIn()) {
    loginButtons.forEach(btn => btn.style.display = 'none');
    logoutButtons.forEach(btn => btn.style.display = 'block');
    profileLinks.forEach(link => link.style.display = 'block');
  } else {
    loginButtons.forEach(btn => btn.style.display = 'block');
    logoutButtons.forEach(btn => btn.style.display = 'none');
    profileLinks.forEach(link => link.style.display = 'none');
  }
}

// ==== ON PAGE LOAD INIT ====

document.addEventListener('DOMContentLoaded', async () => {
  // Add badge styles
  addCountBadgeStyles();
  
  // Check if user is logged in
  if (isLoggedIn()) {
    try {
      // Validate token
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        // Token invalid, log out
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }
  
  // Initialize counts
  updateCartCount();
  updateWishlistCount();
  
  // Setup product buttons if on product page
  setupProductButtons();
  
  // Render cart if on cart page
  await renderCartItems();
  
  // Render wishlist if on wishlist page
  await renderWishlistItems();
  
  // Update UI elements based on auth state
  updateAuthUI();
  
  // Setup checkout button
  // const checkoutBtn = document.querySelector('.checkout-btn');
  // if (checkoutBtn) {
  //   checkoutBtn.addEventListener('click', checkout);
  // }
});

async function updateProfile(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
      return true;
    } else {
      alert('Update failed: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Update error:', error);
    alert('Update failed. Please try again.');
    return false;
  }
}

// Export functions for use in other scripts
window.login = login;
window.register = register;
window.logout = logout;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.updateProfile = updateProfile;
