# PoC 01 — Mapa de Acompanhamento Territorial

## Objetivo

Provar que é possível visualizar dados de saúde georreferenciados de forma interativa, útil para o planejamento de visitas e a gestão territorial da equipe de ESF da US Moab Caldas.

**Não é:** uma ferramenta de produção, um sistema completo, nem algo que vai lidar com dados reais de pacientes.

**É:** uma demonstração funcional que serve como base para discussão com a equipe de saúde e como ponto de partida para desenvolvimento futuro.

---

## Casos de uso demonstrados

| # | Caso de uso | O que a PoC mostra |
|---|-------------|---------------------|
| 1 | **Planejamento de visitas** | Filtrar pacientes por urgência (atrasado, próximo, em dia) e por microárea |
| 2 | **Vigilância epidemiológica** | Visualizar concentração de agravos por região (camadas por condição) |
| 3 | **Conhecimento do território** | Ver equipamentos sociais (escolas, CRAS, igrejas) no mapa |
| 4 | **Visão de gestão** | Resumo de contagens por microárea e por condição |
| 5 | **Ingestão de dados** | Carregar um CSV e ver os pontos no mapa |

---

## Funcionalidades

### Core (obrigatório)

- [ ] **Mapa interativo** centrado no território da US Moab Caldas (Bairro Santa Tereza)
- [ ] **Marcadores coloridos por urgência:**
  - 🔴 Vermelho = acompanhamento atrasado (data já passou)
  - 🟡 Amarelo = vence esta semana
  - 🟢 Verde = em dia
- [ ] **Camadas togglable por condição de saúde:**
  - Gestantes
  - Tuberculose
  - Doenças crônicas (diabetes, hipertensão)
  - Acamados
  - Doenças transmissíveis
- [ ] **Filtro por microárea** (1, 2, 3, 4...)
- [ ] **Popup ao clicar no marcador:**
  - Identificador (não nome real — ex: "Paciente #042")
  - Condição de saúde
  - Data do último acompanhamento
  - Data do próximo acompanhamento (aprazamento)
  - Microárea
  - Endereço
- [ ] **Polígonos de microáreas** sobrepostos no mapa (com cores semi-transparentes)
- [ ] **Painel de resumo:**
  - Total de pacientes por condição
  - Total atrasados / vencendo / em dia
  - Breakdown por microárea

### Secundário (desejável)

- [ ] **Camada de equipamentos do território:**
  - Escolas
  - CRAS/CREAS
  - Igrejas
  - Espaços de lazer
  - Áreas de risco
- [ ] **Upload de CSV** — arrastar ou selecionar arquivo, dados aparecem no mapa
- [ ] **Heatmap toggle** — visualização de densidade ao invés de pontos individuais
- [ ] **Painel "Atenção"** — lista dos pacientes com acompanhamento atrasado, ordenada por dias de atraso

### Fora de escopo (não fazer)

- Autenticação / login
- Backend / banco de dados
- Conexão com E-SUS
- Dados reais de pacientes
- Geocodificação de endereços (pontos já vêm com lat/lng)
- Deploy em produção
- App mobile
- Modo offline

---

## Stack técnica

| Componente | Tecnologia | Justificativa |
|------------|-----------|---------------|
| Mapa | **Leaflet 1.9** (CDN) | Leve, open-source, padrão para projetos de saúde |
| Tiles | **OpenStreetMap** | Gratuito, sem API key, boa cobertura de POA |
| Parsing CSV | **Papa Parse** (CDN) | Biblioteca padrão para CSV no browser |
| Frontend | **Vanilla JS** (sem framework) | Zero build step, máxima portabilidade |
| Estilo | **CSS puro** | Sem dependências extras |
| Dados | **GeoJSON + CSV** | GeoJSON para polígonos, CSV para pontos de pacientes |

### Estrutura de arquivos

```
prototypes/poc-01/
├── README.md              # ← Este arquivo (spec)
├── index.html             # Página principal
├── css/
│   └── style.css          # Estilos
├── js/
│   ├── app.js             # Ponto de entrada, inicialização
│   ├── map.js             # Configuração do mapa e camadas
│   ├── data.js            # Carregamento e parsing de dados
│   ├── filters.js         # Lógica de filtros
│   └── ui.js              # Painel lateral, popups, resumo
└── data/
    ├── pacientes.csv      # Dados sintéticos de pacientes
    ├── microareas.geojson  # Polígonos das microáreas
    └── equipamentos.geojson # Pontos de equipamentos do território
```

---

## Modelo de dados

### pacientes.csv

| Coluna | Tipo | Exemplo | Descrição |
|--------|------|---------|-----------|
| `id` | string | "P042" | Identificador fictício |
| `lat` | float | -30.0731 | Latitude |
| `lng` | float | -51.2198 | Longitude |
| `condicao` | string | "gestante" | Condição de saúde principal |
| `microarea` | int | 3 | Microárea do ACS responsável |
| `ultimo_acompanhamento` | date (ISO) | "2026-04-10" | Data da última visita/consulta |
| `proximo_acompanhamento` | date (ISO) | "2026-05-15" | Aprazamento — próxima data obrigatória |
| `endereco` | string | "Rua São Manoel, 123" | Endereço (informativo) |
| `observacao` | string | "3º trimestre" | Nota livre |

