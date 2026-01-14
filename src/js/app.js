import { Storage } from './storage.js';
import { Utils } from './utils.js';

class NotesApp {
    constructor() {
        this.notes = [];
        this.currentNoteId = null;
        this.searchTerm = "";
        this.selectedCategory = "";
        this.currentTheme = "light";

        this.init();
    }

    async init() {
        // Elements
        this.appEl = document.getElementById("app");
        this.notesContainer = document.getElementById("notesContainer");
        this.noteModal = document.getElementById("noteModal");
        
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

    async loadData() {
        this.notes = await Storage.get("notes") || [];
        this.currentTheme = await Storage.get("theme") || "light";
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        this.appEl.className = `theme-${theme}`;
        document.getElementById("themeSelector").value = theme;
        Storage.saveTheme(theme);
    }

    setupEventListeners() {
        // Theme
        document.getElementById("themeSelector").addEventListener("change", (e) => this.applyTheme(e.target.value));

        // Search
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.render();
        });

        document.getElementById("clearSearch").addEventListener("click", () => {
            searchInput.value = "";
            this.searchTerm = "";
            this.render();
        });

        // Add
        document.getElementById("addNoteBtn").addEventListener("click", () => this.openModal());

        // Modal
        document.getElementById("closeModal").addEventListener("click", () => this.closeModal());
        document.getElementById("saveNoteBtn").addEventListener("click", () => this.saveNote());
        document.getElementById("deleteNoteBtn").addEventListener("click", () => this.deleteNote());
        document.getElementById("copyNoteBtn").addEventListener("click", () => this.copyNote());
        document.getElementById("pinNoteBtn").addEventListener("click", () => this.togglePin());
        
        // Category filters
        document.getElementById("categoryFilter").addEventListener("change", (e) => {
            this.selectedCategory = e.target.value;
            this.render();
        });

        // Export/Import
        document.getElementById("exportBtn").addEventListener("click", () => this.exportNotes());
        document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
        document.getElementById("importFile").addEventListener("change", (e) => this.importNotes(e.target.files[0]));

        // Outside click
        this.noteModal.addEventListener("click", (e) => {
            if (e.target === this.noteModal) this.closeModal();
        });
    }

    applyCategoryTemplate(category) {
        const contentArea = document.getElementById("noteContent");
        if (contentArea.value.trim() !== "") return; // Don't overwrite existing text

        if (category === "call") {
            contentArea.value = `Contrato: \nEmpresa: \nInterlocutor: \nMotivo: \nData: ${new Date().toLocaleDateString()}\nResolução: \nProtocolo: `;
        } else if (category === "email") {
            contentArea.value = `Contrato: \nEmpresa: \nInterlocutor: \nMotivo: \nData: ${new Date().toLocaleDateString()}\nProtocolo OMNI: \nProtocolo FVS: `;
        }
    }

    render() {
        this.renderNotes();
        this.updateStats();
    }

    renderNotes() {
        let filtered = this.notes.filter(note => 
            (note.title.toLowerCase().includes(this.searchTerm) || 
             note.content.toLowerCase().includes(this.searchTerm)) &&
            (this.selectedCategory === "" || note.category === this.selectedCategory)
        );

        // Sort: Pinned first, then latest updated
        filtered.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.updatedAt - a.updatedAt;
        });

        this.notesContainer.innerHTML = "";
        
        if (filtered.length === 0) {
            this.notesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>Nenhuma nota encontrada</p>
                </div>
            `;
            return;
        }

        filtered.forEach(note => {
            const el = document.createElement("div");
            el.className = `note-item ${note.pinned ? 'pinned' : ''}`;
            el.innerHTML = `
                <div class="note-header">
                    <span class="note-title">${note.title || "Sem título"}</span>
                    ${note.pinned ? '<span class="pin-icon">📌</span>' : ''}
                </div>
                <div class="note-preview">${note.content || "Vazia..."}</div>
                <div class="note-footer">
                    <span class="category-tag">${Utils.getCategoryIcon(note.category)} ${Utils.getCategoryName(note.category)}</span>
                    <span class="date-tag">${Utils.formatDate(note.updatedAt)}</span>
                </div>
            `;
            el.addEventListener("click", () => this.openModal(note.id));
            this.notesContainer.appendChild(el);
        });
    }

    openModal(id = null) {
        this.currentNoteId = id;
        const note = id ? this.notes.find(n => n.id === id) : { title: "", content: "", category: "free", pinned: false };
        
        document.getElementById("noteTitle").value = note.title;
        document.getElementById("noteContent").value = note.content;
        document.getElementById("noteCategory").value = note.category || "free";
        document.getElementById("deleteNoteBtn").style.display = id ? "block" : "none";
        
        const pinBtn = document.getElementById("pinNoteBtn");
        pinBtn.textContent = note.pinned ? "📌" : "📍";
        pinBtn.classList.toggle("active", note.pinned);
        
        this.noteModal.style.display = "flex";
        document.getElementById("noteTitle").focus();
    }

    closeModal() {
        this.noteModal.style.display = "none";
    }

    async saveNote() {
        const title = document.getElementById("noteTitle").value.trim();
        const content = document.getElementById("noteContent").value.trim();
        const category = document.getElementById("noteCategory").value;

        if (!title && !content) return this.closeModal();

        const now = Date.now();
        
        if (this.currentNoteId) {
            const index = this.notes.findIndex(n => n.id === this.currentNoteId);
            this.notes[index] = { ...this.notes[index], title, content, category, updatedAt: now };
        } else {
            this.notes.push({
                id: Utils.generateId(),
                title,
                content,
                category,
                pinned: false,
                createdAt: now,
                updatedAt: now
            });
        }

        await Storage.saveNotes(this.notes);
        this.render();
        this.closeModal();
    }

    async deleteNote() {
        if (!confirm("Excluir esta nota?")) return;
        this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
        await Storage.saveNotes(this.notes);
        this.render();
        this.closeModal();
    }

    async copyNote() {
        const content = document.getElementById("noteContent").value;
        try {
            await navigator.clipboard.writeText(content);
            const copyBtn = document.getElementById("copyNoteBtn");
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copiado!";
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        } catch (err) {
            alert("Erro ao copiar.");
        }
    }

    async togglePin() {
        if (!this.currentNoteId) return;
        const index = this.notes.findIndex(n => n.id === this.currentNoteId);
        if (index === -1) return;
        
        this.notes[index].pinned = !this.notes[index].pinned;
        this.notes[index].updatedAt = Date.now();
        
        const pinBtn = document.getElementById("pinNoteBtn");
        pinBtn.textContent = this.notes[index].pinned ? "📌" : "📍";
        pinBtn.classList.toggle("active", this.notes[index].pinned);
        
        await Storage.saveNotes(this.notes);
        this.render();
    }

    updateStats() {
        // Optional: Add logic to show total notes etc.
    }

    exportNotes() {
        const blob = new Blob([JSON.stringify(this.notes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bloco-notas-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }

    async importNotes(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.notes = [...this.notes, ...imported.filter(n => !this.notes.find(en => en.id === n.id))];
                    await Storage.saveNotes(this.notes);
                    this.render();
                    alert("Notas importadas!");
                }
            } catch (err) {
                alert("Erro ao importar.");
            }
        };
        reader.readAsText(file);
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    new NotesApp();
});
