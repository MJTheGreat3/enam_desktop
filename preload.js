const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // You can add custom APIs here if needed later
});
