#!/bin/bash
# Build multi-page HTML site from markdown docs
# Usage: ./build.sh
# Output: docs/site/

set -e

OUTDIR="docs/site"
mkdir -p "$OUTDIR"

# Ordered list of markdown files to include
MD_FILES=(
  "docs/README.md"
  "docs/pet-saude-digital.md"
  "docs/context/extension-program.md"
  "docs/reports.md"
  "docs/context/digital-solutions.md"
  "docs/context/territorialization.md"
  "docs/context/geoprocessing-health.md"
  "docs/context/tools-and-platforms.md"
  "docs/glossary.md"
  "docs/references.md"
)

SECTION_IDS=(
  "index"
  "pet-saude"
  "program"
  "reports"
  "solutions"
  "territory"
  "geoprocessing"
  "tools"
  "glossary"
  "references"
)

SECTION_LABELS=(
  "Visão Geral"
  "Documento Oficial"
  "Programa PET-Saúde"
  "Relatos de Reuniões"
  "Soluções Digitais"
  "Territorialização"
  "Geoprocessamento"
  "Ferramentas"
  "Glossário"
  "Referências"
)

SECTION_ICONS=(
  "🏠"
  "📄"
  "🎓"
  "📋"
  "💡"
  "🗺️"
  "📍"
  "🔧"
  "📖"
  "🔗"
)

SECTION_GROUPS=(
  "projeto"
  "projeto"
  "projeto"
  "projeto"
  "conhecimento"
  "conhecimento"
  "conhecimento"
  "conhecimento"
  "apoio"
  "apoio"
)

