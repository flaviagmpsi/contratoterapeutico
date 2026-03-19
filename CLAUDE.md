# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**psidocs** — A React app for generating psychotherapy service contracts (Contrato de Prestação de Serviços de Psicoterapia) for psychologist Flávia Gonçalves Moreira (CRP 04/84615). The app also provides pre-written WhatsApp messages for communicating therapeutic policies to clients.

All content is in Brazilian Portuguese (pt-BR).

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint
- `npm run deploy` — Build and deploy to GitHub Pages via `gh-pages -d dist`

## Architecture

This is a single-file React app. Nearly all application code lives in `src/app.jsx`:

- **Constants**: Color palette (`C`), default contract data (`DEFAULT_DATA`), form field definitions (`FIELD_GROUPS`), and WhatsApp message templates (`MSG_CATEGORIES`)
- **Export utilities**: `buildContractHTML()` generates the contract as inline-styled HTML; `exportDOCX()` wraps it in MS Word-compatible HTML blob; `exportPDF()` opens a print dialog in a new window
- **Components**: `Field` (form input/select), `ContractEditor` (split-pane with form on left, live preview on right), `WhatsAppMessages` (copyable message cards), `SidebarItem`, and `App` (root with sidebar navigation between "contrato" and "whatsapp" views)

The standalone `contrato-terapeutico.html` in the root is an older self-contained version (uses external libs like docx and html2pdf via CDN). The React app in `src/` is the current version.

## Key Details

- Vite base path is set to `/contrato-terapeutico/` for GitHub Pages deployment
- All styling is inline (no CSS files) — the app uses a dark sidebar theme with a white contract preview area
- ESLint is configured to allow uppercase/underscore-prefixed unused vars (`varsIgnorePattern: '^[A-Z_]'`)
- Entry point: `index.html` → `src/main.jsx` → `src/app.jsx` (note: `main.jsx` imports `./App.jsx` with capital A but the file is `app.jsx`)
