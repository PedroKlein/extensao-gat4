# Mapa Gestantes — PoC Interativo

Protótipo de mapa interativo para acompanhamento de gestantes na US Moab Caldas (GAT 4 — PET-Saúde Digital UFRGS).

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Gerar dados fake

```bash
npm run generate-data
npm run validate-data
```

## Build para produção

```bash
npm run build
```

Os arquivos estáticos ficam em `dist/`. Podem ser servidos por qualquer servidor HTTP ou publicados no GitHub Pages.

## Funcionalidades

- **Mapa interativo** com marcadores coloridos por urgência (🔴 Crítico / 🟡 Atenção / 🟢 Normal)
- **Ficha detalhada** ao clicar (identificação, gestação, exames, alertas, tratamento)
- **Filtros combinados** por urgência, expostas, trimestre, microárea
- **Slider temporal** — filtrar por dias sem consulta
- **Lista de prioridade** ordenada por score
- **Estatísticas globais** — resumo do território
- **Busca** por nome ou CNS
- **Mapa de calor** — visualização de densidade
- **Microáreas** — polígonos com indicadores agregados por ACS
- **Tooltips em siglas** — expande acrônimos ao hover
- **50 pacientes sintéticas** com cenários clínicos variados

## Docs

- [Especificação Funcional](./SPEC.md)
- [Perguntas para a equipe de saúde](./PERGUNTAS-EQUIPE.md)
