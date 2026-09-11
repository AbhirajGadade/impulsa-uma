# EmpleaKit UMA — local development export

This package contains the complete current UMA implementation: frontend modules, page components, styles, images, editable Word templates, vendored libraries, configuration and build tools. It was exported from UMA site version 7, source commit `f3e0796ea7bd3a3c52017ac4b1ed5c31ced7d185`.

**Source format:** the current site uses adapted, compiled JavaScript browser modules. All those editable modules are included in `src/portal/`. The original Wiener author's uncompiled React/TypeScript repository, JSX/TSX files and source maps were not available and are not included. These are the actual implementation files used by the UMA site, with local development tooling added for this export. This is not an HTML-only snapshot.

## Requirements

- Node.js 22 or later, including npm.
- VS Code or another editor.
- A modern browser. Python is not required for the npm commands.

## Install and start

Extract `empleakit-uma.zip`. Open the extracted `empleakit-uma` folder in VS Code, then open its integrated terminal. From that folder, run:

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. Use **Ctrl+C** in the terminal to stop.

The project has no npm package dependencies to download: its frontend libraries are already included. `npm install` initializes/checks the included lockfile. There are no API keys or database credentials to configure.

The development server rebuilds when files in `src/` or `public/` change. Refresh your browser after saving to see the update; it does not inject hot module replacement. All seven routes support direct navigation and refresh. Open the HTTP address, not `index.html` through `file://`.

If your terminal is one directory above the extracted project, run `cd empleakit-uma` first. If Windows PowerShell blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`, or select Command Prompt as the VS Code terminal.

To use a different port:

```sh
npm run dev -- --port 5174
```

The included VS Code launch configuration also starts development mode with **F5**.

## Build and serve

```sh
npm run build
npm start
```

`npm run build` recreates `dist/` entirely from `src/` and `public/`. `npm start` performs a build and serves it at the same local address, without watching for changes. Both commands work on Windows, macOS and Linux. Run the server from the project directory.

The generated `dist/` is also included for convenience and can be hosted by a static web server. Asset URLs are rooted at `/`; serve the application at the domain root. Your host must serve each route's `index.html`, for example `/crear/index.html` for `/crear`. Keep `public/` and `src/` as the editable sources; changes made directly inside `dist/` are overwritten by a build.

## Files and editing guide

| Location | What it contains |
| --- | --- |
| `src/index.html` | Shared HTML shell, metadata and entry scripts |
| `src/routes.json` | Routes for which the build generates HTML entrypoints |
| `src/portal/index-DSiOxGBJ.js` | App shell, header, footer, client-side router and shared icons |
| `src/portal/Home-xSdMAFX-.js` | Homepage (`/`), without the template gallery |
| `src/portal/Templates-C8-QpFT_.js` | Template page and filters (`/plantillas`) |
| `src/portal/Builder-BKFKNDk_.js` | Seven-stage CV builder, form components, preview and Word generation (`/crear`) |
| `src/portal/Analysis-DvvokPqy.js` | Local CV review page (`/analizar`) |
| `src/portal/Community-BEST8Aah.js` | Community page (`/comunidad`) |
| `src/portal/Terms-DD3LFaz6.js` | Terms page (`/terminos`) |
| `src/portal/Privacy-kD6RXy-h.js` | Privacy page (`/privacidad`) |
| `src/portal/cvs-CSTab4zF.js` | Template catalog, download UI and related shared logic |
| `src/portal/local-review.js` | Browser-side PDF, DOCX and TXT text extraction |
| `src/portal/textNormalizer-DelE0G2e.js` | Text utilities |
| `src/portal/AnimatedSection-a29Q7Nj3.js` | Shared animated section component |
| `src/portal/uma.css` | UMA brand and layout overrides; start here for visual adjustments |
| `src/portal/*.css` | Global styles and the individual page/component styles |
| `src/portal/vendor-*.js`, `motion-*.js` | Bundled frontend dependencies; additional dependency code is embedded in other modules |
| `public/uma-logo.png`, `public/assets/` | Logo, photographs and SVG brand assets |
| `public/templates/` | All 16 editable UMA Word templates |
| `public/vendor/` | PDF/ZIP/Word libraries, PDF worker, character maps, fonts and license files |
| `scripts/build.mjs` | Portable Node.js build, deterministic cache filenames and route generation |
| `scripts/serve.mjs` | Local HTTP server, optional environment loading and file watcher |
| `scripts/build-portal.py` | Original build helper, retained as part of the project; prefer the npm workflow |
| `src/portal-build.json` | Generated release manifest; do not edit manually |
| `dist/` | Complete generated static application |
| `.openai/hosting.json` | Existing Sites hosting metadata; contains no credentials |
| `docs/SITE-NOTES.md` | Original project notes, institutional sources and asset provenance |

Some modules retain compressed formatting and short variable names from their compiled origin. VS Code's **Format Document** command can format a module before editing. Preserve its imports, exports and license comments. The build rewrites filenames and packages these modules; it is not a JSX/TypeScript compiler.

To change page content, edit the corresponding module in `src/portal/`. To replace images or downloadable files, edit `public/`. To add a route, update both the app router in `index-DSiOxGBJ.js` and `src/routes.json`.

## Environment variables

`.env.example` contains only the optional variable names, with empty values. Nothing is required to launch the application. You may copy it to `.env` and configure:

| Variable | Purpose | Default when empty |
| --- | --- | --- |
| `HOST` | Local server listening address | `127.0.0.1` |
| `PORT` | Local server port | `5173` |

The local server loads `.env` if it exists. Shell environment variables take precedence over `.env`; command-line `--host` and `--port` take precedence over both. Environment values are not embedded into the frontend. `.env` files containing values are excluded from version control and this export.

## Data, API and external resources

The current project is a static browser application. There is no database, backend API, server-side CV storage, university login integration or server-side AI integration to export. CV drafts use browser local storage, Word generation happens in the browser, and CV extraction/review runs locally in the browser. The complete code for those features is included. `scripts/serve.mjs` is a development file server, not an application API.

Core application assets and libraries are local. Google Fonts and external university/social links still require an internet connection. Without Google Fonts, the browser uses fallback fonts.

No production secrets, access tokens, personal CV drafts, `.git` history or `node_modules` are included. Existing third-party license files and embedded notices are preserved.
