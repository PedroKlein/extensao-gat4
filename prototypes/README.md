# Protótipos — GAT 4

Provas de conceito de georreferenciamento em saúde para a Atenção Primária. Todos utilizam dados sintéticos.

**Demo online:** [pedroklein.github.io/extensao-gat4](https://pedroklein.github.io/extensao-gat4/)

## Protótipos disponíveis

### [Mapa de Acompanhamento Territorial](./poc-01/)

Visão geral do território da Equipe 4 de ESF. Mostra pacientes com diferentes condições de saúde (gestantes, tuberculose, crônicos, acamados, doenças transmissíveis), filtráveis por urgência, condição e microárea. Inclui camada de equipamentos sociais e upload de CSV.

Stack: Vanilla HTML/JS + Leaflet (sem build, abre direto no navegador).

### [Mapa de Gestantes e Puérperas](./mapa-gestantes/)

Acompanhamento específico de gestantes com:
- Score de urgência híbrido (3 cores no mapa + score numérico para ordenação)
- Rota a pé automática da US até a paciente (OSRM)
- Mapa de calor com tiles escuros
- Ficha detalhada com alertas clínicos e dados de exposição
- Filtragem por trimestre, ACS responsável e tempo sem consulta
- Impressão de lista para visitas em campo

Stack: Vite + TypeScript + Leaflet + Tailwind CSS.

## Deploy

Os protótipos são publicados automaticamente no GitHub Pages via [workflow](./../.github/workflows/deploy.yml). Qualquer push em `prototypes/` no branch `main` aciona o deploy.

## Dados

Nenhum dado real de pacientes é utilizado. Todos os nomes, endereços e condições clínicas são gerados sinteticamente. Os endereços usam coordenadas reais de ruas da região (via OpenStreetMap) para posicionamento realista no mapa.
