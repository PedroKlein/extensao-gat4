# Extensão GAT 4 — Georreferenciamento em Saúde

## O que é este projeto?

O **GAT 4** (Grupo de Ação Territorial 4) é um dos 7 grupos do programa de extensão **PET-Saúde Digital** da **UFRGS**, intitulado *"Transformação Digital no SUS: Educação Permanente, Inovação e Integração em Saúde Digital"*.

O programa é uma parceria entre **UFRGS**, **SMS Porto Alegre**, **SES/RS**, **Grupo Hospitalar Conceição** e **UFCSPA**, vinculado ao **Programa SUS Digital** (Portarias GM/MS nº 3.232/2024 e nº 3.233/2024).

O GAT 4 é focado em desenvolver soluções digitais de **georreferenciamento para a Atenção Primária à Saúde (APS)**. A missão oficial (ação 8.4 do projeto) é:

> Atualização e qualificação do mapa georreferenciado da SMS (Geosaúde), integrando dados demográficos, epidemiológicos, assistenciais e territoriais. A ferramenta será interativa, facilitando o acesso por usuários, profissionais e comunidade acadêmica.

A **US Moab Caldas** serve como unidade piloto para testar e implementar as soluções.

## Problema

Os **Agentes Comunitários de Saúde (ACS)** e **Agentes de Combate a Endemias (ACE)** trabalham em territórios que:

- Têm **endereços não padronizados** — muitos com nomes duplicados ou sem registro oficial.
- São **dinâmicos** — as pessoas mudam de endereço e os limites territoriais de cada US são alterados com frequência.
- Possuem **dados de saúde dispersos** em múltiplas planilhas e sistemas, sem visualização geográfica integrada.

Hoje, o trabalho de mapeamento e acompanhamento territorial é em grande parte **manual e analógico**.

## Objetivos

Desenvolver **soluções digitais** que:

1. **Uniformizem endereços** — com sinônimos (nome oficial + nome popular) e geolocalização precisa.
2. **Criem mapas inteligentes digitais** — com camadas sobreponíveis de indicadores de saúde (doenças crônicas, tuberculose, gestantes, acamados, etc.) sobre o território de cada equipe de ESF.
3. **Automatizem ações de vigilância** — por exemplo, notificações automáticas para moradores próximos a um caso confirmado de dengue.

## As 3 Soluções Digitais Propostas

| # | Solução | Descrição | Status |
|---|---------|-----------|--------|
| 1 | **Mapa inteligente georreferenciado** | Mapa digital com camadas de condições de saúde, indicadores e pontos relevantes do território. Alimentado por dados dos ACS, E-SUS e planilhas da US. | Em desenvolvimento — levantamento de requisitos com equipes |
| 2 | **Integração intersetorial** | Georreferenciamento que integre serviços de saúde com a rede de proteção social (CRAS, CREAS, escolas, etc.) | Em fase de exploração |
| 3 | **Vigilância automatizada** | Automação de ações de vigilância epidemiológica — envio de alertas georreferenciados (ex: dengue) | Conceitual |

## Os outros GATs do programa

O GAT 4 não trabalha isolado. Outros grupos do PET-Saúde Digital possuem interseções diretas:

| Grupo | Foco | Interseção com GAT 4 |
|-------|------|----------------------|
| GAT 1 | Educação permanente em saúde digital | Letramento digital dos ACS para usar a ferramenta |
| GAT 2 | Mapeamento de infoestrutura/infraestrutura | Diagnóstico se as USs têm computador/internet |
| GAT 3 | Consultório na Rua | Apps móveis com funcionalidades GIS similares |
| GAT 5 | Indicadores de saúde (Coord. Oeste) | Indicadores que poderiam ser camadas no mapa |
| GAT 6 | Telerreabilitação social | — |
| GAT 7 | Cuidados especializados (UFCSPA) | Fluxos GERCON, exames remotos |

> Detalhes completos em [context/extension-program.md](context/extension-program.md)

## Equipe

### Acadêmicos / Universidade
| Papel | Nome |
|-------|------|
| Professora | Fernanda |
| Professor | Netto |
| Tutor | Thiago |

### Preceptores (profissionais de saúde)
| Papel | Nome |
|-------|------|
| Preceptor | Lucas |
| Preceptora | Leila |

### Monitores (estudantes)
| Área | Nome |
|------|------|
| Saúde | Bruno, Vinicio, Vinicius, Daniele, Roberta, Ketlin |
| Computação | Guilherme (desde 16/04/2026) |

### Parceiros
- **US Moab Caldas** — Equipe 4 de ESF (ACS e equipe de saúde)
- **Projeto Reconecta UFRGS** — infraestrutura (computador + manutenção)

## Estrutura do repositório

```
docs/
├── README.md                          # ← Você está aqui
├── pet-saude-digital.md               # Transcrição do documento oficial do PET-Saúde Digital
├── reports.md                         # Relatos das reuniões do GAT 4
├── glossary.md                        # Glossário de termos e siglas
├── references.md                      # Links e referências do projeto
└── context/
    ├── extension-program.md           # Análise do programa PET-Saúde Digital (7 GATs)
    ├── territorialization.md          # Como funciona a territorialização em saúde em POA
    ├── geoprocessing-health.md        # Conceitos de geoprocessamento em saúde
    ├── tools-and-platforms.md         # Ferramentas existentes (Geosaúde, GeoPoa, E-SUS, etc.)
    └── digital-solutions.md           # Detalhamento das 3 soluções digitais propostas
```

## Linha do tempo

| Data | Evento |
|------|--------|
| 16/01/2026 | 1ª reunião GAT 4 — levantamento de problemas e ideias iniciais |
| 27/02/2026 | 2ª reunião — estudo de geoprocessamento em saúde (apresentações dos monitores) |
| 13/03/2026 | 3ª reunião (presencial na US Moab) — reconhecimento do processo de trabalho |
| 06/04/2026 | 4ª reunião (US Moab, Equipe 4) — levantamento de necessidades para o mapa |
| 16/04/2026 | 5ª reunião — integração com computação (Guilherme), definição de tarefas |
| 23/04/2026 | **Prazo:** preenchimento das planilhas de condições de saúde |
| 07/05/2026 | **Previsto:** apresentação na reunião ampliada de equipes da US Moab |

## Protótipos

Provas de conceito funcionais com dados sintéticos, disponíveis em [pedroklein.github.io/extensao-gat4](https://pedroklein.github.io/extensao-gat4/):

| Protótipo | Descrição |
|-----------|----------|
| [Mapa Territorial](../prototypes/poc-01/) | Visão geral do território com camadas por condição de saúde e filtros por microárea |
| [Mapa Gestantes](../prototypes/mapa-gestantes/) | Acompanhamento de gestantes com score de urgência, rota até paciente, mapa de calor e ficha detalhada |
