# PoC Mapa Gestantes — Especificação Funcional

## Stack Técnica

| Concern | Escolha |
|---------|--------|
| Bundler/dev | Vite |
| Linguagem | TypeScript |
| Mapa | Leaflet + plugins (leaflet.heat, leaflet.markercluster) |
| Styling | Tailwind CSS |
| Geração de dados | Node.js + faker-js (pt_BR), mesmo ecossistema |
| Output | Arquivos estáticos → GitHub Pages |
| Validação clínica | Regras codificadas no gerador + script de validação |

### Organização do projeto

```
prototypes/mapa-gestantes/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── index.html
├── scripts/
│   ├── generate-data.ts      # Gera dados fake (~50 pacientes)
│   ├── streets.ts            # Ruas reais da região + coordenadas
│   ├── scenarios.ts          # Cenários clínicos
│   └── validate.ts           # Valida coerência dos dados gerados
├── src/
│   ├── main.ts
│   ├── style.css
│   ├── models/               # Interfaces TypeScript (Gestante, Microárea, Urgency)
│   ├── logic/                # Urgência, filtros, datas, household
│   ├── components/           # Map, markers, panels, filters, list, search, etc.
│   └── data/                 # gestantes.json, microareas.json, acronyms.ts
├── SPEC.md                   # ← Este arquivo
├── PERGUNTAS-EQUIPE.md       # Perguntas para validação com equipe de saúde
└── README.md
```

### Deploy

O build do Vite produz `dist/` com HTML+JS+CSS estáticos. Pode ser:
- Servido via GitHub Pages (push para branch `gh-pages`)
- Aberto localmente com qualquer servidor estático
- Funciona offline após carregamento inicial (tiles OSM são a única dependência de rede)

---

## Tese Central

**"Eu posso ver meu território de vários ângulos."**

O valor da ferramenta está em permitir que o profissional de saúde alterne entre diferentes camadas e visualizações que respondem a perguntas distintas do cotidiano da equipe — desde "quem precisa de mim agora?" até "onde se concentram as gestantes?" ou "como está cada microárea?".

## Audiência

Profissionais de saúde da US Moab Caldas: ACS, enfermeiras, preceptores (Lucas, Leila). A interface deve ser intuitiva, em português, com linguagem acessível. Siglas devem ter tooltips expansíveis.

## Fontes de Dados (referência)

- `docs/gestantes.csv` — Cadastro principal de gestantes com acompanhamento pré-natal
- `docs/gestantes-expostas.csv` — Acompanhamento de tratamento para gestantes com TR reagente (HIV/Sífilis/HepB)

Para o PoC, usaremos **~50 pacientes sintéticas** com dados gerados cobrindo cenários variados.

---

## Camadas de Visualização

Cada camada responde a uma pergunta diferente e tem sua visualização natural.
A visualização depende da camada/dados sendo mostrados — não é um toggle global.

| Camada | Visualização | Pergunta que responde |
|--------|-------------|----------------------|
| Gestantes individuais | Marcadores com cor por urgência (🔴🟡🟢) | "Onde estão e como estão?" |
| Gestantes expostas | Filtro dedicado, marcadores destacados | "Quem precisa de tratamento ativo?" |
| Alertas temporais | Slider de dias; marcadores mudam com o tempo | "Quem está atrasada há mais de X dias?" |
| Por microárea | Polígonos com indicadores agregados + nome da ACS | "Como está cada região? Qual ACS precisa de apoio?" |
| Densidade | Heatmap (oculta marcadores individuais) | "Onde se concentram as gestantes?" |
| Por trimestre | Filtro 1º/2º/3º trimestre | "Quem precisa de quais exames agora?" |
| Clustering | Marcadores agrupados em zoom baixo, explodem com zoom | "Quantas gestantes há em cada sub-região?" |

---

## Lógica de Urgência (Híbrida)

### Visualização no mapa: 3 categorias de cor

**🔴 CRÍTICO:**
- TR HIV Reagente (exposta, precisa TARV)
- TR Sífilis Reagente (precisa tratamento em doses)
- TR HBsAg Reagente
- PA ≥ 140/90 (risco pré-eclâmpsia)
- Consulta atrasada > 45 dias
- 3º trimestre sem TR/sorologia feitos

**🟡 ATENÇÃO:**
- Consulta atrasada 15-45 dias
- Menos consultas que o esperado para a IG
- Peso/Altura marcado como "Atrasada"
- Sem avaliação odontológica
- DTpa não feita (>20 semanas de IG)
- Sem visita domiciliar registrada

**🟢 NORMAL:**
- Todos os indicadores em dia para a IG atual

