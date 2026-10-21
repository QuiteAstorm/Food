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
        <button className="brand-home" type="button" onClick={() => setCategory(null)}
          aria-label="Return to home">
          Juan's El Caporal
        </button>
        <span>Authentic Mexican Restaurant</span>
      </header>
      {category ? (
        <MenuGallery key={category.name} category={category.name}
          items={category.items} onBackToCategories={() => setCategory(null)} />
      ) : (
        <main className="restaurant-home">
          <section className="landing-hero" aria-label="Welcome to Juan's El Caporal">
            <img className="landing-logo"
              src="https://raw.githubusercontent.com/QuiteAstorm/Juans-El-Caporal/master/src/components/JUANS.png"
              alt="Juan's El Caporal restaurant logo" />
            <div className="landing-message">
              <h1>Great Family Atmosphere</h1>
              <p>Dine In or Takeout</p>
              <button className="explore-button" type="button"
                onClick={() => document.getElementById('food-categories').scrollIntoView({ behavior: 'smooth' })}>
                Explore Our Menu ↓
              </button>
            </div>
          </section>
          <section className="landing-info">
            <img className="landing-phone"
              src="https://raw.githubusercontent.com/QuiteAstorm/Juans-El-Caporal/master/src/components/juanspho.png"
              alt="Juan's El Caporal contact information" />
            <div className="landing-hours">
              <h2>Restaurant Hours</h2>
              <p>Sunday–Thursday: 11 AM–9 PM</p>
              <p>Friday–Saturday: 11 AM–10 PM</p>
              <small>Hours reproduced from the original website; please confirm before relying on them.</small>
            </div>
          </section>
          <section id="food-categories" className="menu-section">
            <h2>Explore Our Menu</h2>
            <div className="category-grid">
              {categories.map((entry) => (
                <button key={entry.name} className="category-button" type="button"
                  onClick={() => setCategory(entry)}>
                  {entry.name} <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
            <p>More original menu categories are being restored.</p>
          </section>
        </main>
      )}
    </div>
  );
}
