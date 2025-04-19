import React from 'react';
import { StoreProvider } from './context/StoreContext';
import ProductPage from './pages/ProductPage';

const App = () => {
  return (
    <StoreProvider>
      <ProductPage />
    </StoreProvider>
  );
};

export default App;