### Ordenação interna: Score numérico

Dentro de cada categoria, um score numérico permite ordenar por prioridade relativa:

| Fator | Pontos |
|-------|--------|
| TR Reagente (HIV/Sífilis/HepB) | +50 |
| PA ≥ 140/90 | +40 |
| Dias sem consulta | +2/dia (acima de 14 dias) |
| Exame pendente para o trimestre atual | +15 cada |
| Sem visita domiciliar | +10 |
| Sem avaliação odontológica | +5 |
| DTpa pendente (>20 sem) | +5 |
| Poucas consultas para IG | +10 |

> **Puérperas** (pós-parto) usam lógica diferenciada: os alertas mudam para consulta puerpério, visita domiciliar pós-parto e avaliação odontológica pós-parto.

---

## Interações do Usuário

### Obrigatórias

1. **Clicar na gestante → ficha completa**
   - Identificação: nome, idade, CNS, telefone, endereço
   - Gestação: IG atual (calculada), DPP com contagem regressiva, DUM
   - Consultas: última, próxima, total, dias desde a última
   - Exames: status de cada TR/sorologia por trimestre (✓/✗)
   - Alertas: lista do que está pendente/atrasado
   - Se exposta: dados de tratamento (TARV, doses sífilis, vacinação HepB)
   - Distância até a US Moab

2. **Filtros por critério**
   - Por urgência: Críticas / Atenção / Normais
   - Gestantes expostas (sim/não)
   - Por trimestre: 1º / 2º / 3º / Puérperas
   - Por microárea: MA1 / MA2 / MA3 / MA4 / MA5

3. **Painel de estatísticas globais**
   - Total de gestantes acompanhadas
   - Distribuição por urgência
   - DPPs próximas (partos iminentes)
   - Expostas em tratamento (por tipo)
   - % com pré-natal em dia

4. **Lista lateral ordenada por prioridade (score)**
   - Todas as gestantes em lista, ordenada do maior score para o menor
   - Clicar numa → destaca no mapa e abre ficha
   - Filtros da lista sincronizam com filtros do mapa

5. **Busca por nome ou CNS**
   - Campo de texto, busca parcial
   - Resultado destaca no mapa + abre ficha

6. **Slider temporal**
   - "Mostrar quem está sem consulta há mais de X dias"
   - Ao mover, pontos aparecem/desaparecem no mapa

7. **US Moab como referência**
   - Marcador fixo da unidade de saúde no mapa
   - Ponto de orientação para o profissional

### Detalhes de UX

- **Tooltips em siglas:** ao passar o mouse sobre CNS, IG, DPP, TR, TARV, DTpa, VDRL, PA, VD, DUM etc., exibe nome completo. Fundamental para acessibilidade e onboarding de novos profissionais.
- **Agrupamento por domicílio:** se duas gestantes moram no mesmo endereço, indicar visualmente (badge com contagem no marcador). Ao clicar, mostra lista para selecionar qual paciente ver.
- **Nome do ACS** aparece na visualização por microárea (no tooltip/label do polígono)
- **Distância até a US** na ficha de cada paciente (metros/km + estimativa de caminhada)
- **US Moab como ponto de referência** — marcador fixo no mapa com ícone distinto
- **Marker clustering** — em zoom baixo, marcadores agrupam com contagem. Cor do cluster = pior urgência interna.
- **Responsivo** (funcionar em tablet/mobile: filtros colapsados, stats no rodapé, painel sobe de baixo)
- **Todo em português brasileiro**
- **Polido para demonstração**

### Funcionalidades adicionais (implementadas após a spec inicial)

8. **Rota a pé automática**
   - Ao selecionar uma paciente, calcula e desenha a rota a pé da US até o endereço
   - Usa OSRM public API (perfil walking)
   - Mostra distância em km e tempo estimado
   - Rota desaparece ao deselecionar

9. **Mapa de calor com tiles escuros**
   - Toggle troca para CartoDB Dark Matter (tiles pré-carregados)
   - Intensidade ponderada pela urgência
   - Marcadores ocultos durante o modo calor

10. **Impressão de lista**
    - Botão gera página formatada para impressão
    - Tabela com nome, endereço, IG, urgência, score, alertas, ACS
    - Útil para ACS em campo sem internet

11. **Legenda permanente**
    - Barra fixa no rodapé do mapa com cores e significados

12. **Hover tooltip nos marcadores**
    - Ao passar o mouse: nome + semana gestacional + ícone de urgência

13. **Click em DPP 30d filtra**
    - Clicar no card de DPP próximas destaca apenas essas pacientes por 5 segundos

