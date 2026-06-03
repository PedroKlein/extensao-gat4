# PoC 01 — Mapa de Acompanhamento Territorial

## O que é

Mapa interativo do território da US Moab Caldas mostrando pacientes com diferentes condições de saúde, filtráveis por urgência, condição e microárea. Funciona como ferramenta de planejamento de visitas e gestão territorial para a equipe de ESF.

Todos os dados são sintéticos. Nenhuma informação real de pacientes é utilizada.

## Como usar

Abrir `index.html` no navegador. Não precisa de servidor, build, ou instalação.

Ou acesse a [versão online](https://pedroklein.github.io/extensao-gat4/poc-01/).

## Funcionalidades

**Visualização:**
- Mapa centrado no território da US Moab Caldas (Bairro Santa Tereza)
- Marcadores coloridos por urgência de acompanhamento (atrasado, próximo, em dia)
- Polígonos semi-transparentes delimitando as microáreas
- Camada de equipamentos do território (escolas, CRAS, igrejas, áreas de risco)

**Filtros:**
- Por condição de saúde: gestantes, tuberculose, crônicos, acamados, doenças transmissíveis
- Por microárea (1 a 6)
- Por urgência: atrasado, vencendo esta semana, em dia

**Interações:**
- Click no marcador abre popup com dados do paciente
- Hover em microárea destaca e mostra contagem
- Upload de CSV para carregar novos dados
- Painel lateral com resumo numérico

**Urgência (cores):**

| Cor | Status | Critério |
|-----|--------|----------|
| 🔴 Vermelho | Atrasado | Próximo acompanhamento já passou |
| 🟡 Amarelo | Próximo | Vence nos próximos 7 dias |
| 🟢 Verde | Em dia | Próximo acompanhamento > 7 dias |

## Stack

| Componente | Tecnologia |
|-----------|-----------|
| Mapa | Leaflet 1.9 (CDN) |
| Tiles | OpenStreetMap |
| CSV parsing | Papa Parse (CDN) |
| Frontend | Vanilla JS (sem framework, sem build) |
| Estilo | CSS puro |
| Dados | GeoJSON (polígonos) + CSV (pacientes) |

## Dados sintéticos

~40 pacientes fictícios distribuídos em 6 microáreas:
- Gestantes, tuberculose, crônicos (diabetes/hipertensão), acamados, doenças transmissíveis
- Mix de urgências: ~30% atrasados, ~20% vencendo, ~50% em dia
- Coordenadas no Bairro Santa Tereza e arredores

## Estrutura

```
poc-01/
├── index.html
├── css/style.css
├── js/
│   ├── app.js          # Inicialização
│   ├── map.js          # Mapa e camadas
│   ├── data.js         # Carregamento de dados
│   ├── filters.js      # Lógica de filtros
│   └── ui.js           # Painel, popups, resumo
└── data/
    ├── pacientes.csv
    ├── microareas.geojson
    └── equipamentos.geojson
```

## Limitações (fora de escopo)

Este protótipo não inclui: autenticação, backend, conexão com E-SUS, dados reais, geocodificação de endereços, deploy em produção, app mobile ou modo offline.

## Relação com o Mapa de Gestantes

Este PoC cobre o território de forma geral (todas as condições de saúde). O [Mapa de Gestantes](../mapa-gestantes/) aprofunda especificamente o acompanhamento de gestantes com ficha detalhada, score de urgência, rota a pé e mapa de calor.
