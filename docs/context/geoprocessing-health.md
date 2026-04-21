# Geoprocessamento em Saúde — Conceitos

> Resumo dos conceitos de geoprocessamento aplicados à saúde, com base no material de referência do Ministério da Saúde utilizado pelo GAT 4.

**Referência principal:** [Geoprocessamento em Saúde, Cadastramento e Territorialização](https://bvsms.saude.gov.br/bvs/publicacoes/geoprocessamento_cadastramento_territorializacao.pdf) — Ministério da Saúde, 2023 (Programa Saúde com Agente, e-book 9).

---

## O que é geoprocessamento?

Geoprocessamento é o conjunto de **técnicas e métodos computacionais** para coleta, armazenamento, tratamento, análise e visualização de dados que possuem referência geográfica (localização no espaço).

Na saúde, permite:
- Mapear a distribuição de doenças e agravos.
- Planejar ações de saúde com base no território.
- Monitorar indicadores ao longo do tempo e espaço.
- Identificar áreas de risco e vulnerabilidade.

## Conceitos fundamentais

### Sistema de Informação Geográfica (SIG/GIS)

Sistema computacional que permite **capturar, armazenar, consultar, analisar e exibir** dados georreferenciados. Combina:
- **Dados espaciais** (onde algo está — coordenadas, polígonos, linhas).
- **Dados tabulares** (o que é esse algo — nome, tipo, indicadores).

### Georreferenciamento

Processo de **associar um dado a uma coordenada geográfica**. Exemplos:
- Associar o endereço de um paciente a um ponto no mapa (latitude/longitude).
- Associar um caso de tuberculose ao domicílio de notificação.
- Associar um equipamento social (escola, CRAS) à sua localização.

### Base cartográfica

Mapa de referência sobre o qual os dados são sobrepostos. Contém elementos como:
- Malha viária (ruas, avenidas).
- Limites de bairros e distritos.
- Hidrografia, topografia.
- Limites dos territórios de saúde.

### Camadas (layers)

Os dados são organizados em **camadas temáticas** que podem ser ativadas/desativadas e sobrepostas:

```
┌────────────────────────────┐
│  Camada: Gestantes         │  ← dados dos ACS
├────────────────────────────┤
│  Camada: Casos de TB       │  ← dados do SINAN / E-SUS
├────────────────────────────┤
│  Camada: Equipamentos      │  ← escolas, CRAS, igrejas
├────────────────────────────┤
│  Camada: Áreas de risco    │  ← dados ambientais
├────────────────────────────┤
│  Base cartográfica (mapa)  │  ← ruas, limites, etc.
└────────────────────────────┘
```

### Análise espacial

Técnicas para identificar padrões geográficos nos dados:
- **Clusters** — agrupamentos de casos em uma área (ex: surto de dengue).
- **Buffers** — áreas de influência ao redor de um ponto (ex: 100m ao redor de um caso de dengue).
- **Sobreposição** — cruzamento de camadas (ex: áreas de risco ambiental × casos de doença).

## Território na Atenção Primária

### Hierarquia territorial

```
Município (Porto Alegre)
└── Distritos Sanitários
    └── Unidades de Saúde (US)
        └── Áreas de atuação das equipes ESF
            └── Microáreas (responsabilidade do ACS)
```

### O papel do ACS/ACE no território

- **ACS:** Conhece cada domicílio de sua microárea. Faz visitas, cadastra famílias, identifica problemas. É a **principal fonte de dados do território**.
- **ACE:** Atua no controle de vetores e vigilância ambiental. Compartilha o mesmo território do ACS.

A proposta do Ministério da Saúde é **unificar o território do ACS e ACE**, integrando suas ações e dados.

### Mapa inteligente / Mapa falante

Ferramenta que vai além do mapa descritivo:
- **Analógico:** Mapa desenhado pela equipe em papel, com marcações de condições relevantes (ícones para gestantes, acamados, áreas de risco, etc.).
- **Digital:** O mesmo conceito, mas com dados dinâmicos, camadas interativas e atualização automática a partir de bancos de dados.

O **mapa falante** é assim chamado porque "fala" sobre o território — conta histórias sobre quem mora ali, quais são os problemas, onde estão os recursos.

## Fontes de dados para geoprocessamento em saúde

| Fonte | Tipo de dados | Descrição |
|-------|---------------|-----------|
| **ACS/ACE** | Primários (coleta direta) | Dados de visitas domiciliares, cadastros, observação do território |
| **E-SUS APS** | Secundários (sistema) | Cadastros de cidadãos, atendimentos, condições de saúde |
| **SINAN** | Secundários (sistema) | Agravos de notificação compulsória (dengue, TB, etc.) |
| **Planilhas locais** | Primários (US) | Monitoramento interno da unidade de saúde |
| **IBGE** | Secundários (censo) | Dados demográficos e socioeconômicos |
| **Prefeitura** | Secundários (municipal) | Malha viária, limites, equipamentos públicos |

## Desafios do georreferenciamento

1. **Qualidade dos endereços:** Muitos endereços são informais, duplicados ou inexistentes nos cadastros oficiais. Este é o problema nº 1 do GAT 4.
2. **Atualização:** Dados ficam desatualizados rapidamente (mudanças, óbitos, nascimentos).
3. **Integração de sistemas:** Dados estão em sistemas diferentes que não conversam entre si.
4. **Letramento digital:** Profissionais de saúde podem não ter familiaridade com ferramentas digitais.
5. **Privacidade:** Dados de saúde são sensíveis e exigem cuidados éticos e legais (LGPD).
