# 🚀 Instalação - Notey Pro Premium

## ⚡ Guia de Instalação Rápida

A nova estrutura do **Notey Pro** é mais organizada e moderna. Siga os passos abaixo para instalar em menos de 1 minuto:

1. **Abra o Chrome** e acesse: `chrome://extensions/`
2. **Ative** o "Modo do desenvolvedor" (canto superior direito).
3. **Clique** no botão "Carregar sem compactação".
4. **Selecione a pasta raiz** do projeto (onde está o arquivo `manifest.json`).

---

## 🏗️ Estrutura de Arquivos

A nova estrutura modular facilita a manutenção e garante melhor performance:

```text
/
├── src/
│   ├── assets/icons/   # Ícones oficiais
│   ├── css/            # Estilos Premium
│   ├── js/             # Lógica Modular
│   ├── popup.html      # Interface principal
│   └── standalone.html # Versão Desktop
├── manifest.json       # Configuração V3
└── README.md           # Documentação completa
```

## 🆕 Formas de Uso

### 📱 **Modo Popup**
Clique no ícone da extensão na barra de ferramentas do Chrome. Ideal para notas rápidas e lembretes enquanto navega.

### 🖥️ **Modo Dashboard**
Abra o arquivo `src/standalone.html` em uma nova aba ou clique no botão de dashboard (disponível em versões futuras ou via URL da extensão). Oferece mais espaço e visualização em grade.

---

## 🔧 Solução de Problemas

### ❌ Extensão não carrega?
- Verifique se você selecionou a pasta **raiz** (que contém o `manifest.json`), não a pasta `src`.
- Clique no ícone de **Recarregar** 🔄 na página de extensões após fazer alterações no código.

### ❌ Ícones sumiram?
- Certifique-se de que a pasta `src/assets/icons` contém os arquivos `.svg`.

### ❌ Erro de JavaScript?
- A extensão usa Módulos ES6. Certifique-se de estar usando uma versão recente do Google Chrome (v80+).

---
*Dúvidas? Consulte o README.md principal.*
