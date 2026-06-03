# AI Agent Instructions — extensao-gat4

## What is this repo?

This is the working repository for **GAT 4** (Grupo de Ação Territorial 4), a university extension group within the **PET-Saúde Digital** program (UFRGS + SMS Porto Alegre). The group builds **georeferencing digital solutions for Primary Health Care** in Porto Alegre, Brazil.

Read `docs/README.md` for a full project overview. Read `docs/context/extension-program.md` for how GAT 4 fits in the larger PET-Saúde Digital program (7 groups total).

## Language

All documentation and user-facing content is in **Brazilian Portuguese**. Code comments, commit messages, and technical docs (READMEs in code dirs, API docs) may be in English or Portuguese — follow whatever is already established in the file being edited.

## Repo structure

```
agents.md                              # ← You are here. Agent instructions.
justfile                               # Task runner (just build, just view, just clean)
scripts/
└── build.sh                           # Builds HTML site from .md files
docs/
├── README.md                          # Project overview (start here)
├── pet-saude-digital.md               # Faithful transcription of the official PET-Saúde Digital PDF
├── reports.md                         # Faithful transcription of all GAT 4 meeting reports
├── glossary.md                        # Glossary of acronyms and domain terms
├── references.md                      # All links, legislation, tools, contacts
├── context/                           # Interpreted knowledge files (analysis, not transcription)
│   ├── extension-program.md           # Analysis of the PET-Saúde Digital program
│   ├── digital-solutions.md           # The 3 proposed digital solutions (requirements, status)
│   ├── territorialization.md          # How health territorialization works in Porto Alegre
│   ├── geoprocessing-health.md        # Geoprocessing concepts applied to public health
│   └── tools-and-platforms.md         # Existing tools (Geosaúde, GeoPoa, E-SUS, etc.)
├── gestantes.csv                      # Source spreadsheet: pregnancy tracking
├── gestantes-expostas.csv             # Source spreadsheet: exposed patients follow-up
├── site/                              # Generated HTML site (gitignored, run ./build.sh)
└── *.pdf                              # Original source documents
prototypes/
├── index.html                         # Landing page for GitHub Pages (lists all PoCs)
├── poc-01/                            # PoC: General territorial monitoring map
└── mapa-gestantes/                    # PoC: Pregnancy tracking map (Vite + TS + Leaflet + Tailwind)
.github/workflows/
└── deploy.yml                         # Builds and deploys prototypes to GitHub Pages
```

## Documentation conventions

### Two types of docs

1. **Transcriptions** (root of `docs/`): Faithful markdown conversions of source documents. Preserve original structure, section numbering, and wording. Only improve formatting (headings, lists, tables, links). Files: `pet-saude-digital.md`, `reports.md`.

2. **Knowledge files** (`docs/context/`): Interpreted, reorganized, cross-referenced analysis. These add value beyond the source by connecting information, adding context, and highlighting what matters for GAT 4. These may editorialize.

### When adding new source material

- Create a **transcription** first (clean markdown of the original).
- Then update relevant **knowledge files** in `docs/context/` with new insights.
- Update `docs/glossary.md` with any new acronyms or terms.
- Update `docs/references.md` with any new links.
- Update `docs/README.md` if the project structure or timeline changes.

### HTML site

The `docs/site/` directory is generated and gitignored. After changing any `.md` file:

```bash
just build        # regenerate HTML
just view         # build + open in browser
just clean        # delete generated site
```

If you add a **new** `.md` file to the site, you must also edit `scripts/build.sh` to add it to the `MD_FILES`, `SECTION_IDS`, `SECTION_LABELS`, `SECTION_ICONS`, and `SECTION_GROUPS` arrays (all must stay in sync, same order, same length).

### Markdown style

- Use ATX headings (`#`, `##`, `###`).
- Use tables for structured data (people, tools, comparisons).
- Use blockquotes (`>`) for official quotes from documents or highlighted notes.
- Use `**bold**` for key terms on first mention.
- Link between docs using relative paths (e.g., `[glossary](glossary.md)`).
- Keep lines at natural paragraph length (no hard wrapping).

## Domain knowledge

Read these files to understand the project domain before making changes:

