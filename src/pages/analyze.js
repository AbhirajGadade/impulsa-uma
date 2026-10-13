import {
  extractText,
  scoreCv
} from '../analyzer.js';


let result =
  null;

let filename =
  '';


function escapeHtml(
  value = ''
) {

  return String(value)

    .replaceAll(
      '&',
      '&amp;'
    )

    .replaceAll(
      '<',
      '&lt;'
    )

    .replaceAll(
      '>',
      '&gt;'
    )

    .replaceAll(
      '"',
      '&quot;'
    )

    .replaceAll(
      "'",
      '&#039;'
    );

}


function scoreLabel(score) {

  if (score >= 85) {
    return 'Muy buen punto de partida';
  }

  if (score >= 70) {
    return 'Buen CV, con oportunidades de mejora';
  }

  if (score >= 50) {
    return 'Conviene reforzar algunas secciones';
  }

  return 'Tu CV necesita una revisión más profunda';

}


function resultPlaceholder() {

  return `

<div class="result-card result-card-placeholder">

  <div class="analyze-card-head">

    <div class="analyze-step">
      02
    </div>

    <div>

      <span class="analyze-card-kicker">
        Resultado
      </span>

      <h2>
        Tu análisis aparecerá aquí
      </h2>

      <p>
        Cuando subas tu CV, revisaremos señales clave
        para ayudarte a detectar oportunidades de mejora.
      </p>

    </div>

  </div>


  <div
    class="result-placeholder-visual"
    aria-hidden="true"
  >

    <div class="result-placeholder-icon">

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >

        <path
          d="M9 11l3 3L22 4"
        ></path>

        <path
          d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
        ></path>

      </svg>

    </div>


    <div>

      <strong>
        Revisión clara y rápida
      </strong>

      <span>
        Obtén un puntaje orientativo
        y recomendaciones prácticas.
      </span>

    </div>

  </div>


  <div class="analysis-preview-list">

    <div class="analysis-preview-row">

      <span class="preview-check">
        ✓
      </span>

      <span>
        Datos de contacto
      </span>

      <small>
        Pendiente
      </small>

    </div>


    <div class="analysis-preview-row">

      <span class="preview-check">
        ✓
      </span>

      <span>
        Perfil y experiencia
      </span>

      <small>
        Pendiente
      </small>

    </div>


    <div class="analysis-preview-row">

      <span class="preview-check">
        ✓
      </span>

      <span>
        Formación y competencias
      </span>

      <small>
        Pendiente
      </small>

    </div>


    <div class="analysis-preview-row">

      <span class="preview-check">
        ✓
      </span>

      <span>
        Logros cuantificables
      </span>

      <small>
        Pendiente
      </small>

    </div>

  </div>


  <div class="privacy-note">

    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >

      <rect
        x="3"
        y="11"
        width="18"
        height="10"
        rx="2"
      ></rect>

      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
      ></path>

    </svg>


    <span>
      El archivo se procesa localmente
      en tu navegador.
    </span>

  </div>

</div>

`;

}


function results() {

  if (!result) {

    return resultPlaceholder();

  }


  const safeFilename =
    escapeHtml(
      filename
    );


  const safeKeywords =
    result.keywords.map(
      keyword =>
        escapeHtml(keyword)
    );


  return `

<div class="result-card result-card-complete">

  <div class="result-topbar">

    <div>

      <span class="analyze-card-kicker">
        Análisis completado
      </span>

      <h2>
        ${safeFilename}
      </h2>

      <p>
        ${scoreLabel(result.score)}
      </p>

    </div>


    <div
      class="score-ring"
      style="--score:${result.score}"
      aria-label="Puntaje ${result.score} de 100"
    >

      <strong>
        ${result.score}
      </strong>

      <span>
        /100
      </span>

    </div>

  </div>


  <div class="result-summary">

    <div class="result-summary-icon">

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >

        <path
          d="M3 3v18h18"
        ></path>

        <path
          d="m7 16 4-5 4 3 5-7"
        ></path>

      </svg>

    </div>


    <div>

      <strong>
        Puntaje orientativo
      </strong>

      <span>
        Úsalo como una guía para priorizar
        mejoras antes de postular.
      </span>

    </div>

  </div>


  <div class="result-section-head">

    <h3>
      Revisión por secciones
    </h3>

    <span>
      ${
        result.checks.filter(
          check =>
            check.ok
        ).length
      }
      /
      ${result.checks.length}
      correctas
    </span>

  </div>


  <div class="check-list">

    ${
      result.checks
        .map(
          check => `

        <div
          class="check ${
            check.ok
              ? 'check-ok'
              : 'check-improve'
          }"
        >

          <div class="check-main">

            <span class="check-icon">

              ${
                check.ok
                  ? '✓'
                  : '!'
              }

            </span>


            <div>

              <strong>
                ${escapeHtml(check.name)}
              </strong>


              ${
                !check.ok
                  ? `
                    <p>
                      ${escapeHtml(check.tip)}
                    </p>
                  `
                  : `
                    <p>
                      Esta sección presenta
                      una señal positiva.
                    </p>
                  `
              }

            </div>

          </div>


          <span
            class="check-status ${
              check.ok
                ? 'ok'
                : 'bad'
            }"
          >

            ${
              check.ok
                ? `+${check.points}`
                : 'Mejorar'
            }

          </span>

        </div>

      `
        )
        .join('')
    }

  </div>


  ${
    safeKeywords.length

      ? `

      <div class="keywords-section">

        <div class="result-section-head">

          <h3>
            Palabras frecuentes
          </h3>

          <span>
            Detectadas en tu CV
          </span>

        </div>


        <div class="keywords">

          ${
            safeKeywords
              .map(
                keyword =>
                  `
                  <span class="keyword">
                    ${keyword}
                  </span>
                  `
              )
              .join('')
          }

        </div>

      </div>

      `

      : ''
  }


  <div class="privacy-note privacy-note-result">

    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >

      <rect
        x="3"
        y="11"
        width="18"
        height="10"
        rx="2"
      ></rect>

      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
      ></path>

    </svg>


    <span>
      Tu archivo no se subió a un servidor.
    </span>

  </div>

</div>

`;

}


