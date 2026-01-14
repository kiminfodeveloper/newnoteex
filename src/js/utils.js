export const Utils = {
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    formatDate(timestamp) {
        if (!timestamp) return 'Nova nota';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 24 * 60 * 60 * 1000) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('pt-BR');
    },

    getCategoryIcon(category) {
        const icons = {
            trabalho: "🏢",
            pessoal: "👤",
            estudos: "📚",
            ideias: "💡",
            tarefas: "✅",
            email: "📧",
            call: "📞",
            free: "📝"
        };
        return icons[category] || "📝";
    },

    getCategoryName(category) {
        const names = {
            trabalho: "Trabalho",
            pessoal: "Pessoal",
            estudos: "Estudos",
            ideias: "Ideias",
            tarefas: "Tarefas",
            email: "E-mail",
            call: "Ligação",
            free: "Nota Livre"
        };
        return names[category] || "Sem categoria";
    }
};
