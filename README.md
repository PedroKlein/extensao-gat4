# GAT 4 — Georreferenciamento em Saúde

Repositório do **Grupo de Ação Territorial 4**, parte do programa de extensão [PET-Saúde Digital](docs/context/extension-program.md) da UFRGS em parceria com a SMS Porto Alegre.

O grupo desenvolve soluções digitais de georreferenciamento para a Atenção Primária à Saúde. A unidade piloto é a **US Moab Caldas** (Bairro Santa Tereza, Porto Alegre/RS).

## Protótipos

Provas de conceito funcionais com dados sintéticos. Nenhum dado real de pacientes é utilizado.

| Protótipo | Descrição | Status |
|-----------|-----------|--------|
| [Mapa Territorial](prototypes/poc-01/) | Mapa geral do território com camadas por condição de saúde, equipamentos sociais e filtros por microárea | Funcional |
| [Mapa Gestantes](prototypes/mapa-gestantes/) | Acompanhamento de gestantes e puérperas com score de urgência, rota até paciente, ficha detalhada e mapa de calor | Funcional |

**Demo online:** [pedroklein.github.io/extensao-gat4](https://pedroklein.github.io/extensao-gat4/)

## Documentação

A documentação do projeto está em [`docs/`](docs/README.md):

- [Visão geral do projeto](docs/README.md)
- [Programa PET-Saúde Digital (transcrição)](docs/pet-saude-digital.md)
- [Relatos de reuniões](docs/reports.md)
- [Glossário de siglas](docs/glossary.md)
- [Referências e links](docs/references.md)
- [Soluções digitais propostas](docs/context/digital-solutions.md)
- [Territorialização em Porto Alegre](docs/context/territorialization.md)
- [Ferramentas existentes](docs/context/tools-and-platforms.md)

## Estrutura do repositório

```
agents.md               # Instruções para agentes de IA
docs/                   # Documentação do projeto
  ├── context/          # Análises e interpretações
  ├── *.md              # Transcrições fiéis de documentos-fonte
  └── *.pdf             # Documentos originais
prototypes/             # Provas de conceito
  ├── poc-01/           # Mapa territorial geral
  └── mapa-gestantes/   # Mapa de gestantes (Vite + TypeScript + Leaflet)
scripts/                # Scripts de build do site HTML
.github/workflows/      # Deploy automático para GitHub Pages
```

## Equipe

| Papel | Nome |
|-------|------|
| Professora coordenadora | Fernanda |
| Professor | Netto |
| Tutor | Thiago |
| Preceptor (US Moab) | Lucas |
| Preceptora | Leila |
| Monitor (computação) | Guilherme |
| Monitores (saúde) | Bruno, Vinicio, Vinicius, Daniele, Roberta, Ketlin |

## Licença

Projeto acadêmico de extensão universitária. Código aberto para fins educacionais e de saúde pública.
