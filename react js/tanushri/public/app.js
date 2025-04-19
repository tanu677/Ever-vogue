import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';

// UserProfile Component
class UserProfile extends Component {
  render() {
    const { name, email, role } = this.props;
    return (
      <div>
        <h2>User Profile</h2>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Role: {role}</p>
      </div>
    );
  }
}

// ProductDetails Component
class ProductDetails extends Component {
  render() {
    const { name, price, description } = this.props;
    return (
      <div>
        <h2>Product Details</h2>
        <p>Name: {name}</p>
        <p>Price: ${price}</p>
        <p>Description: {description}</p>
      </div>
    );
  }
}

// CartSummary Component
class CartSummary extends Component {
  render() {
    const { itemCount, totalPrice } = this.props;
    return (
      <div>
        <h2>Cart Summary</h2>
        <p>Total Items: {itemCount}</p>
        <p>Total Price: ${totalPrice}</p>
      </div>
    );
  }
}

// App Component (Parent)
class App extends Component {
  render() {
    const user = {
      name: 'Tanushri',
      email: 'tanushri@example.com',
      role: 'Customer',
    };

    const product = {
      name: 'Elegant Necklace',
      price: 149.99,
      description: 'A beautiful handcrafted necklace with gemstone inlay.',
    };

    const cart = {
      itemCount: 3,
      totalPrice: 449.97,
    };

    return (
      <div>
        <UserProfile name={user.name} email={user.email} role={user.role} />
        <ProductDetails name={product.name} price={product.price} description={product.description} />
        <CartSummary itemCount={cart.itemCount} totalPrice={cart.totalPrice} />
      </div>
    );
  }
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
