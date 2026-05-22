# Ferramentas e Plataformas Existentes

> Levantamento das ferramentas de georreferenciamento e dados de saúde já disponíveis em Porto Alegre e no Brasil, relevantes para o projeto GAT 4.

---

## Ferramentas Municipais (Porto Alegre)

### Geosaúde

O mapa oficial de territorialização da saúde em Porto Alegre.

| Aspecto | Detalhe |
|---------|---------|
| **Plataforma** | Google My Maps |
| **Mantido por** | CGE-DAPS (Coordenadoria de Gestão Estratégica) |
| **Camadas** | 7 camadas (territórios de US, locais de atendimento, distritos sanitários, gerências distritais, ROPs, bairros, serviços) |
| **Funcionalidades** | Busca por endereço/US/bairro, visualização de camadas, informações por clique |
| **Limitações** | Estático (sem dados dinâmicos de saúde), depende de Google My Maps, sem API para integração, edição centralizada na CGE-DAPS |

- 🔗 [Mapa interativo](https://www.google.com/maps/d/u/0/viewer?mid=119gTW9fF1HCImSAMSrlHrOJkdqE&shorturl=1&ll=-30.13539541566424%2C-51.069320507717975&z=11)
- 🔗 [Planilha de endereços](https://docs.google.com/spreadsheets/d/1IodJNyUh8LqWEG7w9TRbn0Kczqs4XvhQAdppfMnd08E/)
- 🔗 [Página oficial (BVAPS)](https://bvaps.portoalegre.rs.gov.br/territorializacao)

#### Como o Geosaúde é usado

1. Na legenda (à esquerda), habilite/desabilite camadas clicando nos marcadores.
2. Use o mouse para navegar e dar zoom.
3. Clique nos ícones ou áreas para obter informações.
4. Use a lupa (canto superior esquerdo) para buscar endereços, USs, etc.

A CGE-DAPS também oferece **apoio para criar mapas individuais** por US via My Maps — com visualização de abrangência de equipes, marcação de acamados, gestantes e outros.

---

### GeoPoa (WebGIS) — com API REST pública

Plataforma GIS da Prefeitura de Porto Alegre, mantida pela SMAMUS. **Possui uma API REST acessível publicamente.**

| Aspecto | Detalhe |
|---------|---------|
| **Plataforma** | ArcGIS Server 11.4 + Experience Builder |
| **Mantido por** | SMAMUS |
| **API REST** | `https://gis-smamus.portoalegre.rs.gov.br/server/rest/services` |
| **Formatos** | MapServer, FeatureServer (JSON, GeoJSON) |

#### Camadas disponíveis via API

| Serviço | Descrição |
|---------|-----------|
| `01_PUBLICACOES/bairros_2016` | **Limites oficiais dos 94 bairros** (Lei 12.112/2016), com coordenadas EPSG:31982 |
| `00_BASES` | Dados cartográficos base (requer autenticação) |
| `Hosted/Áreas_Contaminadas` | Áreas contaminadas do município |
| `inundacoes` | Dados de inundações |
| `pracas_parques_DI` | Praças e parques |
| `PDDUA_MIL1` | Plano Diretor |
| `lotes_fiscais_perimetro4d` | Lotes fiscais |

#### Downloads disponíveis

A SMAMUS disponibiliza para download (PDF, Shapefile, DWG):
- Bairros
- **Eixo de Logradouros** (todas as ruas)
- Regiões do Orçamento Participativo (ROP)
- Zonas do Plano Diretor
- APPs (Áreas de Preservação Permanente)
- Regiões de Planejamento

- 🔗 [GeoPoa WebGIS](https://gis-smamus.portoalegre.rs.gov.br/webgis/geopoa/)
- 🔗 [GeoPoa Portal](https://gis-smamus.portoalegre.rs.gov.br/portal/apps/experiencebuilder/experience/?draft=true&id=d47b6009f840427295d58fc4946c0fdb&page=IN%C3%8DCIO)
- 🔗 [Catálogo de Download](https://gis-smamus.portoalegre.rs.gov.br/portal/apps/experiencebuilder/experience/?draft=true&id=d47b6009f840427295d58fc4946c0fdb&page=page_6)
- 🔗 [ArcGIS REST Services](https://gis-smamus.portoalegre.rs.gov.br/server/rest/services)
- 🔗 [Mapas digitais da SMAMUS](https://prefeitura.poa.br/carta-de-servicos/mapas-digitais-da-smamus)

> **Relevância para o GAT 4:** A API REST pode ser consumida diretamente por uma aplicação web (Leaflet/OpenLayers) para obter os limites de bairros e eixos viários como base cartográfica, sem depender de tiles proprietários.

---

### BVAPS — Biblioteca Virtual da APS

Repositório oficial digital da SMS Porto Alegre para documentos, protocolos, fluxos e ferramentas da rede de APS.

| Seção | Conteúdo |
|-------|----------|
| Territorialização | Documentos do CMTS, links ao Geosaúde, mapas por US |
| Enfermagem | POPs, regimentos, protocolos |
| Assistência Farmacêutica | Formulários, portarias |
| CAIST | Tuberculose, IST/AIDS, Hepatites Virais |
| PACK Brasil | Ferramenta de manejo clínico baseado em evidências |

- 🔗 [BVAPS](https://bvaps.portoalegre.rs.gov.br/)
- 🔗 [Territorialização (BVAPS)](https://bvaps.portoalegre.rs.gov.br/territorializacao)

---

### ObservaPOA

Portal do Observatório da Cidade de Porto Alegre que reúne informações por regiões e bairros.

Dados disponíveis:
- Setores censitários (Censo 2022) — SHP
- População por bairro (Censo 2022) — XLSX, CSV, PDF
- Áreas de vulnerabilidade
- Áreas de alagamento
- Mapas temáticos de assistência social
- Navegação interativa por ROPs e bairros

- 🔗 [ObservaPOA - Mapas](https://prefeitura.poa.br/smpg/observapoa/mapas)
- 🔗 [Mapa por Regiões (ROPs)](https://prefeitura.poa.br/external-tools/observapoa_regioes.php)
- 🔗 [Mapa por Bairros](https://prefeitura.poa.br/external-tools/observapoa_bairros.php)

---

### Dados Abertos POA

Portal de dados abertos da prefeitura com 55 conjuntos de dados.

| Dados de saúde | Formato |
|----------------|---------|
| **GERCON** — Gerenciamento de consultas | PDF, CSV |
| **GERINT** — Gerenciamento de internações | PDF, CSV |
| **SINAN** — Agravos de notificação | CSV, PDF |
| **Eixos de Logradouros** | ZIP (Shapefile) |

- 🔗 [Dados Abertos — Saúde](https://dados.portoalegre.rs.gov.br/group/saude)
- 🔗 [Dados Abertos POA (geral)](https://dadosabertos.poa.br/)

---

## Ferramentas Nacionais

### E-SUS APS

Estratégia do Ministério da Saúde para informatizar a Atenção Primária.

| Módulo | Descrição |
|--------|-----------|
| **PEC** | Prontuário Eletrônico do Cidadão — sistema principal de registro |
| **CDS** | Coleta de Dados Simplificada |
| **e-SUS Território** | App mobile (v5.1.2) para ACS/ACE — cadastro domiciliar com GPS |
| **Data Warehouse (DW)** | Repositório SQL para extração avançada de dados |
| **API de Integração** | API para transferência de dados entre sistemas |

#### App e-SUS Território (detalhado)

O aplicativo (tablet e smartphone) permite:
- **Cadastro Domiciliar com coordenadas GPS** — coleta automática de localização
- **Cadastro Individual** — registro de condições de saúde (doenças crônicas, deficiências, TEA, etc.)
- **Visita Domiciliar** — registro rápido em campo
- **Sincronização** com o PEC via WiFi

> **Relevância para o GAT 4:** O e-SUS já coleta GPS. O desafio é extrair esses dados e visualizá-los geograficamente. O Data Warehouse e a API de Integração são os caminhos técnicos para isso.

- 🔗 [E-SUS APS](https://sisaps.saude.gov.br/esus/index.html)
- 🔗 [Manual e-SUS Território](https://sisaps.saude.gov.br/sistemas/esusaps/docs/manual/TERRITORIO/)
- 🔗 [DW e-SUS APS](https://sisaps.saude.gov.br/sistemas/esusaps/docs/manual/APOIO/dw_e_sus_aps)
- 🔗 [API de Integração (doc)](https://integracao.esusaps.bridge.ufsc.tech/pdf.html)
- 🔗 [App no Google Play](https://play.google.com/store/apps/details?hl=pt_BR&id=br.gov.saude.acs)

---

### TelessaúdeRS-UFRGS

Núcleo técnico-científico da UFRGS em parceria com SES/RS, referência nacional em inovação desde 2007.

| Serviço | Descrição |
|---------|-----------|
| **Teleconsultorias** | Suporte remoto a profissionais da APS |
| **Telediagnóstico** | Laudos remotos de exames |
| **RegulaSUS** | App para protocolos de encaminhamento (redução de filas) |
| **Teleducação** | Capacitação online |
| **Gerenciamento GERCON** | Desde 2024, TelessaúdeRS gerencia consultas especializadas — reduziu 26.600 pacientes da fila em 6 meses |

- 🔗 [TelessaúdeRS (SES)](https://saude.rs.gov.br/telessauders)
- 🔗 [Artigo: 18 anos de TelessaúdeRS (2026)](https://www.scielosp.org/article/csc/2026.v31n4/e21482024/en/)

---

### Mapa Social (MDS)

Mapa do Ministério do Desenvolvimento Social com dispositivos sociais (CRAS, CREAS, postos de cadastramento, etc.).

- 🔗 [Mapa Social](https://mapa-social.mds.gov.br/)

---

## Projetos similares (referências de implementação)

Projetos que já implementaram o que o GAT 4 pretende fazer:

### PICAPS — Plataforma de Inteligência Cooperativa com APS (Fiocruz)

Plataforma nacional da Fiocruz com funcionalidades de mapa interativo para APS:
- Camadas: microáreas ACS, pontos estratégicos, riscos, vulnerabilidades, equipamentos sociais
- Funcionalidades: filtros por área, heatmap, sobreposição de imagens, medição de distâncias
- API e app mobile integrados
- Usa a plataforma ViconSAGA como base tecnológica

- 🔗 [PICAPS 2025](https://www.viconsaga.com.br/picaps2025)
- 🔗 [Artigo sobre PICAPS (Fiocruz)](https://arca.fiocruz.br/items/d71b4c58-dc96-4597-a467-8ea93560f655)

### ACS Mapeia (Salvador-BA, via ViconSAGA)

Mapa digital onde ACS registram:
- Microáreas
- Pontos com esgoto a céu aberto
- Acúmulo de lixo
- Alagamentos
- Equipamentos sociocomunitários
- Comorbidades por rua
- Serviços de saúde

- 🔗 [ACS SSA Mapeia](https://www.viconsaga.com.br/acsssamapeiageral)
- 🔗 [P4 ACS Mapeia Digital](https://www.viconsaga.com.br/p4plataformaacsmapeiadigital)

### Mapa Vivo / Mapa Falado Digital (São José dos Pinhais/PR)

Usou Google My Maps para criar mapas inteligentes de UBS com:
- Área total da UBS
- Territórios das 7 ESFs
- Camadas de vulnerabilidades e potencialidades
- Marcadores personalizados

Artigo de referência: [Uso de tecnologias para territorialização na APS](http://revistastrictosensu.com.br/ojs/index.php/rss/article/view/161)

### Salus (LAIS/UFRN)

Sistema para monitoramento de agravos na APS e vigilância epidemiológica:
- Monitoramento inteligente de sífilis, tuberculose
- Diagnóstico interativo
- Esquemas de tratamento
- Visualização geográfica de casos

- 🔗 [Salus](https://salus.treinamento.lais.ufrn.br/)

---

## Ferramentas de apoio / possibilidades técnicas

### Google My Maps

Usado atualmente pelo Geosaúde. A CGE-DAPS oferece apoio para criar mapas individuais por US.

**Prós:** Simples, gratuito, familiar para as equipes.
**Contras:** Limitado em funcionalidades GIS, sem automação, sem API robusta, dados no Google, max 10 camadas, 2000 pontos por camada.

### QGIS

Software GIS open-source profissional. Alternativa livre ao ArcGIS.

**Prós:** Poderoso, gratuito, extensível, suporte a múltiplos formatos, consome ArcGIS REST.
**Contras:** Desktop (não web), curva de aprendizado.

### Leaflet / OpenLayers

Bibliotecas JavaScript para mapas web interativos.

**Prós:** Open-source, leve, customizável, consome WMS/WFS/REST, enorme comunidade.
**Contras:** Requer desenvolvimento de software.

### OpenStreetMap (OSM)

Base cartográfica aberta e colaborativa. Usável como mapa base (tiles gratuitos).

### ViconSAGA

Plataforma usada pelo PICAPS e ACS Mapeia. Oferece:
- Mapeamento participativo
- API e mobile
- Heatmaps
- Filtros por área
- Compartilhamento em redes sociais

---

## Comparativo de relevância para o GAT 4

| Ferramenta | Papel no projeto |
|------------|------------------|
| **Geosaúde** | Referência oficial de territórios — complementar, não substituir |
| **GeoPoa REST API** | Base cartográfica programática (bairros, logradouros) |
| **E-SUS APS (DW + API)** | Principal fonte de dados de saúde georreferenciados |
| **Planilhas locais (Moab)** | Dados complementares da US, mais ágeis |
| **Dados Abertos POA** | Dados secundários (SINAN, consultas, logradouros) |
| **ObservaPOA** | Contexto social e demográfico por bairro/ROP |
| **Mapa Social** | Rede de proteção social (CRAS, CREAS) para Solução 2 |
| **PICAPS / ACS Mapeia** | Referências de implementação — validam o conceito |
| **TelessaúdeRS** | Parceiro técnico com expertise em soluções digitais para saúde |
