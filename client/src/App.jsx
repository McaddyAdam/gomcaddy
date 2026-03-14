import { useState } from 'react';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AuthPage from './pages/AuthPage';
import CartSummary from './components/CartSummary';
import { menuItems, restaurants } from './data';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart((prev) => [...prev, item]);

  return (
    <div className="layout">
      <header>
        <h1>GoMcaddy</h1>
        <nav>
          <button onClick={() => setActivePage('home')}>Home</button>
          <button onClick={() => setActivePage('menu')}>Menu</button>
          <button onClick={() => setActivePage('auth')}>Login / Signup</button>
        </nav>
      </header>

      <main>
        {activePage === 'home' && (
          <HomePage search={search} setSearch={setSearch} restaurants={restaurants} />
        )}
        {activePage === 'menu' && <MenuPage menuItems={menuItems} addToCart={addToCart} />}
        {activePage === 'auth' && <AuthPage />}
      </main>

      <CartSummary cart={cart} />
    </div>
  );
}
