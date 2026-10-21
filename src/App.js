import React from 'react';
import MenuGallery from './components/MenuGallery';
import { burritoItems } from './data/burritoItems';
import './App.css';

export default function App() {
  const [category, setCategory] = React.useState(null);
  return (
    <div className="restaurant-app">
      <header className="restaurant-header">
        <h1>Juan's El Caporal</h1>
        <p>Explore our menu</p>
      </header>
      {category ? (
        <MenuGallery key={category} category={category}
          items={burritoItems} onBackToCategories={() => setCategory(null)} />
      ) : (
        <main className="restaurant-home">
          <h2>Menu categories</h2>
          <button className="category-button" type="button"
            onClick={() => setCategory('Burritos & favorites')}>
            Burritos & favorites
          </button>
          <p>Additional original menu categories are being restored.</p>
        </main>
      )}
    </div>
  );
}
