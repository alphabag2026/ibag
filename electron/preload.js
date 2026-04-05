const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  loadData: () => ipcRenderer.invoke('load-data'),
  togglePin: () => ipcRenderer.invoke('toggle-pin'),
  getPinState: () => ipcRenderer.invoke('get-pin-state'),
  toggleMiniMode: () => ipcRenderer.invoke('toggle-mini-mode'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  saveImage: (id, base64Data, mimeType) => ipcRenderer.invoke('save-image', id, base64Data, mimeType),
  loadImage: (id) => ipcRenderer.invoke('load-image', id),
  getMiniMode: () => ipcRenderer.invoke('get-mini-mode'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  onPinStateChanged: (callback) => ipcRenderer.on('pin-state-changed', (_, state) => callback(state)),
  onMiniModeChanged: (callback) => ipcRenderer.on('mini-mode-changed', (_, state) => callback(state)),
});
