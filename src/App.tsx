import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Catalog from './components/Catalog';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-crema text-negro-suave">
      <Header />

      <Catalog />

      <Footer />
    </div>
  );
}

export default App;
