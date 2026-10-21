import React, { useEffect, useState } from 'react';
import './MenuEditor.css';

const STORAGE_KEY = 'juans-menu-editor-drafts-v1';
const fields = ['name', 'description', 'price', 'image'];
const readSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
};

/** Local draft tool only; NOT authenticated, private, or connected to a live menu. */
export default function MenuEditor({ categories, onExit }) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [drafts, setDrafts] = useState(readSaved);
  const [message, setMessage] = useState('');
  const category = categories[categoryIndex];
  const item = category.items[itemIndex];
  const key = category.name + ':' + itemIndex;
  const draft = drafts[key] || {};
  const value = field => draft[field] ?? (field === 'image' ? '' : item[field] || '');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts)); }
    catch { setMessage('Browser storage is unavailable. Download your drafts to keep them.'); }
  }, [drafts]);

  const update = (field, newValue) => {
    setDrafts(previous => ({ ...previous, [key]: { ...(previous[key] || {}), [field]: newValue } }));
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Draft file downloaded. Keep it somewhere safe.');
  };
  const importFile = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('Choose a draft file smaller than 1 MB.');
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed) || parsed.length > 500) throw new Error('Not a valid menu draft file.');
      const restored = {};
      for (const record of parsed) {
        if (!record || typeof record.id !== 'string' || !/^[^:]+:\\d+$/.test(record.id)) throw new Error('Invalid dish ID.');
        const [categoryName, index] = record.id.split(':');
        const matching = categories.find(c => c.name === categoryName);
        if (!matching || !matching.items[Number(index)]) throw new Error('Draft refers to an unknown dish.');
        const cleaned = {};
        for (const field of fields) {
          if (record[field] !== undefined) {
            if (typeof record[field] !== 'string' || record[field].length > 10000) throw new Error('Invalid field: ' + field);
            cleaned[field] = record[field];
          }
        }
        restored[record.id] = cleaned;
      }
      setDrafts(previous => ({ ...previous, ...restored }));
      setMessage('Imported ' + Object.keys(restored).length + ' dish drafts. They are still local only.');
    } catch (error) { setMessage(error.message || 'Unable to import this file.'); }
    event.target.value = '';
  };
  const clearDrafts = () => {
    if (!window.confirm('Delete all locally saved menu drafts on this device? Download a backup first.')) return;
    setDrafts({});
    setMessage('Local drafts cleared.');
  };

  return <main className="menu-editor">
    <button type="button" className="food-back" onClick={onExit}>← Back to website</button>
    <h1>Menu Editor Preview</h1>
    <p className="editor-warning"><strong>Draft mode only — not private.</strong> Edits are automatically saved in this browser on this device, but they are not published or stored on a server. Clearing browser data may erase them. Download a backup regularly. Do not enter private information.</p>
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
      <label>Dish name<input value={value('name')} onChange={e => update('name', e.target.value)} /></label>
      <label>Description<textarea rows="5" value={value('description')} onChange={e => update('description', e.target.value)} placeholder="Ingredients and preparation…" /></label>
      <label>Price (include $)<input value={value('price')} onChange={e => update('price', e.target.value)} placeholder="e.g. $9.99" /></label>
      <label>Replacement photo URL (optional)<input value={value('image')} onChange={e => update('image', e.target.value)} placeholder="Leave blank to keep the original picture" /></label>
    </div>
    <p>{Object.keys(drafts).length} dish draft(s) saved in this browser.</p>
    <div className="editor-actions">
      <button type="button" className="editor-export" disabled={!Object.keys(drafts).length} onClick={download}>Download backup</button>
      <label className="editor-import">Import backup<input type="file" accept=".json,application/json" onChange={importFile} /></label>
      <button type="button" className="editor-clear" disabled={!Object.keys(drafts).length} onClick={clearDrafts}>Clear local drafts</button>
    </div>
    {message && <p role="status">{message}</p>}
  </main>;
}
