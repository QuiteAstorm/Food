import React, { useState } from 'react';
import './MenuEditor.css';

/**
 * Prototype only: local draft editor. No authentication, server storage, or publishing.
 * Export JSON to preserve edits before clearing browser data.
 */
export default function MenuEditor({ categories, onExit }) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [message, setMessage] = useState('');
  const category = categories[categoryIndex];
  const item = category.items[itemIndex];
  const key = category.name + ':' + itemIndex;
  const draft = drafts[key] || { name: item.name, description: item.description || '', price: item.price || '', image: item.image || '' };
  const update = (field, value) => {
    setDrafts(previous => ({ ...previous, [key]: { ...draft, [field]: value } }));
    setMessage('');
  };
  const download = () => {
    const data = Object.entries(drafts).map(([id, values]) => ({ id, ...values }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'juans-menu-drafts.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Draft file downloaded. Keep it somewhere safe.');
  };
  return <main className="menu-editor">
    <button type="button" className="food-back" onClick={onExit}>← Back to website</button>
    <h1>Menu Editor Preview</h1>
    <p className="editor-warning"><strong>Draft mode only.</strong> This is not a private dashboard yet. Changes stay in this open page until you export them; they do not update the live menu. Please do not enter private information.</p>
    <div className="editor-controls">
      <label>Category
        <select value={categoryIndex} onChange={e => { setCategoryIndex(Number(e.target.value)); setItemIndex(0); }}>
          {categories.map((entry, i) => <option key={entry.name} value={i}>{entry.name}</option>)}
        </select>
      </label>
      <label>Dish
        <select value={itemIndex} onChange={e => setItemIndex(Number(e.target.value))}>
          {category.items.map((entry, i) => <option key={i} value={i}>{entry.name}</option>)}
        </select>
      </label>
    </div>
    <div className="editor-fields">
      <label>Dish name<input value={draft.name} onChange={e => update('name', e.target.value)} /></label>
      <label>Description<textarea rows="5" value={draft.description} onChange={e => update('description', e.target.value)} placeholder="Ingredients and preparation…" /></label>
      <label>Price (include $)<input value={draft.price} onChange={e => update('price', e.target.value)} placeholder="e.g. $9.99" /></label>
      <label>Photo URL<input value={draft.image.startsWith('data:') ? '' : draft.image} onChange={e => update('image', e.target.value)} placeholder="Optional replacement image URL" /></label>
    </div>
    <p>{Object.keys(drafts).length} dish draft(s) edited this session.</p>
    <button type="button" className="editor-export" disabled={!Object.keys(drafts).length} onClick={download}>Download my draft changes</button>
    {message && <p role="status">{message}</p>}
  </main>;
}
