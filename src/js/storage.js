export const Storage = {
    async get(key) {
        return new Promise((resolve) => {
            chrome.storage.sync.get(key, (result) => {
                resolve(result[key]);
            });
        });
    },

    async getAll() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(null, (result) => {
                resolve(result);
            });
        });
    },

    async set(data) {
        return new Promise((resolve) => {
            chrome.storage.sync.set(data, () => {
                resolve();
            });
        });
    },

    async saveNotes(notes) {
        return this.set({ notes });
    },

    async saveTheme(theme) {
        return this.set({ theme });
    }
};
