import React from 'react';
import MenuGallery from './components/MenuGallery';
import { burritoItems } from './data/burritoItems';
import { appaItems } from './data/appaItems';
import { saladItems } from './data/saladItems';
import { soupItems } from './data/soupItems';
import { seafoodItems } from './data/seafoodItems';
import { polloItems } from './data/polloItems';
import { dessItems } from './data/dessItems';
import { breakItems } from './data/breakItems';
import './App.css';

const categories = [
  { name: 'Appetizers', items: appaItems },
  { name: 'Salads', items: saladItems },
  { name: 'Soups', items: soupItems },
  { name: 'Seafood', items: seafoodItems },
  { name: 'Chicken', items: polloItems },
  { name: 'Burritos & favorites', items: burritoItems },
  { name: 'Desserts', items: dessItems },
  { name: 'Breakfast', items: breakItems },
];

export default function App() {
  const [category, setCategory] = React.useState(null);
  return (
    <div className="restaurant-app">
      <header className="restaurant-header">
        <h1>Juan's El Caporal</h1>
        <p>Explore our menu</p>
      </header>
      {category ? (
        <MenuGallery key={category.name} category={category.name}
          items={category.items} onBackToCategories={() => setCategory(null)} />
      ) : (
        <main className="restaurant-home">
          <h2>Menu categories</h2>
          <div className="category-grid">
            {categories.map((entry) => (
              <button key={entry.name} className="category-button" type="button"
                onClick={() => setCategory(entry)}>
                {entry.name}
              </button>
            ))}
          </div>
          <p>More original menu categories are being restored.</p>
        </main>
      )}
    </div>
  );
}
