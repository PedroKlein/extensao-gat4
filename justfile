# GAT 4 — Georreferenciamento em Saúde

# List available recipes
default:
    @just --list

# Build the HTML site from markdown docs
build:
    ./scripts/build.sh

# Build and open in browser
view: build
    open docs/site/index.html

# Clean generated site
clean:
    rm -rf docs/site
