(function() {
  const DATA_KEY = 'alphabag_data';
  const DB_NAME = 'AlphaBagImages';
  const DB_VERSION = 1;
  const STORE_NAME = 'images';
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains(STORE_NAME)) { db.createObjectStore(STORE_NAME, { keyPath: 'fileName' }); } };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  window.electronAPI = {
    loadData: async function() { try { const raw = localStorage.getItem(DATA_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } },
    saveData: async function(data) { try { localStorage.setItem(DATA_KEY, JSON.stringify(data)); } catch (e) {} },
    saveImage: async function({ id, base64Data, mimeType }) { try { const db = await openDB(); const ext = mimeType.split('/')[1] || 'png'; const fileName = id + '.' + ext; return new Promise((resolve, reject) => { const tx = db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).put({ fileName, base64Data, mimeType }); tx.oncomplete = () => resolve({ success: true, fileName }); tx.onerror = () => reject(tx.error); }); } catch (e) { return { success: false }; } },
    loadImage: async function({ fileName }) { try { const db = await openDB(); return new Promise((resolve) => { const tx = db.transaction(STORE_NAME, 'readonly'); const req = tx.objectStore(STORE_NAME).get(fileName); req.onsuccess = () => { if (req.result) { resolve({ success: true, base64Data: req.result.base64Data, mimeType: req.result.mimeType }); } else { resolve({ success: false }); } }; req.onerror = () => resolve({ success: false }); }); } catch (e) { return { success: false }; } },
    deleteImage: async function({ fileName }) { try { const db = await openDB(); return new Promise((resolve) => { const tx = db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).delete(fileName); tx.oncomplete = () => resolve({ success: true }); tx.onerror = () => resolve({ success: false }); }); } catch (e) { return { success: false }; } },
    pickImage: async function() { return new Promise((resolve) => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = () => { const file = input.files[0]; if (!file) { resolve(null); return; } const reader = new FileReader(); reader.onload = () => { resolve({ base64Data: reader.result.split(',')[1], mimeType: file.type }); }; reader.readAsDataURL(file); }; input.click(); }); },
    pickFile: async function() { return new Promise((resolve) => { const input = document.createElement('input'); input.type = 'file'; input.onchange = () => { const file = input.files[0]; if (!file) { resolve(null); return; } resolve({ name: file.name, size: file.size, path: URL.createObjectURL(file) }); }; input.click(); }); },
    exportData: async function(data) { const json = JSON.stringify(data, null, 2); const blob = new Blob([json], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'alphabag-backup-' + new Date().toISOString().slice(0,10) + '.json'; a.click(); URL.revokeObjectURL(url); },
    importData: async function() { return new Promise((resolve) => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'; input.onchange = () => { const file = input.files[0]; if (!file) { resolve(null); return; } const reader = new FileReader(); reader.onload = () => { try { resolve(JSON.parse(reader.result)); } catch (e) { resolve(null); } }; reader.readAsText(file); }; input.click(); }); },
  };
})();
