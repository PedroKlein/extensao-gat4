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
| **Camadas** | 7 camadas (territórios de US, locais de atendimento, etc.) |
| **Funcionalidades** | Busca por endereço/US/bairro, visualização de camadas, informações por clique |
| **Limitações** | Estático (sem dados dinâmicos de saúde), depende de Google My Maps, sem API para integração |

- 🔗 [Mapa interativo](https://www.google.com/maps/d/u/0/viewer?mid=119gTW9fF1HCImSAMSrlHrOJkdqE&shorturl=1&ll=-30.13539541566424%2C-51.069320507717975&z=11)
- 🔗 [Planilha de endereços](https://docs.google.com/spreadsheets/d/1IodJNyUh8LqWEG7w9TRbn0Kczqs4XvhQAdppfMnd08E/)
- 🔗 [Página oficial](https://prefeitura.poa.br/sms/onde-esta-o-aedes/mapas)

---

### GeoPoa (WebGIS)

Plataforma GIS da Prefeitura de Porto Alegre, mantida pela SMAMUS. Abrange dados urbanos e ambientais (não é específico de saúde).

| Aspecto | Detalhe |
|---------|---------|
| **Plataforma** | ArcGIS Experience Builder / WebGIS |
| **Mantido por** | SMAMUS |
| **Dados** | Dados urbanos, ambientais, infraestrutura |
| **Relevância para o GAT 4** | Potencial fonte de dados cartográficos e ambientais |

- 🔗 [GeoPoa WebGIS](https://gis-smamus.portoalegre.rs.gov.br/webgis/geopoa/)
- 🔗 [GeoPoa Portal](https://gis-smamus.portoalegre.rs.gov.br/portal/apps/experiencebuilder/experience/?draft=true&id=d47b6009f840427295d58fc4946c0fdb&page=IN%C3%8DCIO)

---

### ObservaPOA

Portal que reúne mapas temáticos da prefeitura, incluindo mapas da assistência social.

- 🔗 [ObservaPOA - Mapas](https://prefeitura.poa.br/smpg/observapoa/mapas)

---

### Dados Abertos POA

Portal de dados abertos da prefeitura com conjuntos de dados de saúde:

| Sistema | Descrição |
|---------|-----------|
| **GERCON** | Gerenciamento de consultas |
| **GERINT** | Gerenciamento de internações |
| **SINAN** | Agravos de notificação |

- 🔗 [Dados Abertos — Saúde](https://dados.portoalegre.rs.gov.br/group/saude)

---

## Ferramentas Nacionais

### E-SUS APS

Estratégia do Ministério da Saúde para informatizar a Atenção Primária. Sistema principal de registro de informações da APS.

| Aspecto | Detalhe |
|---------|---------|
| **Módulos** | PEC (Prontuário Eletrônico do Cidadão), CDS (Coleta de Dados Simplificada), e-SUS Território (app mobile) |
| **Dados** | Cadastros de cidadãos, atendimentos, condições de saúde, visitas domiciliares |
| **Relevância** | Fonte primária de dados de saúde para alimentar os mapas do GAT 4 |
| **Georreferenciamento** | O app e-SUS Território permite coleta de coordenadas |

- 🔗 [E-SUS APS](https://sisaps.saude.gov.br/esus/index.html)

### App e-SUS Território

Aplicativo mobile específico para gestão territorial:
- Cadastro de cidadãos com geolocalização.
- Registro de visitas domiciliares.
- Visualização da situação de saúde do território.

> **Relevância para o GAT 4:** Pode servir tanto como fonte de dados quanto como referência de funcionalidades.

---

### Mapa Social (MDS)

Mapa do Ministério do Desenvolvimento Social com dispositivos sociais (CRAS, CREAS, postos de cadastramento, etc.).

- 🔗 [Mapa Social](https://mapa-social.mds.gov.br/)

> **Relevância para o GAT 4:** Útil para a Solução 2 (integração intersetorial).

---

## Ferramentas de apoio / possibilidades técnicas

### Google My Maps

Usado atualmente pelo Geosaúde. A CGE-DAPS oferece apoio para criar mapas individuais por US via My Maps.

**Prós:** Simples de usar, gratuito, familiar para as equipes.
**Contras:** Limitado em funcionalidades GIS, sem automação, sem API robusta, dados ficam no Google.

### QGIS

Software GIS open-source profissional. Alternativa livre ao ArcGIS.

**Prós:** Poderoso, gratuito, extensível via plugins, suporte a múltiplos formatos.
**Contras:** Curva de aprendizado, não é uma aplicação web (desktop).

### Leaflet / OpenLayers

Bibliotecas JavaScript para criação de mapas web interativos.

**Prós:** Open-source, leve, customizável, permite criar aplicações web com mapas.
**Contras:** Requer desenvolvimento de software.

### OpenStreetMap (OSM)

Base cartográfica aberta e colaborativa. Pode ser usada como mapa base para soluções customizadas.

---

## Comparativo de relevância para o GAT 4

| Ferramenta | Papel no projeto |
|------------|------------------|
| **Geosaúde** | Referência oficial de territórios — dados a serem respeitados/integrados |
| **E-SUS APS** | Principal fonte de dados de saúde dos pacientes |
| **Planilhas locais (Moab)** | Dados complementares da US, mais ágeis de atualizar |
| **Dados Abertos POA** | Dados secundários (SINAN, consultas, internações) |
| **GeoPoa** | Base cartográfica e dados urbanos/ambientais |
| **ObservaPOA** | Contexto social e mapas temáticos |
| **Mapa Social** | Rede de proteção social (CRAS, CREAS) para integração intersetorial |
