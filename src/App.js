import React, { useState, useEffect } from 'react';

// 1. MOVIMOS EL CATÁLOGO AQUÍ ARRIBA (Fuera del componente para que Vercel no se queje)
const mockProducts = [
  { id: 1, name: 'Black Oversized T-Shirt', price: 45.00, category: 'Men', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Minimal Sports Top', price: 35.00, category: 'Women', img: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Beige Cargo Pants', price: 85.00, category: 'Men', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Zovu Minimalist Cap', price: 25.00, category: 'Accessories', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80' },
  { id: 6, name: 'Canvas Tote Bag', price: 40.00, category: 'Accessories', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80' }
];

const ZovuStore = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('New Arrivals');
  const [connectionStatus, setConnectionStatus] = useState('Conectando a Jakarta EE...');

  // 2. PUERTO DE SALIDA A JAKARTA EE
  useEffect(() => {
    const fetchFromJakarta = async () => {
      try {
        const response = await fetch('http://localhost:8080/zovu-backend/api/productos');
        
        if (!response.ok) throw new Error('Servidor no disponible');
        
        const data = await response.json();
        setProducts(data); 
        setConnectionStatus('✅ Conectado al API de Jakarta EE (JAX-RS)');
        
      } catch (error) {
        console.warn('Backend de Jakarta no detectado. Usando datos locales simulados.');
        setProducts(mockProducts); // Ahora esto funciona sin darle problemas a Vercel
        setConnectionStatus('⚠️ Modo Simulación (Esperando servidor Jakarta JAX-RS)');
      }
    };

    fetchFromJakarta();
  }, []);

  const filteredProducts = activeCategory === 'New Arrivals' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const categories = ['New Arrivals', 'Men', 'Women', 'Accessories'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      
      {/* BARRA DE NAVEGACIÓN */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter">ZOVU<span className="text-indigo-600">.</span></div>
          
          <nav className="hidden md:flex space-x-8 font-medium text-sm">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pb-1 transition-all ${
                  activeCategory === category 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-black transition-colors"
          >
            <span className="font-bold">🛒 Cart</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO BANNER */}
      {activeCategory === 'New Arrivals' && (
        <section className="relative bg-black text-white overflow-hidden animate-fadeIn">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80" 
            alt="Zovu Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">New Streetwear Collection</h1>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl">
              Exclusive designs, oversized fits, and premium quality. Upgrade your style this season.
            </p>
          </div>
        </section>
      )}

      {/* CATÁLOGO DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto px-4 py-16 flex-grow">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold animate-fadeIn">
            {activeCategory === 'New Arrivals' ? 'All Products' : `${activeCategory} Collection`}
          </h2>
          <span className="text-gray-500 text-sm font-medium">{filteredProducts.length} items</span>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl animate-pulse">Loading catalog via Jakarta EE...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 animate-fadeIn">
                <div className="aspect-w-3 aspect-h-4 overflow-hidden bg-gray-200">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                    </div>
                    <span className="font-black text-indigo-600">${product.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-black text-white font-bold py-2.5 rounded-xl hover:bg-indigo-600 transition-colors text-sm"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* INDICADOR DE PUERTOS DE SALIDA */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-t border-slate-800 flex justify-between items-center font-mono">
        <span>Arquitectura Frontend: React SPA</span>
        <span className={connectionStatus.includes('✅') ? 'text-emerald-400' : 'text-amber-400'}>
          Puerto de Salida: {connectionStatus}
        </span>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-black tracking-tighter mb-4">ZOVU<span className="text-indigo-500">.</span></div>
          <p className="text-gray-400 text-sm">© 2026 Zovu Store. All rights reserved.</p>
        </div>
      </footer>

      {/* MODAL DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-fadeIn">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">Your Cart ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <span className="text-6xl mb-4">🛍️</span>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 border-b pb-4">
                      <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="text-indigo-600 font-black mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-600">Total:</span>
                <span className="font-black text-2xl text-gray-900">${total.toFixed(2)}</span>
              </div>
              <button 
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                  cart.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ZovuStore;