generate_page() {
  local idx=$1
  local current_id="${SECTION_IDS[$idx]}"
  local file="${MD_FILES[$idx]}"
  local outfile="$OUTDIR/${current_id}.html"

  # Find prev/next
  local prev_idx=$((idx - 1))
  local next_idx=$((idx + 1))
  local total=${#SECTION_IDS[@]}

  # Convert markdown to HTML body
  local body
  body=$(python3 -c "
import markdown, sys
with open('$file', 'r') as f:
    text = f.read()
html = markdown.markdown(text, extensions=['tables', 'fenced_code', 'nl2br', 'sane_lists'])
print(html)
")

  # Build sidebar HTML
  local sidebar=""
  local last_group=""
  for j in "${!SECTION_IDS[@]}"; do
    local grp="${SECTION_GROUPS[$j]}"
    if [ "$grp" != "$last_group" ]; then
      local grp_label=""
      case "$grp" in
        projeto) grp_label="Projeto" ;;
        conhecimento) grp_label="Conhecimento" ;;
        apoio) grp_label="Apoio" ;;
      esac
      sidebar+="<div class=\"sidebar-section\">$grp_label</div>"
      last_group="$grp"
    fi
    local active=""
    if [ "$j" -eq "$idx" ]; then active=" active"; fi
    sidebar+="<a href=\"${SECTION_IDS[$j]}.html\" class=\"nav-link$active\"><span class=\"icon\">${SECTION_ICONS[$j]}</span>${SECTION_LABELS[$j]}</a>"
  done

  # Build prev/next nav
  local prevnext=""
  prevnext+="<div class=\"page-nav\">"
  if [ "$prev_idx" -ge 0 ]; then
    prevnext+="<a href=\"${SECTION_IDS[$prev_idx]}.html\" class=\"page-nav-link prev\"><span class=\"arrow\">←</span><div><span class=\"label\">Anterior</span><span class=\"title\">${SECTION_LABELS[$prev_idx]}</span></div></a>"
  else
    prevnext+="<div></div>"
  fi
  if [ "$next_idx" -lt "$total" ]; then
    prevnext+="<a href=\"${SECTION_IDS[$next_idx]}.html\" class=\"page-nav-link next\"><div><span class=\"label\">Próximo</span><span class=\"title\">${SECTION_LABELS[$next_idx]}</span></div><span class=\"arrow\">→</span></a>"
  else
    prevnext+="<div></div>"
  fi
  prevnext+="</div>"

  cat > "$outfile" << HTMLEOF
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${SECTION_LABELS[$idx]} — GAT 4</title>
<style>
  :root {
    --bg: #0d1117;
    --surface: #161b22;
    --surface-hover: #1c2333;
    --border: #30363d;
    --text: #e6edf3;
    --text-muted: #8b949e;
    --accent: #58a6ff;
    --accent-dim: #1f6feb22;
    --green: #3fb950;
    --yellow: #d29922;
    --sidebar-w: 250px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    background: var(--bg); color: var(--text); line-height: 1.6;
  }

  /* Topbar */
  .topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 10px 20px; display: flex; align-items: center; gap: 14px; height: 48px;
  }
  .topbar h1 { font-size: 15px; font-weight: 600; white-space: nowrap; }
  .topbar h1 span { color: var(--accent); }
  .hamburger {
    display: none; background: none; border: 1px solid var(--border);
    border-radius: 6px; padding: 3px 8px; color: var(--text); cursor: pointer; font-size: 16px;
  }
  .topbar-badges { margin-left: auto; display: flex; gap: 6px; }
  .badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
  .badge-green { background: #238636; color: #fff; }
  .badge-yellow { background: #9e6a03; color: #fff; }
  .badge-gray { background: #30363d; color: var(--text-muted); }

  /* Sidebar */
  .sidebar {
    position: fixed; top: 48px; left: 0; bottom: 0; width: var(--sidebar-w);
    background: var(--surface); border-right: 1px solid var(--border);
    overflow-y: auto; padding: 12px 0; z-index: 50; transition: transform 0.3s;
  }
  .sidebar-section {
    padding: 14px 18px 5px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted);
  }
  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 18px; color: var(--text-muted); text-decoration: none;
    font-size: 13px; border-left: 3px solid transparent; transition: all 0.15s;
  }
  .nav-link:hover { color: var(--text); background: var(--surface-hover); }
  .nav-link.active { color: var(--accent); border-left-color: var(--accent); background: var(--accent-dim); }
  .icon { font-size: 15px; width: 20px; text-align: center; }

  /* Main content */
  .main {
    margin-left: var(--sidebar-w); margin-top: 48px;
    padding: 36px 48px 60px; max-width: 860px;
  }
  .source-path { font-size: 12px; color: var(--text-muted); margin-bottom: 20px; }
  .content h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .content h2 { font-size: 21px; font-weight: 600; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }
  .content h3 { font-size: 17px; font-weight: 600; margin: 22px 0 8px; }
  .content h4 { font-size: 15px; font-weight: 600; margin: 16px 0 6px; }
  .content p { margin: 8px 0; }
  .content a { color: var(--accent); text-decoration: none; }
  .content a:hover { text-decoration: underline; }
  .content ul, .content ol { margin: 8px 0; padding-left: 24px; }
  .content li { margin: 4px 0; }
  .content blockquote {
    border-left: 3px solid var(--accent); padding: 8px 16px; margin: 12px 0;
    background: var(--accent-dim); border-radius: 0 6px 6px 0;
  }
  .content code {
    background: #282c34; padding: 2px 6px; border-radius: 4px;
    font-size: 13px; font-family: 'SFMono-Regular', Consolas, monospace;
  }
  .content pre {
    background: #282c34; padding: 16px; border-radius: 6px; margin: 12px 0;
    overflow-x: auto; font-size: 13px; border: 1px solid var(--border);
  }
  .content pre code { background: none; padding: 0; }
  .content table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14px; }
  .content th {
    text-align: left; padding: 10px 12px; background: var(--surface);
    border: 1px solid var(--border); font-weight: 600; font-size: 13px;
  }
  .content td { padding: 8px 12px; border: 1px solid var(--border); vertical-align: top; }
  .content tr:hover td { background: var(--surface-hover); }
  .content hr { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
  .content strong { color: var(--text); }
  .content img { max-width: 100%; border-radius: 6px; }

  /* Prev/Next nav */
  .page-nav {
    display: flex; justify-content: space-between; gap: 16px;
    margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border);
  }
  .page-nav-link {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px; border: 1px solid var(--border); border-radius: 8px;
    text-decoration: none; color: var(--text); background: var(--surface);
    transition: all 0.15s; max-width: 48%;
  }
  .page-nav-link:hover { border-color: var(--accent); background: var(--accent-dim); }
  .page-nav-link .label { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .page-nav-link .title { display: block; font-size: 14px; font-weight: 600; color: var(--accent); }
  .page-nav-link .arrow { font-size: 20px; color: var(--text-muted); }
  .page-nav-link.next { margin-left: auto; text-align: right; }

  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main { margin-left: 0; padding: 24px 16px 60px; }
    .hamburger { display: block; }
    .topbar-badges { display: none; }
    .page-nav { flex-direction: column; }
    .page-nav-link { max-width: 100%; }
  }
</style>
</head>
<body>
<div class="topbar">
  <button class="hamburger" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</button>
  <h1>🗺️ <span>GAT 4</span> — Georreferenciamento em Saúde</h1>
  <div class="topbar-badges">
    <span class="badge badge-green">Solução 1: Em desenvolvimento</span>
    <span class="badge badge-yellow">Solução 2: Exploração</span>
    <span class="badge badge-gray">Solução 3: Conceitual</span>
  </div>
</div>
<nav class="sidebar">
$sidebar
</nav>
<div class="main">
  <div class="source-path">📄 $file</div>
  <div class="content">
$body
  </div>
$prevnext
</div>
<script>
document.querySelector('.hamburger')?.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => document.querySelector('.sidebar').classList.remove('open'));
});
</script>
</body>
</html>
HTMLEOF

  echo "  ✓ ${SECTION_LABELS[$idx]} → $outfile"
}

echo "Building multi-page site..."
for i in "${!MD_FILES[@]}"; do
  generate_page "$i"
done

echo ""
echo "✅ Built ${#MD_FILES[@]} pages in $OUTDIR/"
echo "   Open: $OUTDIR/index.html"
