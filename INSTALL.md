# 🚀 Instalação Rápida - Bloco de Notas Pro

## ⚡ Instalação em 5 Minutos

### Método 1: Com Ícones SVG (Recomendado - Mais Rápido)

1. **Crie uma pasta** chamada `bloco-notas-pro`

2. **Salve estes 9 arquivos** na pasta:

    ```
    bloco-notas-pro/
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── styles.css
    ├── standalone.html    ← NOVO: Janela independente
    └── icons/
        ├── icon16.svg
        ├── icon48.svg
        └── icon128.svg
    ```

3. **Abra o Chrome** e digite: `chrome://extensions/`

4. **Ative** o botão "Modo do desenvolvedor" (canto superior direito)

5. **Clique** em "Carregar sem compactação"

6. **Selecione** a pasta `bloco-notas-pro`

7. **Pronto! ✅** A extensão estará instalada e funcionando

## 🆕 Nova Funcionalidade: Janela Independente

Agora você pode usar a extensão de duas formas:

### 📱 **Modo Popup** (Padrão)

-   Clique no ícone da extensão
-   Use `Ctrl+Shift+N`
-   Tamanho: 420x600px

### 🗔 **Modo Janela Independente**

-   Clique no botão **🗗** no popup
-   Abre em uma nova aba do Chrome
-   Tamanho: Tela cheia, redimensionável
-   **Ideal para uso prolongado!**

## ✨ Vantagens da Janela Independente

✅ **Mais espaço** para visualizar notas  
✅ **Sempre visível** (não fecha acidentalmente)  
✅ **Melhor para trabalho** (pode ficar ao lado de outras janelas)  
✅ **Arrastar e redimensionar** como qualquer janela  
✅ **Experiência mais desktop** ao invés de popup

### Método 2: Se os SVGs não funcionarem

Caso o Chrome não aceite ícones SVG, você pode:

1. **Usar qualquer imagem PNG** de 16x16, 48x48 e 128x128 pixels
2. **Renomear** para `icon16.png`, `icon48.png`, `icon128.png`
3. **Salvar** na pasta `icons/`
4. **Atualizar** o manifest.json:

```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

### Método 3: Ícones Temporários Online

Se precisar de ícones PNG rapidamente:

1. Acesse: https://favicon.io/emoji-favicons/memo/
2. Baixe o pacote de ícones
3. Renomeie para `icon16.png`, `icon48.png`, `icon128.png`
4. Coloque na pasta `icons/`

## 🔧 Solução de Problemas Comuns

### ❌ "Could not load icon"

**Solução**: Use ícones PNG ao invés de SVG:

1. Crie qualquer imagem 16x16 pixels (pode ser um quadrado colorido)
2. Salve como `icon16.png`
3. Repita para 48x48 e 128x128

### ❌ "Could not load manifest"

**Soluções**:

1. Verifique se todos os arquivos estão na pasta correta
2. Certifique-se que o `manifest.json` está na raiz da pasta
3. Veja se não há caracteres especiais nos nomes dos arquivos

### ❌ Extensão não aparece

**Soluções**:

1. Recarregue a página `chrome://extensions/`
2. Clique no botão de "Recarregar" da extensão
3. Verifique se o "Modo do desenvolvedor" está ativo

## ⚡ Teste Rápido

Após instalar:

1. **Pressione** `Ctrl+Shift+N` (ou `Cmd+Shift+N` no Mac)
2. **Ou clique** no ícone da extensão na barra do Chrome
3. **Crie** sua primeira nota clicando em "Nova Nota"

## 📱 Estrutura Mínima dos Arquivos

Se algo der errado, certifique-se que tem esta estrutura:

```
bloco-notas-pro/
├── manifest.json          ← Arquivo principal de configuração
├── popup.html             ← Interface da extensão
├── popup.js               ← Lógica da aplicação
├── styles.css             ← Estilos e temas
└── icons/                 ← Pasta de ícones
    ├── icon16.png (ou .svg)
    ├── icon48.png (ou .svg)
    └── icon128.png (ou .svg)
```

## 🆘 Ainda com Problemas?

1. **Abra** as Ferramentas do Desenvolvedor (`F12`)
2. **Vá** na aba "Console"
3. **Procure** por mensagens de erro em vermelho
4. **Compare** seus arquivos com os originais fornecidos

## ✅ Confirmação de Funcionamento

Se tudo funcionou corretamente, você deve conseguir:

-   ✅ Ver o ícone da extensão na barra do Chrome
-   ✅ Abrir o popup clicando no ícone
-   ✅ Usar o atalho `Ctrl+Shift+N`
-   ✅ Criar e salvar uma nota
-   ✅ Alternar entre os temas

---

**💡 Dica**: A extensão funciona 100% offline após instalada e salva automaticamente suas notas na nuvem do Google!