export function analyzePage() {

  return `

<section class="page-hero analyze-hero">

  <div class="container analyze-hero-inner">

    <div class="section-kicker">
      Revisión de CV
    </div>


    <h1>
      Revisa tu CV antes de enviarlo
    </h1>


    <p>
      Sube tu archivo y obtén una revisión rápida
      de estructura, contenido y señales clave.
      Todo el procesamiento ocurre directamente
      en tu navegador.
    </p>


    <div class="analyze-trust-row">

      <span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >

          <rect
            x="3"
            y="11"
            width="18"
            height="10"
            rx="2"
          ></rect>

          <path
            d="M7 11V7a5 5 0 0 1 10 0v4"
          ></path>

        </svg>

        Procesamiento privado

      </span>


      <span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >

          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          ></path>

          <path
            d="M14 2v6h6"
          ></path>

        </svg>

        PDF, DOCX y TXT

      </span>


      <span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >

          <circle
            cx="12"
            cy="12"
            r="9"
          ></circle>

          <path
            d="M12 7v5l3 2"
          ></path>

        </svg>

        Resultado en segundos

      </span>

    </div>

  </div>

</section>



<section class="section soft analyze-section">

  <div class="container analyze-layout">

    <div class="analyze-card upload-card">

      <div class="analyze-card-head">

        <div class="analyze-step">
          01
        </div>


        <div>

          <span class="analyze-card-kicker">
            Carga tu archivo
          </span>

          <h2>
            Selecciona tu CV
          </h2>

          <p>
            Usaremos el contenido del documento
            para realizar una revisión local.
          </p>

        </div>

      </div>


      <label
        class="upload-zone"
        id="dropZone"
        for="cvFile"
      >

        <div class="upload-icon">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >

            <path
              d="M12 16V4"
            ></path>

            <path
              d="m7 9 5-5 5 5"
            ></path>

            <path
              d="M5 20h14"
            ></path>

          </svg>

        </div>


        <h3>
          Arrastra tu CV aquí
        </h3>


        <p>
          o selecciónalo desde tu computadora
        </p>


        <span class="btn btn-primary upload-button">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >

            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            ></path>

            <path
              d="M14 2v6h6"
            ></path>

          </svg>

          Elegir archivo

        </span>


        <span class="upload-formats">
          PDF, DOCX o TXT · Máx. 10 MB
        </span>


        <input
          id="cvFile"
          type="file"
          accept=".pdf,.docx,.txt"
          hidden
        >

      </label>


      <div
        class="file-status file-status-idle"
        id="fileStatus"
      >

        <span class="file-status-dot"></span>

        <span>
          No has seleccionado ningún archivo.
        </span>

      </div>

    </div>


    <div
      id="analysisResult"
      class="analysis-result-host"
    >

      ${results()}

    </div>

  </div>

</section>

`;

}


export function mountAnalyze() {

  const input =
    document.querySelector(
      '#cvFile'
    );


  const zone =
    document.querySelector(
      '#dropZone'
    );


  const status =
    document.querySelector(
      '#fileStatus'
    );


  const setStatus = (
    message,
    type = 'idle'
  ) => {

    status.className =
      `file-status file-status-${type}`;


    status.innerHTML = `

      <span class="file-status-dot"></span>

      <span>
        ${escapeHtml(message)}
      </span>

    `;

  };


  const run =
    async file => {

      if (!file) {
        return;
      }


      const extension =
        file.name
          .split('.')
          .pop()
          ?.toLowerCase();


      const allowed = [
        'pdf',
        'docx',
        'txt'
      ];


      if (
        !allowed.includes(
          extension
        )
      ) {

        setStatus(
          'Formato no compatible. Usa PDF, DOCX o TXT.',
          'error'
        );

        return;

      }


      if (
        file.size >
        10 * 1024 * 1024
      ) {

        setStatus(
          'El archivo supera el límite de 10 MB.',
          'error'
        );

        return;

      }


      setStatus(
        `Analizando ${file.name}...`,
        'loading'
      );


      try {

        const text =
          await extractText(file);


        result =
          scoreCv(text);


        filename =
          file.name;


        document.querySelector(
          '#analysisResult'
        ).innerHTML =
          results();


        setStatus(
          `${file.name} analizado correctamente.`,
          'success'
        );


      } catch (error) {

        setStatus(
          `No se pudo leer el archivo: ${error.message}`,
          'error'
        );

      }

    };


  input.addEventListener(
    'change',
    () =>
      run(
        input.files[0]
      )
  );


  [
    'dragenter',
    'dragover'
  ].forEach(
    eventName => {

      zone.addEventListener(
        eventName,
        event => {

          event.preventDefault();

          zone.classList.add(
            'drag'
          );

        }
      );

    }
  );


  [
    'dragleave',
    'drop'
  ].forEach(
    eventName => {

      zone.addEventListener(
        eventName,
        event => {

          event.preventDefault();

          zone.classList.remove(
            'drag'
          );

        }
      );

    }
  );


  zone.addEventListener(
    'drop',
    event => {

      run(
        event.dataTransfer
          .files[0]
      );

    }
  );

}