**Condições válidas:** `gestante`, `tuberculose`, `cronico`, `acamado`, `transmissivel`

### microareas.geojson

GeoJSON FeatureCollection com polígonos. Cada feature tem:
- `properties.id` — número da microárea (1-6)
- `properties.nome` — "Microárea 1", "Microárea 2", etc.
- `properties.acs` — nome do ACS responsável (fictício)
- `properties.cor` — cor de preenchimento

### equipamentos.geojson

GeoJSON FeatureCollection com pontos. Cada feature tem:
- `properties.nome` — "Escola Municipal X", "CRAS Y"
- `properties.tipo` — "escola", "cras", "igreja", "lazer", "risco"
- `properties.icone` — emoji ou classe de ícone

---

## Dados sintéticos

A PoC usará **30-40 pacientes fictícios** distribuídos por 4-6 microáreas no território da US Moab Caldas.

Distribuição aproximada:
- 6-8 gestantes
- 4-5 pacientes TB
- 10-12 crônicos (diabetes/hipertensão)
- 4-5 acamados
- 4-5 doenças transmissíveis

Os pontos devem estar espalhados realisticamente pelo **Bairro Santa Tereza** e arredores (coordenadas entre lat -30.07 a -30.08, lng -51.21 a -51.23).

Os aprazamentos devem incluir uma mistura de:
- ~30% atrasados (data no passado)
- ~20% vencendo esta semana
- ~50% em dia (próxima data > 7 dias)

---

## Comportamento da UI

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  🗺️ Mapa Territorial — US Moab Caldas                   │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  FILTROS   │              MAPA (Leaflet)                │
│            │                                            │
│  Condições │                                            │
│  ☑ Gestante│         [marcadores coloridos]             │
│  ☑ TB      │         [polígonos microáreas]             │
│  ☑ Crônico │                                            │
│  ☑ Acamado │                                            │
│  ☑ Transm. │                                            │
│            │                                            │
│  Microárea │                                            │
│  [Todas ▼] │                                            │
│            │                                            │
│  Urgência  │                                            │
│  ☑ Atrasado│                                            │
│  ☑ Próximo │                                            │
│  ☑ Em dia  │                                            │
│            │                                            │
│ ────────── │                                            │
│  RESUMO    │                                            │
│  12 atras. │                                            │
│   7 próx.  │                                            │
│  21 em dia │                                            │
│            │                                            │
├────────────┴────────────────────────────────────────────┤
│  [Upload CSV]  |  Última atualização: 22/05/2026        │
└─────────────────────────────────────────────────────────┘
```

### Interações

1. **Toggle de camada** (checkbox) → mostra/esconde marcadores daquela condição
2. **Dropdown de microárea** → filtra para mostrar apenas pacientes daquela microárea
3. **Toggle de urgência** → mostra/esconde por status de aprazamento
4. **Click no marcador** → popup com card do paciente
5. **Hover no polígono** → destaca a microárea e mostra contagem
6. **Upload CSV** → substitui dados atuais, re-renderiza tudo

### Cores dos marcadores

| Status | Cor | Critério |
|--------|-----|----------|
| Atrasado | 🔴 `#e53e3e` | `proximo_acompanhamento < hoje` |
| Próximo | 🟡 `#d69e2e` | `proximo_acompanhamento` entre hoje e +7 dias |
| Em dia | 🟢 `#38a169` | `proximo_acompanhamento > hoje + 7 dias` |

### Ícones por condição (no popup)

| Condição | Ícone |
|----------|-------|
| Gestante | 🤰 |
| Tuberculose | 🫁 |
| Crônico | 💊 |
| Acamado | 🛏️ |
| Transmissível | ⚠️ |

---

## Critérios de sucesso

A PoC está pronta quando:

1. ✅ Abre no browser sem nenhum build step (apenas servir arquivos estáticos)
2. ✅ Mostra o mapa centrado na US Moab Caldas com tiles do OSM
3. ✅ Carrega e exibe 30+ pacientes sintéticos com marcadores coloridos
4. ✅ Filtros de condição, microárea e urgência funcionam
5. ✅ Click em marcador mostra popup com informações
6. ✅ Polígonos de microáreas visíveis
7. ✅ Painel de resumo com contagens atualizadas conforme filtros
8. ✅ Visualmente limpo e legível (não precisa ser bonito, precisa ser usável)

---

## Próximos passos (pós-PoC)

Após validação com a equipe:

1. **Integrar dados reais** — quando as planilhas forem entregues
2. **Resolver o problema de endereços** — geocodificação, sinônimos
3. **Adicionar edição** — ACS poder marcar uma visita como realizada
4. **Backend** — para persistir dados e suportar múltiplos usuários
5. **Conectar ao e-SUS** — via API/DW para importar cadastros automaticamente
6. **Deploy na US Moab** — no computador do Projeto Reconecta
