# Ícones da Extensão

Para os ícones da extensão, você precisa criar três arquivos PNG na pasta `icons/`:

-   `icon16.png` (16x16 pixels)
-   `icon48.png` (48x48 pixels)
-   `icon128.png` (128x128 pixels)

## Design Sugerido

Use um ícone de bloco de notas/documento com as seguintes características:

-   Fundo: Gradiente azul (#0d6efd para #4dabf7)
-   Ícone: Documento branco com linhas representando texto
-   Estilo: Moderno, minimalista, bordas arredondadas

## Alternativa Rápida

Você pode usar os ícones SVG abaixo e convertê-los para PNG usando ferramentas online como:

-   https://convertio.co/svg-png/
-   https://cloudconvert.com/svg-to-png

### Ícone SVG Base:

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d6efd"/>
      <stop offset="100%" style="stop-color:#4dabf7"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="128" height="128" rx="24" fill="url(#bg)"/>

  <!-- Document -->
  <rect x="24" y="20" width="80" height="88" rx="8" fill="white"/>

  <!-- Lines representing text -->
  <rect x="36" y="36" width="56" height="3" rx="1.5" fill="#6c757d"/>
  <rect x="36" y="46" width="48" height="3" rx="1.5" fill="#6c757d"/>
  <rect x="36" y="56" width="52" height="3" rx="1.5" fill="#6c757d"/>
  <rect x="36" y="66" width="44" height="3" rx="1.5" fill="#6c757d"/>
  <rect x="36" y="76" width="50" height="3" rx="1.5" fill="#6c757d"/>
  <rect x="36" y="86" width="40" height="3" rx="1.5" fill="#6c757d"/>
</svg>
```

Para criar os diferentes tamanhos:

1. 128x128: Use o SVG acima
2. 48x48: Reduza as dimensões proporcionalmente
3. 16x16: Use um design mais simples (apenas o documento sem as linhas internas)

## Ferramenta Online Recomendada

Use o site https://favicon.io/favicon-generator/ para gerar todos os tamanhos automaticamente a partir de texto ou emoji 📝.
