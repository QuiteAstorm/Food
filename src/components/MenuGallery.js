import React, { useState } from 'react';
import './MenuGallery.css';

/** Browse a single category, then return to the same category after viewing a dish. */
export default function MenuGallery({ category, items = [], onBackToCategories }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [brokenImages, setBrokenImages] = useState({});
  const visibleItems = items.filter(item =>
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  );
  const imageFor = (item, className) => (
    item.image && !brokenImages[item.id] ?
      <img className={className} src={item.image} alt={item.name}
        loading="lazy" onError={() => setBrokenImages(prev => ({ ...prev, [item.id]: true }))} /> :
      <span className="food-image-missing" role="img" aria-label="Food photo unavailable">🍽️</span>
  );
  return (
    <main className="food-category" aria-label={category}>
      <header className="food-category__header">
        <button type="button" className="food-back"
          onClick={selected ? () => setSelected(null) : onBackToCategories}>
          ← {selected ? 'Back to ' + category : 'All menu categories'}
        </button>
        <h1>{category}</h1>
        {!selected && <p>Choose a picture to see the dish details.</p>}
      </header>
      {selected ? (
        <article className="food-detail">
          {imageFor(selected, 'food-detail__image')}
          <div className="food-detail__text">
            <h2>{selected.name}</h2>
            <p>{selected.description || 'Description coming soon.'}</p>
            <strong>{selected.price || 'Price coming soon.'}</strong>
            <button className="food-back food-detail__back" type="button"
              onClick={() => setSelected(null)}>← Back to {category}</button>
          </div>
        </article>
      ) : (
        <>
          <label className="food-search-label" htmlFor="food-search">Find a dish in {category}</label>
          <input id="food-search" className="food-search" type="search" value={search}
            onChange={e => setSearch(e.target.value)} placeholder="Search this category…" />
          <div className="food-gallery">
            {visibleItems.map((item, index) => (
              <button type="button" className="food-tile"
                key={item.id || item.name + '-' + index}
                onClick={() => { setSelected(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                aria-label={'View details for ' + item.name}>
                {imageFor(item, 'food-tile__image')}
                <span>{item.name}</span>
              </button>
            ))}
            {!visibleItems.length && <p>{items.length ? 'No dishes match that search.' : 'Menu pictures will appear here when added.'}</p>}
          </div>
        </>
      )}
    </main>
  );
}