14. **Botão limpar filtros**
    - Reseta todos os filtros ao estado inicial

15. **Painel da US (relatório do território)**
    - Clicar na US abre painel com total, distribuição, expostas, breakdown por ACS

16. **Esc e click no mapa fecham o painel**
    - Keyboard shortcut + click fora de marcadores fecha painel e limpa rota

17. **Score explicado**
    - Tooltip no badge de score mostra composição
    - "Como funciona?" no painel expande tabela com todos os fatores e pesos

---

## Dados Sintéticos

### Volume
~50 pacientes

### Geografia
- Endereços com **ruas reais** do bairro Santa Tereza / Vila Cruzeiro (região da US Moab Caldas)
- Coordenadas derivadas das ruas reais (geocoding ou coords conhecidas + pequena variação)
- Centro de referência: US Moab Caldas (Av. Moab Caldas, 400 — Lat -30.0729573, Lng -51.2201539)

### Microáreas
4-5 polígonos fake dividindo a região ao redor da US Moab, com nomes de ACS fictícias atribuídas.

### Cenários clínicos (com combinações possíveis)

| Cenário | % aprox | Descrição |
|---------|---------|-----------|
| Normal (tudo em dia) | ~35% | Controle/baseline |
| Consulta atrasada | ~25% | Vários graus: 15d, 30d, 60d+ |
| Exposta HIV | ~5% | TR reagente, carga viral variada, TARV iniciado ou não |
| Exposta Sífilis | ~8% | Tratamento em 1-3 doses, vários estágios |
| Exposta Hepatite B | ~3% | Vacinação em 3 doses, vários estágios |
| Pressão arterial elevada | ~10% | PA ≥ 140/90 |
| Sem avaliação odontológica | ~30% | Comum, menos urgente |
| DTpa pendente (>20 sem) | ~15% | Alerta moderado |
| Poucas consultas para IG | ~10% | Ex: 28 sem com apenas 2 consultas |
| DPP próxima (<30 dias) | ~8% | Testa contagem regressiva |
| Puérpera (pós-parto) | ~10% | Lógica diferenciada de alertas |
| Sem visita domiciliar | ~20% | Indica possível falta de vínculo |

> Cenários se combinam: uma gestante pode ser exposta HIV E com consulta atrasada E sem odonto.

### Coerência dos dados

Os dados gerados devem respeitar relações lógicas:
- IG é calculável a partir de DUM (semanas desde DUM até hoje)
- DPP = DUM + 280 dias
- Trimestre: 1º (≤13 sem), 2º (14-27 sem), 3º (≥28 sem)
- Nº de consultas deve ser plausível para a IG (mínimo esperado pelo MS: 6 consultas no total)
- Exames do 1º trimestre devem estar "feitos" se a gestante já está no 2º ou 3º (exceto cenário de atraso)
- PA é uma medida pontual (ex: "120/80", "140/90", "150/100")
- Puérpera: DPP já passou, campos pós-parto relevantes

---

## Fases de Implementação

### Fase 1 — Core (o PoC não funciona sem isso)

1. Scaffolding do projeto (Vite + TS + Tailwind + Leaflet)
2. Modelos de dados TypeScript
3. Lógica de urgência (score + categorias)
4. Gerador de dados sintéticos (~50 pacientes)
5. Mapa base + marcadores individuais por urgência
6. Painel de ficha detalhada (clicar → ver tudo)
7. Sistema de filtros (urgência, expostas, trimestre, microárea)
8. Lista lateral ordenada por prioridade

### Fase 2 — Interações Ricas

9. Painel de estatísticas globais
10. Busca por nome/CNS
11. Slider temporal (dias sem consulta)
12. Tooltips em siglas

### Fase 3 — Camadas Avançadas

13. Heatmap (densidade)
14. Polígonos de microárea com indicadores
15. Marker clustering
16. Agrupamento por domicílio

### Fase 4 — Polish + Deploy

17. Responsivo mobile/tablet, transições, legenda, GitHub Pages

---

## Acabamento Visual

- **Polido para demonstração** — deve parecer um produto, não um hack
- Interface limpa, moderna, cores consistentes
- Todo texto em português brasileiro
- Responsivo (funciona em tablet na US)
- Legenda clara de cores e símbolos
- Transições suaves (painel desliza, marcadores aparecem/desaparecem)
- Loading states enquanto dados carregam

---

## Referências de Domínio

- [Glossário de siglas](../../docs/glossary.md)
- [Soluções digitais propostas](../../docs/context/digital-solutions.md)
- [Ferramentas existentes](../../docs/context/tools-and-platforms.md)
- [Territorialização em POA](../../docs/context/territorialization.md)