| What you need to know | Read this |
|---|---|
| What is GAT 4 and what are we building? | `docs/README.md` |
| The official program scope and all 7 GATs | `docs/context/extension-program.md` |
| What the 3 digital solutions are | `docs/context/digital-solutions.md` |
| Meeting history and decisions | `docs/reports.md` |
| How territorialization works in Porto Alegre | `docs/context/territorialization.md` |
| Acronyms (ACS, ESF, E-SUS, etc.) | `docs/glossary.md` |
| What tools already exist | `docs/context/tools-and-platforms.md` |

### Key domain terms (quick reference)

- **ACS** — Agente Comunitário de Saúde (community health agent, does home visits)
- **ACE** — Agente de Combate a Endemias (vector control agent)
- **ESF** — Estratégia Saúde da Família (family health teams with defined territories)
- **US** — Unidade de Saúde (health unit)
- **APS** — Atenção Primária à Saúde (primary health care)
- **E-SUS** — National health IT system for primary care
- **Geosaúde** — Porto Alegre's official territory map (Google My Maps based)
- **US Moab Caldas** — The pilot health unit for this project
- **Microárea** — Subdivision of territory assigned to one ACS

### Key people

| Role | Name | Notes |
|---|---|---|
| Prof. (coordenadora) | Fernanda | Leads the academic side |
| Prof. | Netto | Technical/GIS expertise |
| Tutor | Thiago | Guides the student monitors |
| Preceptor | Lucas | Health professional at US Moab |
| Preceptora | Leila | Health professional, coordinates with ESF teams |
| Monitor (computação) | Guilherme | Computer engineering student, joined 16/04/2026 |
| Monitores (saúde) | Bruno, Vinicio, Vinicius, Daniele, Roberta, Ketlin | Health students |

## PoC development

Two prototypes have been built and are deployed at [pedroklein.github.io/extensao-gat4](https://pedroklein.github.io/extensao-gat4/).

### Current prototypes

| Prototype | Stack | Description |
|-----------|-------|-------------|
| `prototypes/poc-01/` | Vanilla HTML/JS + Leaflet | General territorial map with multiple health condition layers, social equipment, urgency filters |
| `prototypes/mapa-gestantes/` | Vite + TypeScript + Leaflet + Tailwind | Pregnancy tracking with urgency scoring, walking routes, heatmap, ACS microáreas, print |

### Architecture constraints

- Solutions must be **collaborative and open-source** (PET-Saúde requirement).
- Target a minimum **TRL 3** (Technology Readiness Level = validated proof of concept).
- Use **participatory design** and **agile methodology** (per the official project document).
- The tool must be **simple and accessible** — ACS users may have limited digital literacy.
- **LGPD compliance** is mandatory — health data is sensitive. Never store identifiable patient data without proper access controls.
- Consider **offline capability** — health units may have unreliable internet.

### Tech stack (chosen)

The mapa-gestantes prototype uses:

- **Vite** as bundler (builds to static files for GitHub Pages)
- **TypeScript** for type safety on data models and urgency logic
- **Leaflet** + leaflet.heat + leaflet.markercluster for maps
- **Tailwind CSS** for styling
- **faker-js** (pt_BR locale) for synthetic data generation
- **OSRM** public API for walking route calculation
- **OpenStreetMap** tiles (light) + **CartoDB Dark Matter** (heatmap mode)

The poc-01 prototype uses vanilla HTML/JS/CSS with Leaflet loaded from CDN.

Both produce static files that work offline after initial load (only map tiles require network).

### Code organization

```
extensao-gat4/
├── agents.md
├── README.md
├── justfile
├── scripts/               # Build and utility scripts
├── docs/                  # Documentation
├── prototypes/            # Working prototypes
│   ├── index.html         # GitHub Pages landing page
│   ├── poc-01/            # General territorial map
│   └── mapa-gestantes/    # Pregnancy tracking (Vite project)
│       ├── src/           # Application source
│       ├── scripts/       # Data generation + screenshot tools
│       ├── SPEC.md        # Functional specification
│       └── PERGUNTAS-EQUIPE.md  # Questions for health team validation
└── .github/workflows/     # CI/CD
```

### Data handling rules

- **NEVER** commit real patient data, names, addresses, or health conditions.
- Use **anonymized/synthetic data** for development and testing.
- If sample spreadsheets are provided by the health team, strip all PII before committing.
- Document the data schema (columns, types, meaning) in a `data/README.md`.

### Testing

- PoCs should have at minimum **manual test scripts** documenting how to verify they work.
- As solutions mature, add automated tests.
- Always test with realistic (but anonymized) data volumes — ACS microáreas typically have 150–750 people.
