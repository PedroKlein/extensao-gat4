# As 3 Soluções Digitais Propostas

> Detalhamento das soluções digitais que o GAT 4 pretende desenvolver, com base nas discussões das reuniões e no documento oficial do PET-Saúde Digital.

## Escopo oficial (PET-Saúde Digital, Ação 8.4)

Conforme o [documento do programa](extension-program.md), a missão oficial do GAT 4 é:

> Atualização e qualificação do mapa georreferenciado da SMS (Geosaúde), integrando dados demográficos, epidemiológicos, assistenciais e territoriais. A ferramenta será interativa, facilitando o acesso por usuários, profissionais e comunidade acadêmica.

A meta de maturidade tecnológica é **TRL 3** (prova de conceito experimental validada), com desenvolvimento seguindo **metodologias ágeis** e **abordagens participativas**.

---

---

## Solução 1: Mapa Inteligente Georreferenciado

### Visão geral

Um mapa digital interativo com camadas sobreponíveis que georreferencie condições de saúde, indicadores e pontos relevantes sobre o território das equipes de ESF da US Moab Caldas.

Diferente do Geosaúde (que mostra apenas limites territoriais e unidades de saúde), este mapa seria **dinâmico** e **alimentado por dados de saúde reais** das equipes.

### Status: Em desenvolvimento (levantamento de requisitos)

### Requisitos levantados

#### Dados a serem georreferenciados (levantados com a Equipe 4 em 06/04/2026)

**Organização de visitas domiciliares:**
- Pacientes acamados
- Atualização contínua das informações

**Condições e agravos de saúde:**
- Casos de tuberculose
- Doenças transmissíveis
- Doenças crônicas
- Gestantes

**Gestão e acompanhamento:**
- Cadastros desatualizados
- Monitoramento de retirada de insumos

**Vigilância:**
- Notificação de casos de violência

**Organização do território:**
- Locais relevantes: escolas, espaços de lazer, igrejas, áreas de risco/periculosidade

#### Funcionalidades desejadas

- **Visualização em camadas** — diferentes tipos de informação sobrepostos, ativáveis/desativáveis.
- **Identificação de demanda** por visitas domiciliares.
- **Solicitação de visitas** domiciliares.
- **Camada de acompanhamento obrigatório** — pessoas com condições que exigem acompanhamento periódico, com aprazamento.

### Fontes de dados previstas

| Fonte | Descrição |
|-------|-----------|
| Planilha de monitoramento (US Moab) | Dados internos da unidade |
| E-SUS APS | Cadastros, atendimentos, condições de saúde |
| Planilhas dos ACS | Dados coletados diretamente no território |

### Desafios técnicos

1. **Uniformização de endereços:**
   - Muitos endereços têm mais de um nome ou não existem oficialmente.
   - Necessário definir parâmetro oficial (Correios, concessionárias, coordenadas GPS).
   - O mapa deve suportar **sinônimos** (nome oficial + nome popular).
   - Possibilidade de usar **coordenadas GPS** coletadas em visita domiciliar para endereços dúbios.

2. **Dinamicidade territorial:**
   - Limites das USs mudam com frequência.
   - Pessoas mudam de endereço, morrem, nascem.
   - O mapa precisa de estratégia de **atualização periódica**.

3. **Letramento digital:**
   - Profissionais podem não estar familiarizados com ferramentas digitais.
   - Sugerido curso no **EducaPOA**.
   - Necessário que a ferramenta seja **simples e acessível**.

4. **Privacidade:**
   - Dados de saúde são sensíveis (LGPD).
   - Controle de acesso por equipe/microárea.

### Próximas ações (a partir de 16/04/2026)

- [ ] Estudantes preenchem planilhas de condições de saúde com aprazamento (prazo: 23/04).
- [ ] Equipe da Moab lista as principais condições a georreferenciar.
- [ ] Planilhas entregues à equipe de computação para avaliação técnica.
- [ ] Extensionistas de computação se integram ao GAT.
- [ ] Possível apresentação na reunião ampliada de equipes (07/05).

---

## Solução 2: Integração Intersetorial

### Visão geral

Georreferenciamento que integre a rede de saúde com a **rede de proteção social** e outros serviços públicos do território, permitindo visualizar num mesmo mapa:

- Unidades de Saúde
- CRAS, CREAS
- Escolas
- Espaços de lazer
- Igrejas e instituições comunitárias
- Áreas de risco

### Status: Em fase de exploração

### Referências

- Daniele ficou responsável por compartilhar o **mapa da rede de proteção social de POA**.
- O [Mapa Social do MDS](https://mapa-social.mds.gov.br/) lista dispositivos sociais em todo o Brasil.
- O [ObservaPOA](https://prefeitura.poa.br/smpg/observapoa/mapas) reúne mapas temáticos da prefeitura, incluindo assistência social.

### Potencial

Permitiria às equipes de saúde:
- Encaminhar pacientes para serviços de assistência social próximos.
- Mapear a rede de apoio disponível para cada microárea.
- Planejar ações intersetoriais com base em dados geográficos.

---

## Solução 3: Vigilância Automatizada

### Visão geral

Automatização de ações de vigilância epidemiológica com base em georreferenciamento. O exemplo principal discutido:

> Enviar mensagens para os telefones cadastrados de pessoas residentes em um **raio de 100 metros** de um domicílio onde foi identificado um caso de dengue.

### Status: Conceitual (apenas discutido brevemente)

### Conceito técnico

1. Um caso de agravo (ex: dengue) é registrado com localização georreferenciada.
2. O sistema identifica todos os domicílios cadastrados dentro de um raio definido.
3. Mensagens automáticas são enviadas (SMS, WhatsApp?) com orientações de prevenção.

### Desafios

- Requer base de dados georreferenciada e atualizada de domicílios.
- Requer integração com dados de agravos (SINAN / E-SUS).
- Questões éticas e legais (LGPD) sobre envio de mensagens.
- Requer infraestrutura de envio de mensagens (API de SMS/WhatsApp).
- Depende da implementação bem-sucedida da Solução 1 como base.

---

## Relação entre as soluções

```
Solução 1 (Mapa Inteligente)
    ↓ Base de dados georreferenciada
    ├── Solução 2 (Integração Intersetorial)
    │   Adiciona camadas de serviços sociais
    │
    └── Solução 3 (Vigilância Automatizada)
        Usa a base para ações automáticas
```

A **Solução 1 é pré-requisito** para as demais. Sem uma base georreferenciada confiável dos domicílios e condições de saúde, as soluções 2 e 3 não podem funcionar.
