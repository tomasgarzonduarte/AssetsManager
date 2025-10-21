class AssetDB {
    constructor() {
      this.dbName = 'AssetsManagerDB';
      this.dbVersion = 1;
      this.db = null;
    }
  
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
  
        request.onerror = (event) => {
          console.error('Database error:', event.target.error);
          reject(event.target.error);
        };
  
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('assets')) {
            const store = db.createObjectStore('assets', { keyPath: 'id', autoIncrement: true });
            store.createIndex('title', 'title', { unique: false });
            store.createIndex('status', 'status', { unique: false });
          }
        };
      });
    }
  
    async addAsset(asset) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        const request = store.add(asset);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
      });
    }
  
    async getAsset(id) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['assets'], 'readonly');
        const store = transaction.objectStore('assets');
        const request = store.get(id);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
      });
    }
  
    async getAllAssets() {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['assets'], 'readonly');
        const store = transaction.objectStore('assets');
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
      });
    }
  
    async updateAsset(id, updates) {
      return new Promise(async (resolve, reject) => {
        const transaction = this.db.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        const getRequest = store.get(id);
  
        getRequest.onsuccess = () => {
          const asset = getRequest.result;
          if (!asset) {
            reject(new Error('Asset not found'));
            return;
          }
  
          const updatedAsset = { ...asset, ...updates };
          const putRequest = store.put(updatedAsset);
  
          putRequest.onsuccess = () => resolve(updatedAsset);
          putRequest.onerror = (event) => reject(event.target.error);
        };
  
        getRequest.onerror = (event) => reject(event.target.error);
      });
    }
  
    async deleteAsset(id) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        const request = store.delete(id);
  
        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
      });
    }
  }
  
  // Initialize and export a singleton instance
  const assetDB = new AssetDB();
  export default assetDB;