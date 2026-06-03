# Mapa de Gestantes — US Moab Caldas

Protótipo de mapa interativo para acompanhamento de gestantes e puérperas no território da Equipe 4 de ESF da US Moab Caldas (Santa Tereza, Porto Alegre/RS).

Todos os dados são **sintéticos**. Nenhuma informação real de pacientes é utilizada.

## Como executar

```bash
npm install
npm run dev
```

Acessa `http://localhost:5173` no navegador.

## Funcionalidades

### Visualização no mapa

- Marcadores coloridos por urgência: 🔴 Crítico, 🟡 Atenção, 🟢 Normal
- Marcador fixo da Unidade de Saúde como ponto de referência
- Tooltip ao passar o mouse mostrando nome e semana gestacional
- Seleção de paciente com destaque visual (borda azul + aumento de raio)
- Agrupamento de pacientes no mesmo endereço (badge com contagem)
- Rota automática a pé da US até a paciente selecionada (via OSRM)
- Legenda permanente com significado das cores

### Mapa de calor

- Toggle entre marcadores individuais e visualização de densidade
- Tiles escuros (CartoDB Dark Matter) ativados automaticamente no modo calor
- Intensidade ponderada pela urgência de cada paciente

### Microáreas

- Polígonos coloridos por ACS responsável (5 cores distintas)
- Labels com nome da ACS no centro de cada polígono
- Tooltip com estatísticas agregadas (total, críticas, % em dia)
- Toggle para mostrar/ocultar

### Ficha detalhada (painel lateral)

- Identificação: nome, idade, CNS, telefone, endereço
- Gestação: idade gestacional, DPP com contagem regressiva, DUM
- Consultas: última consulta, total, pressão arterial, visitas domiciliares
- Exames: status de TR/sorologia por trimestre (feito/pendente)
- Alertas: lista do que está atrasado ou pendente
- Tratamento (se exposta): TARV, doses de penicilina, vacinação HepB
- Distância até a US com estimativa de tempo a pé
- Composição do score de urgência com explicação do sistema

### Painel da Unidade de Saúde

- Clicando na US abre painel com relatório do território
- Total de gestantes, distribuição por urgência, % em dia
- DPPs próximas, expostas em tratamento, puérperas
- Breakdown por ACS responsável

### Filtros

- Por urgência (crítico, atenção, normal)
- Apenas expostas
- Por trimestre (1º, 2º, 3º, puérperas)
- Por ACS responsável (5 microáreas com cores)
- Slider temporal: "sem consulta há mais de X dias"
- Botão "Limpar" para resetar todos os filtros
- Painel colapsável (começa fechado no mobile)

### Lista de prioridades

- Ordenada por score de urgência (maior primeiro)
- Mostra: nome, semana gestacional, trimestre, dias sem consulta, alerta principal
- Tooltip no score mostrando composição
- Click na lista seleciona a paciente no mapa

### Busca

- Por nome ou CNS (busca parcial)
- Dropdown com até 5 resultados
- Selecionar resultado centra o mapa na paciente

### Estatísticas globais

- Total, críticas, atenção, normais, % em dia, DPP em 30 dias, expostas
- Click em "DPP 30d" filtra temporariamente só essas pacientes
- Botão "Imprimir" gera página formatada para impressão com tabela completa

### Interações gerais

- Esc fecha o painel lateral e limpa a rota
- Click no mapa (fora de marcadores) fecha o painel
- Responsivo: funciona em desktop, tablet e mobile
- Mobile: filtros colapsados, stats no rodapé, painel sobe de baixo

## Stack

| Componente | Tecnologia |
|-----------|-----------|
| Bundler | Vite |
| Linguagem | TypeScript (strict) |
| Mapa | Leaflet + leaflet.heat + leaflet.markercluster |
| CSS | Tailwind CSS |
| Dados | faker-js (pt_BR) com cenários clínicos curados |
| Rotas | OSRM public API (perfil a pé) |
| Tiles | OpenStreetMap + CartoDB Dark Matter |
| Testes | Vitest (19 unit tests para lógica de urgência) |
| Screenshots | Playwright (captura em 3 viewports) |
| Deploy | GitHub Pages (static files) |

## Scripts

```bash
npm run dev              # Dev server com hot reload
npm run build            # Build para produção (dist/)
npm run generate-data    # Gera 55 pacientes sintéticas
npm run validate-data    # Valida coerência dos dados gerados
npm run screenshot       # Captura screenshots em mobile/tablet/desktop
npm run test             # Roda testes unitários
npm run typecheck        # Verifica tipos TypeScript
npm run lint             # ESLint
```

## Dados sintéticos

55 pacientes distribuídas em 5 microáreas, com cenários:

- Normal (tudo em dia): ~35%
- Consulta atrasada (15-80+ dias): ~15%
- Exposta HIV/Sífilis/Hepatite B: ~15%
- Pressão arterial elevada: ~10%
- DPP próxima (<30 dias): ~8%
- Puérperas (pós-parto): ~10%
- Sem odonto, sem VD, vacina pendente: combinações variadas

Endereços reais da região Santa Tereza/Vila Cruzeiro com coordenadas do OpenStreetMap.

## Documentação relacionada

- [Especificação funcional](./SPEC.md)
- [Perguntas para a equipe de saúde](./PERGUNTAS-EQUIPE.md)
- [Documentação do projeto](../../docs/README.md)
- [Glossário de siglas](../../docs/glossary.md)
