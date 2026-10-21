import React, { useState } from 'react';
import './MenuGallery.css';

/**
 * Reusable category view. Pass items as:
 * [{ id, name, image, description, price }]
 * Missing details remain explicitly unfilled rather than guessed.
 */
export default function MenuGallery({ category, items = [], onBackToCategories }) {
  const [selected, setSelected] = useState(null);
  const goBack = () => setSelected(null);

  return (
    <section className="food-category" aria-label={category}>
      <header className="food-category__header">
        <button type="button" onClick={selected ? goBack : onBackToCategories}
          className="food-back">
          ← {selected ? 'Back to ' + category : 'All categories'}
        </button>
        <h1>{category}</h1>
      </header>

      {selected ? (
        <article className="food-detail">
          {selected.image && <img src={selected.image} alt={selected.name} />}
          <div className="food-detail__text">
            <h2>{selected.name}</h2>
            <p>{selected.description || 'Description coming soon.'}</p>
            <strong>{selected.price || 'Price coming soon.'}</strong>
          </div>
        </article>
      ) : (
        <div className="food-gallery">
          {items.map((item, index) => (
            <button type="button" className="food-tile"
              key={item.id || item.name + '-' + index}
              onClick={() => setSelected(item)}
              aria-label={'View details for ' + item.name}>
              {item.image && <img src={item.image} alt="" loading="lazy" />}
              <span>{item.name}</span>
            </button>
          ))}
          {!items.length && <p>Menu pictures will appear here when added.</p>}
        </div>
      )}
    </section>
  );
}
