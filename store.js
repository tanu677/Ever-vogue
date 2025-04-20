// ==== CART FUNCTIONS ====

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(p => p.id === product.id);
  
    if (existing) {
        existing.quantity += product.quantity || 1;
    } else {
        cart.push({ ...product, quantity: product.quantity || 1 });
    }
  
    saveCart(cart);
    updateCartCount();
    alert("Added to cart!");
  }
  
  // ==== WISHLIST FUNCTIONS ====
  
  function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  }
  
  function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
  
  function addToWishlist(product) {
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
  
  function moveToCartFromWishlist(productId) {
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
  
  // ==== RENDER CART ====
  
  function renderCartItems() {
    const cart = getCart();
    const container = document.querySelector('.cart-items');
    if (!container) return;
  
    container.innerHTML = '';
    let totalItems = 0;
    let subtotal = 0;
  
    if (cart.length === 0) {
      container.innerHTML = '<div class="empty-cart">Your cart is empty. <a href="index.html">Continue shopping</a></div>';
      return;
    }
  
    cart.forEach(product => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${product.image}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-top">
                    <div class="cart-item-info">
                        <h3>${product.name}</h3>
                        <p class="cart-item-category">${product.category}</p>
                        <p class="cart-item-meta">Size: ${product.size} | Color: ${product.color}</p>
                    </div>
                    <button class="cart-item-remove" data-id="${product.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-item-bottom">
                    <div class="quantity-control">
                        <button class="quantity-btn" data-id="${product.id}" data-action="decrease">-</button>
                        <input type="text" class="quantity-input" value="${product.quantity}" readonly>
                        <button class="quantity-btn" data-id="${product.id}" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-price">
                        ${product.oldPrice !== product.price ? 
                          `<span class="old-price">Rs ${product.oldPrice.toFixed(2)}</span>` : ''}
                        <span class="current-price">Rs ${product.price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
        totalItems += product.quantity;
        subtotal += product.quantity * product.price;
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
  
  function setupCartControls() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const action = btn.dataset.action;
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
            let cart = getCart();
            cart = cart.filter(p => p.id !== id);
            saveCart(cart);
            renderCartItems();
            updateCartCount();
        });
    });
  }
  
  // ==== RENDER WISHLIST ====
  
  function renderWishlistItems() {
    const wishlist = getWishlist();
    const container = document.querySelector('.wishlist-container');
    if (!container) return;
  
    container.innerHTML = '';
    
    if (wishlist.length === 0) {
      container.innerHTML = '<div class="empty-wishlist">Your wishlist is empty. <a href="index.html">Continue shopping</a></div>';
      return;
    }
  
    wishlist.forEach(product => {
        const item = document.createElement('div');
        item.className = 'wishlist-item';
        item.innerHTML = `
            <div class="wishlist-item-remove" data-id="${product.id}">
                <i class="fas fa-times"></i>
            </div>
            <img src="${product.image}" class="wishlist-item-image">
            <div class="wishlist-item-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <p>Size: ${product.size} | Color: ${product.color}</p>
                <div class="wishlist-item-price">
                    ${product.oldPrice !== product.price ? 
                      `<span class="old-price">Rs ${product.oldPrice.toFixed(2)}</span>` : ''}
                    <span class="current-price">Rs ${product.price.toFixed(2)}</span>
                </div>
                <button class="move-to-cart-btn" data-id="${product.id}">Move to Cart</button>
            </div>
        `;
        container.appendChild(item);
    });
  
    // Set up move to cart buttons
    document.querySelectorAll('.move-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            moveToCartFromWishlist(btn.dataset.id);
            renderWishlistItems();
        });
    });
  
    // Set up remove from wishlist buttons
    document.querySelectorAll('.wishlist-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            let wishlist = getWishlist();
            wishlist = wishlist.filter(p => p.id !== id);
            saveWishlist(wishlist);
            renderWishlistItems();
            updateWishlistCount();
        });
    });
  }
  
  // ==== PRODUCT PAGE FUNCTIONS ====
  
  // Update product detail page buttons
  function setupProductButtons() {
    // Update the click event handlers for Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productContainer = button.closest('.product-container');
        
        // Get product information
        const productTitle = productContainer.querySelector('.product-title').textContent;
        const productCategory = productContainer.querySelector('.product-category').textContent;
        
        // Get product price (handle both sale and regular items)
        let productPrice, oldPrice;
        const newPriceElement = productContainer.querySelector('.new-price');
        const oldPriceElement = productContainer.querySelector('.old-price');
        
        productPrice = parseFloat(newPriceElement.textContent.replace('Rs', '').trim());
        oldPrice = oldPriceElement ? parseFloat(oldPriceElement.textContent.replace('Rs', '').trim()) : productPrice;
        
        // Get product image
        const productImage = productContainer.querySelector('.main-image').src;
        
        // Get selected quantity
        const quantity = parseInt(productContainer.querySelector('.quantity-input').value);
        
        // Get selected size and color
        const selectedSize = productContainer.querySelector('.size-option.active')?.textContent || 'Default';
        const selectedColorElement = productContainer.querySelector('.color-option.active');
        const selectedColor = selectedColorElement ? 
          selectedColorElement.style.backgroundColor : 'Default';
        
        // Create unique ID based on product name (you might want to use a more robust ID system)
        const productId = productTitle.toLowerCase().replace(/\s+/g, '-');
        
        // Create product object
        const product = {
          id: productId,
          name: productTitle,
          category: productCategory,
          price: productPrice,
          oldPrice: oldPrice || productPrice,
          image: productImage,
          quantity: quantity,
          size: selectedSize,
          color: selectedColor
        };
        
        // Call the addToCart function
        addToCart(product);
      });
    });
  
    // Update the click event handlers for Add to Wishlist buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
      button.addEventListener('click', () => {
        const productContainer = button.closest('.product-container');
        
        // Get product information
        const productTitle = productContainer.querySelector('.product-title').textContent;
        const productCategory = productContainer.querySelector('.product-category').textContent;
        
        // Get product price (handle both sale and regular items)
        let productPrice, oldPrice;
        const newPriceElement = productContainer.querySelector('.new-price');
        const oldPriceElement = productContainer.querySelector('.old-price');
        
        productPrice = parseFloat(newPriceElement.textContent.replace('Rs', '').trim());
        oldPrice = oldPriceElement ? parseFloat(oldPriceElement.textContent.replace('Rs', '').trim()) : productPrice;
        
        // Get product image
        const productImage = productContainer.querySelector('.main-image').src;
        
        // Get selected size and color
        const selectedSize = productContainer.querySelector('.size-option.active')?.textContent || 'Default';
        const selectedColorElement = productContainer.querySelector('.color-option.active');
        const selectedColor = selectedColorElement ? 
          selectedColorElement.style.backgroundColor : 'Default';
        
        // Create unique ID based on product name
        const productId = productTitle.toLowerCase().replace(/\s+/g, '-');
        
        // Create product object
        const product = {
          id: productId,
          name: productTitle,
          category: productCategory,
          price: productPrice,
          oldPrice: oldPrice || productPrice,
          image: productImage,
          size: selectedSize,
          color: selectedColor
        };
        
        // Call the addToWishlist function
        addToWishlist(product);
      });
    });
  }
  
  // ==== HEADER COUNT INDICATORS ====
  
  // Function to update cart count in the header
  function updateCartCount() {
    const cart = getCart();
    const cartIcon = document.querySelector('.icons a[href="cart.html"] i');
    
    if (cartIcon) {
      // Create or update the count indicator
      let countBadge = cartIcon.nextElementSibling;
      if (!countBadge || !countBadge.classList.contains('count-badge')) {
        countBadge = document.createElement('span');
        countBadge.classList.add('count-badge');
        cartIcon.parentNode.appendChild(countBadge);
      }
      
      // Count total items in cart
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      countBadge.textContent = totalItems;
      
      // Hide badge if no items
      countBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
  }
  
  // Function to update wishlist count in the header
  function updateWishlistCount() {
    const wishlist = getWishlist();
    const wishlistIcon = document.querySelector('.icons a[href="wishlist.html"] i, .icons a[href="wishlisht.html"] i');
    
    if (wishlistIcon) {
      // Create or update the count indicator
      let countBadge = wishlistIcon.nextElementSibling;
      if (!countBadge || !countBadge.classList.contains('count-badge')) {
        countBadge = document.createElement('span');
        countBadge.classList.add('count-badge');
        wishlistIcon.parentNode.appendChild(countBadge);
      }
      
      countBadge.textContent = wishlist.length;
      countBadge.style.display = wishlist.length > 0 ? 'block' : 'none';
    }
  }
  
  // Add some CSS for the count badges
  function addCountBadgeStyles() {
    const existingStyle = document.getElementById('count-badge-style');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'count-badge-style';
    style.textContent = `
      .icons a {
        position: relative;
      }
      .count-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: gold;
        color: black;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      }
      
      /* Cart page styles */
      .cart-items {
        width: 100%;
        margin-bottom: 30px;
      }
      
      .cart-item {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 20px 0;
      }
      
      .cart-item-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        margin-right: 20px;
      }
      
      .cart-item-details {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      
      .cart-item-top {
        display: flex;
        justify-content: space-between;
      }
      
      .cart-item-info h3 {
        margin: 0 0 5px 0;
      }
      
      .cart-item-category {
        color: #666;
        margin: 0 0 5px 0;
      }
      
      .cart-item-meta {
        font-size: 14px;
        color: #666;
      }
      
      .cart-item-remove {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
      }
      
      .cart-item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
      }
      
      .quantity-control {
        display: flex;
        align-items: center;
      }
      
      .cart-item-price {
        font-weight: bold;
      }
      
      .old-price {
        text-decoration: line-through;
        color: #999;
        margin-right: 10px;
      }
      
      /* Empty cart/wishlist messages */
      .empty-cart, .empty-wishlist {
        text-align: center;
        padding: 40px 0;
        font-size: 18px;
        color: #666;
      }
      
      .empty-cart a, .empty-wishlist a {
        color: black;
        text-decoration: underline;
        font-weight: bold;
      }
      
      /* Wishlist page styles */
      .wishlist-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .wishlist-item {
        position: relative;
        border: 1px solid #eee;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
      }
      
      .wishlist-item-remove {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
      }
      
      .wishlist-item-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        margin-bottom: 15px;
      }
      
      .wishlist-item h3 {
        margin: 0 0 5px 0;
      }
      
      .wishlist-item p {
        color: #666;
        margin: 0 0 10px 0;
      }
      
      .move-to-cart-btn {
        background: black;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        transition: all 0.3s ease;
      }
      
      .move-to-cart-btn:hover {
        background: gold;
        color: black;
      }
    `;
    document.head.appendChild(style);
  }
  
  // ==== ON PAGE LOAD INIT ====
  
  document.addEventListener('DOMContentLoaded', () => {
    // Add badge styles
    addCountBadgeStyles();
    
    // Initialize counts
    updateCartCount();
    updateWishlistCount();
    
    // Setup product buttons if on product page
    setupProductButtons();
    
    // Render cart if on cart page
    renderCartItems();
    
    // Render wishlist if on wishlist page
    renderWishlistItems();
  });
  document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Navigate to checkout page
            window.location.href = 'checkout.html';
        });
    }
});
// This code handles both cart and checkout functionality
document.addEventListener('DOMContentLoaded', function() {
  // Cart page functionality
  const checkoutBtn = document.querySelector('.checkout-btn');
  const quantityBtns = document.querySelectorAll('.quantity-btn');
  const removeButtons = document.querySelectorAll('.cart-item-remove');
  
  // Handle checkout button
  if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
          window.location.href = 'checkout.html';
      });
  }
  
  // Handle quantity buttons
  if (quantityBtns.length > 0) {
      quantityBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const input = this.parentElement.querySelector('.quantity-input');
              let value = parseInt(input.value);
              
              if (this.textContent === '+') {
                  input.value = value + 1;
              } else if (this.textContent === '-' && value > 1) {
                  input.value = value - 1;
              }
              
              // Update cart totals (this would need to be implemented)
              updateCartTotals();
          });
      });
  }
  
  // Handle remove buttons
  if (removeButtons.length > 0) {
      removeButtons.forEach(btn => {
          btn.addEventListener('click', function() {
              // Remove the cart item
              const cartItem = this.closest('.cart-item');
              cartItem.remove();
              
              // Update cart totals
              updateCartTotals();
              
              // Check if cart is empty
              const remainingItems = document.querySelectorAll('.cart-item');
              if (remainingItems.length === 0) {
                  showEmptyCart();
              }
          });
      });
  }
  
  // Function to update cart totals (placeholder)
  function updateCartTotals() {
      // This would calculate new totals based on quantities and prices
      console.log('Cart totals updated');
  }
  
  // Function to show empty cart
  function showEmptyCart() {
      const cartItems = document.querySelector('.cart-items');
      const cartSummary = document.querySelector('.cart-summary');
      const cartContainer = document.querySelector('.cart-container');
      
      if (cartItems && cartSummary && cartContainer) {
          cartItems.style.display = 'none';
          cartSummary.style.display = 'none';
          
          const emptyCart = document.createElement('div');
          emptyCart.className = 'cart-empty';
          emptyCart.innerHTML = `
              <i class="fas fa-shopping-cart"></i>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet.</p>
          <a href="index.html" class="continue-shopping">Start Shopping</a>
          `;
          
          cartContainer.appendChild(emptyCart);
      }
  }
});