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
├── site/                              # Generated HTML site (gitignored, run ./build.sh)
└── *.pdf                              # Original source documents
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

## Future: PoC development

When code (prototypes, proofs of concept) is added to this repo:

### Architecture constraints

- Solutions must be **collaborative and open-source** (PET-Saúde requirement).
- Target a minimum **TRL 3** (Technology Readiness Level = validated proof of concept).
- Use **participatory design** and **agile methodology** (per the official project document).
- The tool must be **simple and accessible** — ACS users may have limited digital literacy.
- **LGPD compliance** is mandatory — health data is sensitive. Never store identifiable patient data without proper access controls.
- Consider **offline capability** — health units may have unreliable internet.

### Tech stack considerations

The project hasn't committed to a stack yet. Decisions documented in meetings so far:

- The solution should be **web-based** (accessible from any computer at the US).
- **Leaflet** or similar JS map libraries are natural candidates (open-source, lightweight).
- Data sources: E-SUS exports, local spreadsheets (CSV/Excel), ACS manual input.
- The **Geosaúde** map (Google My Maps) is the official territory reference but has no API. The solution must complement it, not replace it.
- Prof. Netto and the computer engineering team will evaluate technical possibilities.
- A computer will be provided at US Moab via the **Projeto Reconecta UFRGS**.

### Code organization (when applicable)

```
extensao-gat4/
├── agents.md
├── justfile
├── scripts/               # Build and utility scripts
├── docs/                  # Documentation (already exists)
├── src/                   # Application source code
│   └── ...
├── data/                  # Sample/test data (anonymized only!)
│   └── ...
├── prototypes/            # Quick prototypes, experiments
│   └── ...
└── README.md              # Top-level readme (point to docs/ for full context)
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
