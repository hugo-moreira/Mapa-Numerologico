# Mapa Numerológico Pitagórico

Sistema profissional para cálculo e interpretação do Mapa Numerológico Pitagórico, desenvolvido como Progressive Web App (PWA) com Vue.js. Implementa as 33 técnicas do curso de formação em Numerologia.

## Funcionalidades

- Calculo completo das 33 tecnicas numerologicas pitagoricas
- Piramide numerologica visual com texto corrido
- Geracao de relatorio em PDF profissional (3 paginas A4)
- Previsao anual com Ano Pessoal e 4 Ciclos Trimestrais
- Sinastria e Simbiose entre dois mapas
- Historico de clientes no navegador (sem servidor)
- Funciona offline apos o primeiro acesso (PWA)
- Instalavel como app nativo em celular e desktop

## Tecnicas Implementadas

| Grupo | Tecnicas |
|-------|----------|
| Mapa Natal | MO, EU, EX, CD, Merito, Tributo, Ciclos, Desafios, Realizacoes |
| Analises | Piramide, Figuras Familiares, Duplicidades, Ausencias, AVP, Expressao |
| Potenciais | Razao/Emocao, Como Reagem, Riscos CP/VG/SC, Pureza PA/PPI/PPC |
| Vida | Conquista/Realizacao Espontanea, Bloqueio, Renascimento, Legado, Quintessencia |
| Pessoal | Pratica Afetiva, Fertilidade, Intensidade Sexual |
| Especiais | Enfermidades, Oposicoes Fortes |
| Previsoes | AP + 4 CTs, Eventos Favoraveis |
| Relacoes | Sinastria, Simbiose |
| Ferramentas | Pedagio Cosmico, Nome Alternativo, Numero do Imovel |
| Profissional | Orientacao Profissional (22 areas x 12 VNs) |

## Tecnologias

- **Vue.js 3** — framework reativo com Composition API
- **Vite** — build tool e servidor de desenvolvimento
- **Pinia** — gerenciamento de estado
- **Vue Router** — navegacao entre telas
- **Tailwind CSS v4** — estilizacao
- **jsPDF** — geracao de PDF no navegador (sem servidor)
- **Service Worker** — cache offline e instalacao como PWA

## Rodar Localmente

```bash
# Instalar dependencias
npm install

# Servidor de desenvolvimento
npm run dev

# Build para producao
npm run build
```

## Deploy no GitHub Pages

```bash
# Build
npm run build

# Publicar (requer configuracao do GitHub Pages para branch gh-pages)
npm run build && cp -r dist/* docs/
git add docs/ && git commit -m "deploy" && git push
```

O projeto esta configurado com `base: '/Mapa-Numerologico/'` no `vite.config.js`
para funcionar corretamente no GitHub Pages.

## Estrutura de Pastas

```
src/
├── core/           # Motor de calculos - todas as 33 tecnicas
├── views/          # Telas da aplicacao
├── components/     # Componentes reutilizaveis
├── stores/         # Estado global (Pinia)
├── router/         # Configuracao de rotas
└── relatorio/      # Geracao de PDF
```

## Referencias (pasta local, nao vai ao git)

A pasta `_referencias/` contem os PDFs do curso de formacao usados
como base para implementacao das 33 tecnicas. Esta pasta esta no `.gitignore`
por conter material didatico de terceiros e ter tamanho superior a 65 MB.

## Licenca

Projeto de uso profissional privado.
