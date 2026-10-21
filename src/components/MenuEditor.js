import React, { useEffect, useState } from 'react';
import './MenuEditor.css';

const STORAGE_KEY = 'juans-menu-editor-drafts-v2';
const OLD_KEY = 'juans-menu-editor-drafts-v1';
const FIELDS = ['name', 'description', 'price', 'image'];
const readSaved = () => {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (current && typeof current === 'object' && !Array.isArray(current))
      return { edits: current.edits || {}, additions: current.additions || [], groups: current.groups || [] };
    const old = JSON.parse(localStorage.getItem(OLD_KEY) || '{}');
    return { edits: old && typeof old === 'object' && !Array.isArray(old) ? old : {}, additions: [], groups: [] };
  } catch { return { edits: {}, additions: [], groups: [] }; }
};
const freshId = () => 'new-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
const safeRecord = record => {
  const cleaned = {};
  for (const field of FIELDS) {
    if (record[field] !== undefined) {
      if (typeof record[field] !== 'string' || record[field].length > 10000) throw new Error('Invalid ' + field);
      cleaned[field] = record[field];
    }
  }
  return cleaned;
};

/** Draft-only prototype. No login, server database, or public menu publishing. */
export default function MenuEditor({ categories, onExit }) {
  const [data, setData] = useState(readSaved);
  const [categoryName, setCategoryName] = useState(categories[0].name);
  const [dishId, setDishId] = useState('original:0');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const allCategories = [...categories.map(c => c.name), ...data.groups];
  const original = categories.find(c => c.name === categoryName);
  const originalItems = original ? original.items.map((item, index) => ({
    id: 'original:' + index, name: item.name, description: item.description || '',
    price: item.price || '', image: item.image || ''
  })) : [];
  const addedItems = data.additions.filter(item => item.category === categoryName);
  const dishes = [...originalItems, ...addedItems];
  const selected = dishes.find(item => item.id === dishId) || dishes[0];
  const selectedKey = selected?.id.startsWith('original:')
    ? categoryName + ':' + selected.id.slice(9) : selected?.id;
  const draft = selectedKey ? data.edits[selectedKey] || {} : {};
  const value = field => draft[field] ?? (field === 'image' && selected?.image?.startsWith('data:') ? '' : selected?.[field] || '');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch { setMessage('Browser storage is unavailable. Download a backup to keep your drafts.'); }
  }, [data]);

  const update = (field, next) => {
    if (!selectedKey) return;
    setData(previous => ({ ...previous, edits: {
      ...previous.edits, [selectedKey]: { ...(previous.edits[selectedKey] || {}), [field]: next }
    } }));
    setMessage('');
  };
  const switchCategory = next => { setCategoryName(next); setDishId(''); setMessage(''); };
  const addCategory = event => {
    event.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    if (name.length > 80 || allCategories.some(c => c.toLowerCase() === name.toLowerCase())) {
      setMessage('Please choose a unique category name under 80 characters.'); return;
    }
    setData(previous => ({ ...previous, groups: [...previous.groups, name] }));
    setCategoryName(name);
    setDishId('');
    setNewCategoryName('');
    setMessage('New category added to your local drafts.');
  };
  const addDish = () => {
    const id = freshId();
    setData(previous => ({ ...previous, additions: [...previous.additions,
      { id, category: categoryName, name: 'New menu item', description: '', price: '', image: '' }] }));
    setDishId(id);
    setMessage('New dish added. Fill in the details below.');
  };
  const deleteDish = () => {
    if (!selected?.id.startsWith('new-') || !window.confirm('Delete this new draft dish?')) return;
    const id = selected.id;
    setData(previous => {
      const edits = { ...previous.edits }; delete edits[id];
      return { ...previous, edits, additions: previous.additions.filter(item => item.id !== id) };
    });
    setDishId('');
    setMessage('New draft dish deleted.');
  };
  const download = () => {
    const blob = new Blob([JSON.stringify({ version: 2, ...data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url;
    link.download = 'juans-menu-drafts.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Backup downloaded. Keep it somewhere safe.');
  };
  const importFile = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('Choose a backup smaller than 1 MB.');
      const parsed = JSON.parse(await file.text());
      let imported;
      if (Array.isArray(parsed)) {
        const edits = {};
        for (const record of parsed) {
          if (!record || typeof record.id !== 'string') throw new Error('Invalid old backup.');
          edits[record.id] = safeRecord(record);
        }
        imported = { edits, additions: [], groups: [] };
      } else if (parsed?.version === 2 && parsed.edits && Array.isArray(parsed.additions) && Array.isArray(parsed.groups)) {
        if (parsed.additions.length > 500 || parsed.groups.length > 100 || Object.keys(parsed.edits).length > 1000)
          throw new Error('Backup has too many entries.');
        const groups = parsed.groups.map(name => {
          if (typeof name !== 'string' || !name.trim() || name.length > 80) throw new Error('Invalid category.');
          return name;
        });
        const validCategories = [...categories.map(c => c.name), ...groups];
        const additions = parsed.additions.map(item => {
          if (!item || typeof item.id !== 'string' || !/^new-[a-z0-9-]+$/.test(item.id) ||
            !validCategories.includes(item.category)) throw new Error('Invalid new dish.');
          return { id: item.id, category: item.category, ...safeRecord(item) };
        });
        const edits = {};
        for (const [id, record] of Object.entries(parsed.edits)) {
          if (!/^[^:]+:\d+$/.test(id) && !/^new-[a-z0-9-]+$/.test(id)) throw new Error('Invalid dish ID.');
          edits[id] = safeRecord(record);
        }
        imported = { edits, additions, groups };
      } else throw new Error('Unrecognized menu backup.');
      if (!window.confirm('Replace your current local drafts with the imported backup?')) return;
      setData(imported); setCategoryName(categories[0].name); setDishId('');
      setMessage('Backup restored on this device. Nothing was published.');
    } catch (error) { setMessage(error.message || 'Unable to import backup.'); }
    finally { event.target.value = ''; }
  };
  const clearDrafts = () => {
    if (!window.confirm('Delete all local menu drafts, including new categories and dishes? Download a backup first.')) return;
    setData({ edits: {}, additions: [], groups: [] });
    setCategoryName(categories[0].name); setDishId('');
    setMessage('Local drafts cleared.');
  };
  const count = Object.keys(data.edits).length + data.additions.length + data.groups.length;
  return <main className="menu-editor">
    <button type="button" className="food-back" onClick={onExit}>← Back to website</button>
    <h1>Menu Editor Preview</h1>
    <p className="editor-warning"><strong>Draft mode only — not private.</strong> Changes are saved only in this browser, not published to the restaurant menu. Clearing browser data can erase them; download backups. Do not enter private information.</p>
    <form className="editor-new-category" onSubmit={addCategory}>
      <label>Make a new menu category
        <input value={newCategoryName} maxLength={80} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g. Mixed Drinks, Daily Specials" />
      </label>
      <button className="editor-export" type="submit" disabled={!newCategoryName.trim()}>+ Add Category</button>
    </form>
    <div className="editor-controls">
      <label>Category
        <select value={categoryName} onChange={e => switchCategory(e.target.value)}>
          {allCategories.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>
      <label>Dish
        <select value={selected?.id || ''} onChange={e => { setDishId(e.target.value); setMessage(''); }}>
          {!dishes.length && <option value="">No dishes yet</option>}
          {dishes.map(item => <option key={item.id} value={item.id}>{data.edits[item.id.startsWith('original:') ? categoryName + ':' + item.id.slice(9) : item.id]?.name || item.name}</option>)}
        </select>
      </label>
    </div>
    <div className="editor-actions">
      <button className="editor-export" type="button" onClick={addDish}>+ Add New Dish to {categoryName}</button>
      {selected?.id.startsWith('new-') && <button className="editor-clear" type="button" onClick={deleteDish}>Delete this draft dish</button>}
    </div>
    {selected ? <div className="editor-fields">
      <label>Dish name<input value={value('name')} onChange={e => update('name', e.target.value)} /></label>
      <label>Description<textarea rows="5" value={value('description')} onChange={e => update('description', e.target.value)} placeholder="Ingredients and preparation…" /></label>
      <label>Price (include $)<input value={value('price')} onChange={e => update('price', e.target.value)} placeholder="e.g. $9.99" /></label>
      <label>Replacement photo URL (optional)<input value={value('image')} onChange={e => update('image', e.target.value)} placeholder="Paste a photo URL, or leave blank for original" /></label>
    </div> : <p>This category is empty. Use “Add New Dish” to create its first item.</p>}
    <p>{count} saved draft change(s), including new dishes and categories.</p>
    <div className="editor-actions">
      <button type="button" className="editor-export" disabled={!count} onClick={download}>Download backup</button>
      <label className="editor-import">Import backup<input type="file" accept=".json,application/json" onChange={importFile} /></label>
      <button type="button" className="editor-clear" disabled={!count} onClick={clearDrafts}>Clear local drafts</button>
    </div>
    {message && <p role="status">{message}</p>}
  </main>;
}
