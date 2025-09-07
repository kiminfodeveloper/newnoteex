class NotesApp {
    constructor() {
        this.notes = [];
        this.currentNoteId = null;
        this.currentTheme = "light";
        this.searchTerm = "";
        this.selectedCategory = "";

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderNotes();
        this.updateEmptyState();
    }

    async loadData() {
        try {
            const result = await chrome.storage.sync.get(["notes", "theme"]);
            this.notes = result.notes || [];
            this.currentTheme = result.theme || "light";

            // Apply theme
            document.getElementById(
                "app"
            ).className = `theme-${this.currentTheme}`;
            document.getElementById("themeSelector").value = this.currentTheme;
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }

    async saveData() {
        try {
            await chrome.storage.sync.set({
                notes: this.notes,
                theme: this.currentTheme,
            });
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    }

    setupEventListeners() {
        // Theme selector
        document
            .getElementById("themeSelector")
            .addEventListener("change", (e) => {
                this.changeTheme(e.target.value);
            });

        // Search
        document
            .getElementById("searchInput")
            .addEventListener("input", (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderNotes();
            });

        document.getElementById("clearSearch").addEventListener("click", () => {
            document.getElementById("searchInput").value = "";
            this.searchTerm = "";
            this.renderNotes();
        });

        // Category filter
        document
            .getElementById("categoryFilter")
            .addEventListener("change", (e) => {
                this.selectedCategory = e.target.value;
                this.renderNotes();
            });

        // Add note button
        document.getElementById("addNoteBtn").addEventListener("click", () => {
            this.openNoteModal();
        });

        // Modal controls
        document.getElementById("closeModal").addEventListener("click", () => {
            this.closeNoteModal();
        });

        document.getElementById("saveNoteBtn").addEventListener("click", () => {
            this.saveNote();
        });

        document
            .getElementById("deleteNoteBtn")
            .addEventListener("click", () => {
                this.deleteNote();
            });

        document.getElementById("pinNoteBtn").addEventListener("click", () => {
            this.togglePinNote();
        });

        // Note content character counter
        document
            .getElementById("noteContent")
            .addEventListener("input", (e) => {
                const charCount = e.target.value.length;
                document.getElementById(
                    "charCount"
                ).textContent = `${charCount} caracteres`;
            });

        // Import/Export
        document.getElementById("exportBtn").addEventListener("click", () => {
            this.exportNotes();
        });

        document.getElementById("importBtn").addEventListener("click", () => {
            document.getElementById("importFile").click();
        });

        document
            .getElementById("importFile")
            .addEventListener("change", (e) => {
                this.importNotes(e.target.files[0]);
            });

        // Modal click outside to close
        document.getElementById("noteModal").addEventListener("click", (e) => {
            if (e.target === document.getElementById("noteModal")) {
                this.closeNoteModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (
                    e.key === "s" &&
                    document.getElementById("noteModal").style.display !==
                        "none"
                ) {
                    e.preventDefault();
                    this.saveNote();
                }
            }
            if (
                e.key === "Escape" &&
                document.getElementById("noteModal").style.display !== "none"
            ) {
                this.closeNoteModal();
            }
        });
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        document.getElementById("app").className = `theme-${theme}`;
        this.saveData();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return (
            date.toLocaleDateString("pt-BR") +
            " às " +
            date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    }

    getCategoryIcon(category) {
        const icons = {
            trabalho: "🏢",
            pessoal: "👤",
            estudos: "📚",
            ideias: "💡",
            tarefas: "✅",
        };
        return icons[category] || "📝";
    }

    getCategoryName(category) {
        const names = {
            trabalho: "Trabalho",
            pessoal: "Pessoal",
            estudos: "Estudos",
            ideias: "Ideias",
            tarefas: "Tarefas",
        };
        return names[category] || "Sem categoria";
    }

    filterNotes() {
        let filteredNotes = [...this.notes];

        // Apply search filter
        if (this.searchTerm) {
            filteredNotes = filteredNotes.filter(
                (note) =>
                    note.title.toLowerCase().includes(this.searchTerm) ||
                    note.content.toLowerCase().includes(this.searchTerm)
            );
        }

        // Apply category filter
        if (this.selectedCategory) {
            filteredNotes = filteredNotes.filter(
                (note) => note.category === this.selectedCategory
            );
        }

        // Sort by pinned first, then by updated date
        filteredNotes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.updatedAt - a.updatedAt;
        });

        return filteredNotes;
    }

    renderNotes() {
        const container = document.getElementById("notesContainer");
        const filteredNotes = this.filterNotes();

        container.innerHTML = "";

        filteredNotes.forEach((note) => {
            const noteElement = this.createNoteElement(note);
            container.appendChild(noteElement);
        });

        this.updateEmptyState();
        this.updateCategoryFilter();
    }

    createNoteElement(note) {
        const noteDiv = document.createElement("div");
        noteDiv.className = `note-item ${note.pinned ? "pinned" : ""}`;
        noteDiv.dataset.noteId = note.id;

        const preview =
            note.content.length > 100
                ? note.content.substring(0, 100) + "..."
                : note.content;

        noteDiv.innerHTML = `
      <div class="note-header">
        <div class="note-title-section">
          ${note.pinned ? '<span class="pin-indicator">📌</span>' : ""}
          <h3 class="note-title">${note.title || "Nota sem título"}</h3>
        </div>
        <div class="note-meta">
          ${
              note.category
                  ? `<span class="note-category">${this.getCategoryIcon(
                        note.category
                    )} ${this.getCategoryName(note.category)}</span>`
                  : ""
          }
        </div>
      </div>
      <div class="note-preview">${preview}</div>
      <div class="note-footer">
        <span class="note-date">${this.formatDate(note.updatedAt)}</span>
        <span class="note-char-count">${note.content.length} chars</span>
      </div>
    `;

        noteDiv.addEventListener("click", () => {
            this.openNoteModal(note.id);
        });

        return noteDiv;
    }

    updateEmptyState() {
        const notesContainer = document.getElementById("notesContainer");
        const emptyState = document.getElementById("emptyState");

        if (notesContainer.children.length === 0) {
            emptyState.style.display = "block";
            if (this.searchTerm || this.selectedCategory) {
                emptyState.innerHTML = `
          <div class="empty-icon">🔍</div>
          <h3>Nenhuma nota encontrada</h3>
          <p>Tente ajustar seus filtros de busca</p>
        `;
            } else {
                emptyState.innerHTML = `
          <div class="empty-icon">📋</div>
          <h3>Nenhuma nota encontrada</h3>
          <p>Crie sua primeira nota clicando em "Nova Nota"</p>
        `;
            }
        } else {
            emptyState.style.display = "none";
        }
    }

    updateCategoryFilter() {
        const categoryFilter = document.getElementById("categoryFilter");
        const currentValue = categoryFilter.value;

        // Get unique categories from notes
        const categories = [
            ...new Set(this.notes.map((note) => note.category).filter(Boolean)),
        ];

        // Clear and repopulate options
        categoryFilter.innerHTML =
            '<option value="">Todas as categorias</option>';
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = `${this.getCategoryIcon(
                category
            )} ${this.getCategoryName(category)}`;
            categoryFilter.appendChild(option);
        });

        // Restore selected value if it still exists
        if (categories.includes(currentValue)) {
            categoryFilter.value = currentValue;
        }
    }

    openNoteModal(noteId = null) {
        this.currentNoteId = noteId;
        const modal = document.getElementById("noteModal");
        const titleInput = document.getElementById("noteTitle");
        const contentTextarea = document.getElementById("noteContent");
        const categorySelect = document.getElementById("noteCategory");
        const dateSpan = document.getElementById("noteDate");
        const charCount = document.getElementById("charCount");
        const pinBtn = document.getElementById("pinNoteBtn");
        const deleteBtn = document.getElementById("deleteNoteBtn");

        if (noteId) {
            const note = this.notes.find((n) => n.id === noteId);
            if (note) {
                titleInput.value = note.title;
                contentTextarea.value = note.content;
                categorySelect.value = note.category || "";
                dateSpan.textContent = `Atualizada: ${this.formatDate(
                    note.updatedAt
                )}`;
                charCount.textContent = `${note.content.length} caracteres`;

                // Update pin button
                pinBtn.innerHTML = note.pinned
                    ? "<span>📌</span>"
                    : "<span>📍</span>";
                pinBtn.title = note.pinned ? "Desafixar nota" : "Fixar nota";
                pinBtn.classList.toggle("active", note.pinned);

                deleteBtn.style.display = "inline-block";
            }
        } else {
            titleInput.value = "";
            contentTextarea.value = "";
            categorySelect.value = "";
            dateSpan.textContent = "Nova nota";
            charCount.textContent = "0 caracteres";
            pinBtn.innerHTML = "<span>📍</span>";
            pinBtn.title = "Fixar nota";
            pinBtn.classList.remove("active");
            deleteBtn.style.display = "none";
        }

        modal.style.display = "flex";
        titleInput.focus();
    }

    closeNoteModal() {
        document.getElementById("noteModal").style.display = "none";
        this.currentNoteId = null;
    }

    saveNote() {
        const title = document.getElementById("noteTitle").value.trim();
        const content = document.getElementById("noteContent").value.trim();
        const category = document.getElementById("noteCategory").value;

        if (!title && !content) {
            alert("Por favor, insira pelo menos um título ou conteúdo.");
            return;
        }

        const now = Date.now();

        if (this.currentNoteId) {
            // Update existing note
            const noteIndex = this.notes.findIndex(
                (n) => n.id === this.currentNoteId
            );
            if (noteIndex !== -1) {
                this.notes[noteIndex] = {
                    ...this.notes[noteIndex],
                    title: title || "Nota sem título",
                    content,
                    category,
                    updatedAt: now,
                };
            }
        } else {
            // Create new note
            const newNote = {
                id: this.generateId(),
                title: title || "Nota sem título",
                content,
                category,
                pinned: false,
                createdAt: now,
                updatedAt: now,
            };
            this.notes.push(newNote);
        }

        this.saveData();
        this.renderNotes();
        this.closeNoteModal();
    }

    deleteNote() {
        if (!this.currentNoteId) return;

        if (confirm("Tem certeza que deseja excluir esta nota?")) {
            this.notes = this.notes.filter((n) => n.id !== this.currentNoteId);
            this.saveData();
            this.renderNotes();
            this.closeNoteModal();
        }
    }

    togglePinNote() {
        if (!this.currentNoteId) return;

        const noteIndex = this.notes.findIndex(
            (n) => n.id === this.currentNoteId
        );
        if (noteIndex !== -1) {
            this.notes[noteIndex].pinned = !this.notes[noteIndex].pinned;
            this.notes[noteIndex].updatedAt = Date.now();

            const pinBtn = document.getElementById("pinNoteBtn");
            const isPinned = this.notes[noteIndex].pinned;
            pinBtn.innerHTML = isPinned ? "<span>📌</span>" : "<span>📍</span>";
            pinBtn.title = isPinned ? "Desafixar nota" : "Fixar nota";
            pinBtn.classList.toggle("active", isPinned);

            this.saveData();
            // Don't re-render here to avoid closing modal
        }
    }

    exportNotes() {
        const dataStr = JSON.stringify(this.notes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `notas-backup-${
            new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    async importNotes(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (Array.isArray(importedData)) {
                    const validNotes = importedData.filter(
                        (note) =>
                            note.id &&
                            typeof note.title === "string" &&
                            typeof note.content === "string"
                    );

                    if (validNotes.length > 0) {
                        // Merge with existing notes, avoiding duplicates
                        const existingIds = new Set(
                            this.notes.map((n) => n.id)
                        );
                        const newNotes = validNotes.filter(
                            (note) => !existingIds.has(note.id)
                        );

                        this.notes = [...this.notes, ...newNotes];
                        await this.saveData();
                        this.renderNotes();

                        alert(
                            `${newNotes.length} notas importadas com sucesso!`
                        );
                    } else {
                        alert("Arquivo não contém notas válidas.");
                    }
                } else {
                    alert("Formato de arquivo inválido.");
                }
            } catch (error) {
                alert(
                    "Erro ao ler arquivo. Verifique se é um arquivo JSON válido."
                );
                console.error("Erro na importação:", error);
            }
        };

        reader.readAsText(file);

        // Clear file input
        document.getElementById("importFile").value = "";
    }

    openInNewWindow() {
        // Open standalone.html in a new tab
        const url = chrome.runtime.getURL("standalone.html");
        chrome.tabs.create(
            {
                url: url,
                active: true,
            },
            () => {
                // Close the popup after opening the new tab
                window.close();
            }
        );
    }
}

// Initialize the app when the popup loads
document.addEventListener("DOMContentLoaded", () => {
    new NotesApp();
});
