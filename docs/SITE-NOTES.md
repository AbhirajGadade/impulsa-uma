# EmpleaKit UMA

UMA adaptation of the user-requested EmpleaKit Wiener reference at https://empleakit-wiener.vercel.app/ (reviewed 2026-09-09). This version follows the reference's actual page layouts, typography, responsive navigation, template cards, and complete seven-stage builder, with UMA colors, identity, careers, and institutional destinations. The homepage has no template gallery, as requested.

## Features

- Homepage with the reference's centered introduction, CV format section, three tools, and employment-opportunity cards linked to UMA's official postings.
- Sixteen downloadable UMA Word templates with area and experience filters.
- Seven-stage builder: Plantilla, Datos, Perfil, Trayectoria, Skills, Opcionales, Listo. Includes blank/sample start choices, live preview, repeatable records, skill suggestions, six distinct Word formats, optional photographs where supported, and printing to PDF.
- Browser-local draft recovery and a clear/reset action.
- Local PDF/DOCX/TXT extraction, up to 10 MB and 20 PDF pages; content checks are labeled as rule-based guidance, without pretending to certify ATS compatibility.
- UMA resource, social, and contact pages, plus use/privacy information.

## Source and assets

The adapted browser modules live in `src/portal/`; `src/index.html` is the shared HTML entrypoint. Existing license notices are retained inside the dependency bundles. `dist/vendor` contains the previously vendored local file-reading libraries and their licenses. `dist/templates` contains generated, editable UMA documents.

The reference supplied the layout styles and the CV context photographs. No reference tracking endpoint, analysis endpoint, student registration, Wiener contact destination, or Wiener-branded Word template is used.

Institutional sources:

- UMA identity and careers: https://uma.edu.pe/
- Employability and contact information: https://uma.edu.pe/seguimiento-al-egresado/
- UMA logo: https://uma.edu.pe/wp-content/uploads/2025/07/logo-web2025_130-270x98.png

## Updating and publishing

Edit the canonical modules in `src/portal`, then run `python scripts/build-portal.py`. It packages the static modules, applies deterministic filenames for browser caching, and writes HTML entrypoints for `/`, `/plantillas`, `/crear`, `/analizar`, `/comunidad`, `/terminos`, and `/privacidad`. No installation or server build is required.

The existing Site identity remains in `.openai/hosting.json`. Serve or package the `dist` directory. Check JavaScript syntax, imported assets and HTML entrypoints after changes. Publishing uses the Sites source repository and native deployment workflow.

The application is a functional proposal and does not claim university approval or ATS certification. Hosting access is managed independently. There is no SIGU integration, server-side CV storage, or AI analysis API. Draft CV data stays in the user's browser storage; downloaded documents stay on their device.
