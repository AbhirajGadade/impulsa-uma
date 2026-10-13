import {
  templates
} from '../data.js';

import {
  loadCv,
  saveCv,
  clearCv,
  emptyCv
} from '../store.js';

import {
  downloadPdf
} from '../pdf.js';

import {
  downloadDocx
} from '../docx-export.js';


let cv =
  loadCv();

let step =
  0;


const steps = [
  'Perfil',
  'Formación',
  'Experiencia',
  'Competencias',
  'Extras',
  'Diseño'
];


const clone =
  value =>
    JSON.parse(
      JSON.stringify(value)
    );


const esc =
  value =>
    String(value ?? '')
      .replace(
        /[&<>"']/g,
        character => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        })[character]
      );


function selectedTemplate() {

  return (
    templates.find(
      template =>
        template.id ===
        cv.template
    ) ||
    templates[0]
  );

}


function input(
  label,
  path,
  value,
  type = 'text',
  placeholder = ''
) {

  return `

<div class="field">

  <label>
    ${label}
  </label>

  <input
    type="${type}"
    data-field="${path}"
    value="${esc(value)}"
    placeholder="${esc(placeholder)}"
  >

</div>

`;

}


function textarea(
  label,
  path,
  value,
  placeholder = ''
) {

  return `

<div class="field full">

  <label>
    ${label}
  </label>

  <textarea
    data-field="${path}"
    placeholder="${esc(placeholder)}"
  >${esc(value)}</textarea>

</div>

`;

}


function arrayInput(
  label,
  array,
  index,
  key,
  value,
  placeholder = ''
) {

  return `

<div class="field">

  <label>
    ${label}
  </label>

  <input
    data-array="${array}"
    data-index="${index}"
    data-key="${key}"
    value="${esc(value)}"
    placeholder="${esc(placeholder)}"
  >

</div>

`;

}


function arrayText(
  label,
  array,
  index,
  key,
  value,
  placeholder = ''
) {

  return `

<div class="field full">

  <label>
    ${label}
  </label>

  <textarea
    data-array="${array}"
    data-index="${index}"
    data-key="${key}"
    placeholder="${esc(placeholder)}"
  >${esc(value)}</textarea>

</div>

`;

}


function repeat(
  array,
  index,
  title,
  fields
) {

  return `

<div class="repeat-card">

  <div
    class="row-actions"
    style="margin-top:0"
  >

    <strong>
      ${title} ${index + 1}
    </strong>

    ${
      index
        ? `
          <button
            class="link-btn danger-link"
            type="button"
            data-remove="${array}"
            data-index="${index}"
          >
            Eliminar
          </button>
        `
        : ''
    }

  </div>


  <div
    class="field-grid"
    style="margin-top:12px"
  >

    ${fields}

  </div>

</div>

`;

}


function formContent() {

  if (step === 0) {

    return `

<div class="form-card">

  <h3>
    Datos esenciales
  </h3>


  <div class="field-grid">

    ${input(
      'Nombre completo',
      'personal.name',
      cv.personal.name,
      'text',
      'Nombre y apellido'
    )}

    ${input(
      'Título profesional',
      'personal.headline',
      cv.personal.headline,
      'text',
      'Ej. Analista de datos junior'
    )}

    ${input(
      'Correo',
      'personal.email',
      cv.personal.email,
      'email',
      'nombre@correo.com'
    )}

    ${input(
      'Teléfono',
      'personal.phone',
      cv.personal.phone,
      'tel',
      '+51 999 999 999'
    )}

    ${input(
      'Ciudad',
      'personal.city',
      cv.personal.city
    )}

    ${input(
      'LinkedIn',
      'personal.linkedin',
      cv.personal.linkedin,
      'url',
      'linkedin.com/in/usuario'
    )}

    ${textarea(
      'Perfil profesional',
      'summary',
      cv.summary,
      'Resume tu especialidad, fortalezas y objetivo en 3–5 líneas.'
    )}

  </div>

</div>

`;

  }


  if (step === 1) {

    return `

<div class="form-card">

  <h3>
    Formación académica
  </h3>

  ${
    cv.education
      .map(
        (item, index) =>
          repeat(
            'education',
            index,
            'Formación',

            `
            ${arrayInput(
              'Institución',
              'education',
              index,
              'institution',
              item.institution,
              'Universidad / instituto'
            )}

            ${arrayInput(
              'Carrera o grado',
              'education',
              index,
              'degree',
              item.degree,
              'Carrera, grado o especialidad'
            )}

            ${arrayInput(
              'Inicio',
              'education',
              index,
              'start',
              item.start,
              '2023'
            )}

            ${arrayInput(
              'Fin',
              'education',
              index,
              'end',
              item.end,
              'Actualidad'
            )}
            `
          )
      )
      .join('')
  }


  <button
    class="link-btn"
    type="button"
    data-add="education"
  >
    + Agregar formación
  </button>

</div>

`;

  }


  if (step === 2) {

    return `

<div class="form-card">

  <h3>
    Experiencia, prácticas o voluntariado
  </h3>

  ${
    cv.experience
      .map(
        (item, index) =>
          repeat(
            'experience',
            index,
            'Experiencia',

            `
            ${arrayInput(
              'Organización',
              'experience',
              index,
              'company',
              item.company,
              'Empresa u organización'
            )}

            ${arrayInput(
              'Rol',
              'experience',
              index,
              'role',
              item.role,
              'Puesto o función'
            )}

            ${arrayInput(
              'Inicio',
              'experience',
              index,
              'start',
              item.start,
              'Ene 2025'
            )}

            ${arrayInput(
              'Fin',
              'experience',
              index,
              'end',
              item.end,
              'Actualidad'
            )}

            ${arrayText(
              'Aportes y resultados',
              'experience',
              index,
              'description',
              item.description,
              'Describe qué hiciste, cómo lo hiciste y qué resultado generaste.'
            )}
            `
          )
      )
      .join('')
  }


  <button
    class="link-btn"
    type="button"
    data-add="experience"
  >
    + Agregar experiencia
  </button>

</div>

`;

  }


  if (step === 3) {

    return `

<div class="form-card">

  <h3>
    Competencias relevantes
  </h3>


  <p
    style="
      color:var(--muted);
      font-size:13px
    "
  >
    Añade herramientas, tecnologías,
    métodos o habilidades directamente
    relacionadas con las oportunidades
    que buscas.
  </p>


  <div class="skills-entry">

    <input
      id="skillInput"
      placeholder="Ej. Python, Excel, Comunicación"
    >

    <button
      class="btn btn-primary"
      id="addSkill"
      type="button"
    >
      Agregar
    </button>

  </div>


  <div class="skills">

    ${
      cv.skills
        .map(
          (skill, index) => `

          <span class="skill">

            ${esc(skill)}

            <button
              type="button"
              data-skill-remove="${index}"
              aria-label="Eliminar ${esc(skill)}"
            >
              ×
            </button>

          </span>

        `
        )
        .join('')
    }

  </div>

</div>

`;

  }


  if (step === 4) {

    return `

<div class="form-card">

  <h3>
    Idiomas
  </h3>

  ${
    cv.languages
      .map(
        (item, index) =>
          repeat(
            'languages',
            index,
            'Idioma',

            `
            ${arrayInput(
              'Idioma',
              'languages',
              index,
              'name',
              item.name,
              'Inglés'
            )}

            ${arrayInput(
              'Nivel',
              'languages',
              index,
              'level',
              item.level,
              'B2 / Avanzado'
            )}
            `
          )
      )
      .join('')
  }


  <button
    class="link-btn"
    type="button"
    data-add="languages"
  >
    + Agregar idioma
  </button>

</div>



<div class="form-card">

  <h3>
    Certificaciones
  </h3>

  ${
    cv.certifications
      .map(
        (item, index) =>
          repeat(
            'certifications',
            index,
            'Certificación',

            `
            ${arrayInput(
              'Nombre',
              'certifications',
              index,
              'name',
              item.name,
              'Certificación'
            )}

            ${arrayInput(
              'Entidad',
              'certifications',
              index,
              'issuer',
              item.issuer,
              'Institución'
            )}

            ${arrayInput(
              'Año',
              'certifications',
              index,
              'year',
              item.year,
              '2026'
            )}
            `
          )
      )
      .join('')
  }


  <button
    class="link-btn"
    type="button"
    data-add="certifications"
  >
    + Agregar certificación
  </button>

</div>



<div class="form-card">

  <h3>
    Proyectos
  </h3>

  ${
    cv.projects
      .map(
        (item, index) =>
          repeat(
            'projects',
            index,
            'Proyecto',

            `
            ${arrayInput(
              'Nombre',
              'projects',
              index,
              'name',
              item.name,
              'Proyecto destacado'
            )}

            ${arrayInput(
              'Enlace',
              'projects',
              index,
              'link',
              item.link,
              'https://...'
            )}

            ${arrayText(
              'Descripción',
              'projects',
              index,
              'description',
              item.description,
              'Problema, solución, herramientas y resultado.'
            )}
            `
          )
      )
      .join('')
  }


  <button
    class="link-btn"
    type="button"
    data-add="projects"
  >
    + Agregar proyecto
  </button>

</div>

`;

  }


  return `

<div class="form-card">

  <h3>
    Elige una dirección visual
  </h3>


  <div
    class="template-grid"
    style="grid-template-columns:repeat(2,1fr)"
  >

    ${
      templates
        .map(
          template => `

          <button
            type="button"
            class="template-card ${cv.template === template.id ? 'selected' : ''}"
            data-template="${template.id}"
            style="
              text-align:left;
              padding:0;
              border:${
                cv.template === template.id
                  ? '2px solid var(--primary)'
                  : '1px solid var(--line)'
              }
            "
          >

            <div
              class="template-preview"
              style="height:170px"
            >

              <div class="paper">

                <div
                  class="paper-top"
                  style="background:${template.accent}"
                ></div>

                <div class="paper-name">
                  ${template.name}
                </div>

                <div class="paper-rule"></div>

                <div class="line"></div>

                <div class="line s"></div>

              </div>

            </div>


            <div class="template-body">

              <div class="template-meta">

                <h3>
                  ${template.name}
                </h3>

                <span class="template-tag">
                  ${template.tone}
                </span>

              </div>

            </div>

          </button>

        `
        )
        .join('')
    }

  </div>

</div>



<div class="form-card">

  <h3>
    Tu CV está listo para una revisión final
  </h3>

  <p
    style="
      color:var(--muted);
      line-height:1.65
    "
  >
    Comprueba nombres, fechas,
    ortografía y adapta el perfil
    profesional a cada vacante
    antes de descargar.
  </p>

  <button
    class="link-btn danger-link"
    id="clearCv"
    type="button"
  >
    Borrar borrador local
  </button>

</div>

`;

}


function sec(
  title,
  body
) {

  return `

<section class="cv-section">

  <div class="cv-section-title">
    ${title}
  </div>

  ${body}

</section>

`;

}


function item(
  title,
  meta,
  description
) {

  return `

<div class="cv-item">

  <div class="cv-item-title">
    ${esc(title)}
  </div>

  ${
    meta
      ? `
      <div class="cv-item-meta">
        ${esc(meta)}
      </div>
      `
      : ''
  }

  ${
    description
      ? `
      <p>
        ${esc(description)}
      </p>
      `
      : ''
  }

</div>

`;

}


function preview() {

  const template =
    selectedTemplate();


  const contact = [

    cv.personal.email,
    cv.personal.phone,
    cv.personal.city,
    cv.personal.linkedin

  ].filter(Boolean);


  return `

<div
  class="cv-paper template-${template.id}"
  style="--cv-accent:${template.accent}"
>

  <header class="cv-head">

    <h1>
      ${esc(
        cv.personal.name ||
        'Tu nombre'
      )}
    </h1>


    <h2>
      ${esc(
        cv.personal.headline ||
        'Perfil profesional'
      )}
    </h2>


    <div class="cv-contact">

      ${
        contact.length
          ? contact
              .map(
                value =>
                  `<span>${esc(value)}</span>`
              )
              .join('')
          : `
            <span class="cv-empty">
              correo · teléfono · ciudad · LinkedIn
            </span>
          `
      }

    </div>

  </header>


  ${
    cv.summary
      ? sec(
          'PERFIL',
          `<p>${esc(cv.summary)}</p>`
        )
      : ''
  }


  ${
    cv.experience.some(
      value =>
        value.role ||
        value.company
    )
      ? sec(
          'EXPERIENCIA',

          cv.experience
            .filter(
              value =>
                value.role ||
                value.company
            )
            .map(
              value =>
                item(
                  [
                    value.role,
                    value.company
                  ]
                    .filter(Boolean)
                    .join(' — '),

                  [
                    value.start,
                    value.end
                  ]
                    .filter(Boolean)
                    .join(' – '),

                  value.description
                )
            )
            .join('')
        )
      : ''
  }


  ${
    cv.education.some(
      value =>
        value.degree ||
        value.institution
    )
      ? sec(
          'FORMACIÓN',

          cv.education
            .filter(
              value =>
                value.degree ||
                value.institution
            )
            .map(
              value =>
                item(
                  [
                    value.degree,
                    value.institution
                  ]
                    .filter(Boolean)
                    .join(' — '),

                  [
                    value.start,
                    value.end
                  ]
                    .filter(Boolean)
                    .join(' – '),

                  ''
                )
            )
            .join('')
        )
      : ''
  }


  ${
    cv.skills.length
      ? sec(
          'COMPETENCIAS',

          `
          <div class="cv-skills">

            ${
              cv.skills
                .map(
                  skill =>
                    `
                    <span class="cv-skill">
                      ${esc(skill)}
                    </span>
                    `
                )
                .join('')
            }

          </div>
          `
        )
      : ''
  }


  ${
    cv.languages.some(
      value =>
        value.name
    )
      ? sec(
          'IDIOMAS',

          cv.languages
            .filter(
              value =>
                value.name
            )
            .map(
              value => `

              <p>

                ${esc(value.name)}

                ${
                  value.level
                    ? ` — ${esc(value.level)}`
                    : ''
                }

              </p>

            `
            )
            .join('')
        )
      : ''
  }


  ${
    cv.certifications.some(
      value =>
        value.name
    )
      ? sec(
          'CERTIFICACIONES',

          cv.certifications
            .filter(
              value =>
                value.name
            )
            .map(
              value => `

              <p>
                ${
                  esc(
                    [
                      value.name,
                      value.issuer,
                      value.year
                    ]
                      .filter(Boolean)
                      .join(' — ')
                  )
                }
              </p>

            `
            )
            .join('')
        )
      : ''
  }


  ${
    cv.projects.some(
      value =>
        value.name
    )
      ? sec(
          'PROYECTOS',

          cv.projects
            .filter(
              value =>
                value.name
            )
            .map(
              value =>
                item(
                  value.name,
                  value.link,
                  value.description
                )
            )
            .join('')
        )
      : ''
  }

</div>

`;

}


export function builderPage() {

  const param =
    new URLSearchParams(
      location.search
    ).get('template');


  if (
    param &&
    templates.some(
      template =>
        template.id === param
    ) &&
    cv.template !== param
  ) {

    cv.template =
      param;

    saveCv(cv);

  }


  return `

<div class="builder-shell">

  <aside class="builder-steps">

    <h3>
      Tu recorrido
    </h3>


    ${
      steps
        .map(
          (name, index) => `

          <button
            type="button"
            class="step-btn ${index === step ? 'active' : ''}"
            data-step="${index}"
          >
            ${index + 1}. ${name}
          </button>

        `
        )
        .join('')
    }

  </aside>


  <main class="builder-form">

    <div class="builder-form-head">

      <div>

        <h1>
          ${steps[step]}
        </h1>

        <p>

          ${
            step === 5
              ? 'Ajusta la presentación y descarga tu CV.'
              : 'Completa solo la información que fortalece tu perfil.'
          }

        </p>

      </div>


      <span class="autosave">
        ● Guardado local
      </span>

    </div>


    <div id="formContent">

      ${formContent()}

    </div>


    <div class="builder-nav">

      <button
        class="btn btn-secondary"
        id="prevStep"
        ${step === 0 ? 'disabled' : ''}
      >
        ← Anterior
      </button>


      <button
        class="btn btn-primary"
        id="nextStep"
      >

        ${
          step ===
          steps.length - 1

            ? 'Volver al inicio'
            : 'Siguiente →'
        }

      </button>

    </div>

  </main>


  <aside class="builder-preview">

    <div class="preview-toolbar">

      <select id="previewTemplate">

        ${
          templates
            .map(
              template => `

              <option
                value="${template.id}"
                ${
                  template.id === cv.template
                    ? 'selected'
                    : ''
                }
              >
                ${template.name}
              </option>

            `
            )
            .join('')
        }

      </select>


      <div class="export-actions">

        <button
          type="button"
          id="pdfBtn"
        >
          PDF
        </button>

        <button
          type="button"
          id="docxBtn"
        >
          DOCX
        </button>

      </div>

    </div>


    <div id="cvPreview">

      ${preview()}

    </div>

  </aside>

</div>

`;

}


function persist() {

  saveCv(cv);

  const previewElement =
    document.querySelector(
      '#cvPreview'
    );


  if (previewElement) {

    previewElement.innerHTML =
      preview();

  }

}


function rerender() {

  document
    .querySelector('#app')
    .dispatchEvent(
      new CustomEvent(
        'rerender'
      )
    );

}


function setPath(
  path,
  value
) {

  const parts =
    path.split('.');


  if (parts.length === 1) {

    cv[parts[0]] =
      value;

  } else {

    cv[
      parts[0]
    ][
      parts[1]
    ] = value;

  }


  persist();

}


const newItem = {

  education: () => ({
    institution: '',
    degree: '',
    start: '',
    end: ''
  }),

  experience: () => ({
    company: '',
    role: '',
    start: '',
    end: '',
    description: ''
  }),

  languages: () => ({
    name: '',
    level: ''
  }),

  certifications: () => ({
    name: '',
    issuer: '',
    year: ''
  }),

  projects: () => ({
    name: '',
    description: '',
    link: ''
  })

};


export function mountBuilder() {

  document
    .querySelectorAll(
      '[data-step]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          step =
            Number(
              button.dataset.step
            );

          rerender();

        }
      );

    });


  document
    .querySelectorAll(
      '[data-field]'
    )
    .forEach(element => {

      element.addEventListener(
        'input',
        () => {

          setPath(
            element.dataset.field,
            element.value
          );

        }
      );

    });


  document
    .querySelectorAll(
      '[data-array]'
    )
    .forEach(element => {

      element.addEventListener(
        'input',
        () => {

          cv[
            element.dataset.array
          ][
            Number(
              element.dataset.index
            )
          ][
            element.dataset.key
          ] = element.value;


          persist();

        }
      );

    });


  document
    .querySelectorAll(
      '[data-add]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const type =
            button.dataset.add;


          cv[type].push(
            newItem[type]()
          );


          saveCv(cv);

          rerender();

        }
      );

    });


  document
    .querySelectorAll(
      '[data-remove]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          cv[
            button.dataset.remove
          ].splice(
            Number(
              button.dataset.index
            ),
            1
          );


          saveCv(cv);

          rerender();

        }
      );

    });


  document
    .querySelectorAll(
      '[data-skill-remove]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          cv.skills.splice(
            Number(
              button.dataset.skillRemove
            ),
            1
          );


          saveCv(cv);

          rerender();

        }
      );

    });


  const addSkill =
    document.querySelector(
      '#addSkill'
    );


  if (addSkill) {

    addSkill.addEventListener(
      'click',
      () => {

        const input =
          document.querySelector(
            '#skillInput'
          );


        const value =
          input.value.trim();


        if (
          value &&
          !cv.skills.includes(value)
        ) {

          cv.skills.push(value);

          saveCv(cv);

          rerender();

        }

      }
    );

  }


  const skillInput =
    document.querySelector(
      '#skillInput'
    );


  if (skillInput) {

    skillInput.addEventListener(
      'keydown',
      event => {

        if (event.key === 'Enter') {

          event.preventDefault();

          addSkill?.click();

        }

      }
    );

  }


  document
    .querySelectorAll(
      '[data-template]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          cv.template =
            button.dataset.template;


          saveCv(cv);

          rerender();

        }
      );

    });


  const select =
    document.querySelector(
      '#previewTemplate'
    );


  if (select) {

    select.addEventListener(
      'change',
      () => {

        cv.template =
          select.value;

        persist();

      }
    );

  }


  document
    .querySelector(
      '#prevStep'
    )
    ?.addEventListener(
      'click',
      () => {

        if (step > 0) {

          step--;

          rerender();

        }

      }
    );


  document
    .querySelector(
      '#nextStep'
    )
    ?.addEventListener(
      'click',
      () => {

        if (
          step <
          steps.length - 1
        ) {

          step++;

          rerender();

        } else {

          step = 0;

          rerender();

        }

      }
    );


  document
    .querySelector(
      '#pdfBtn'
    )
    ?.addEventListener(
      'click',
      () =>
        downloadPdf(cv)
    );


  document
    .querySelector(
      '#docxBtn'
    )
    ?.addEventListener(
      'click',
      () =>
        downloadDocx(cv)
    );


  document
    .querySelector(
      '#clearCv'
    )
    ?.addEventListener(
      'click',
      () => {

        if (
          confirm(
            '¿Borrar el borrador guardado en este navegador?'
          )
        ) {

          clearCv();

          cv =
            clone(emptyCv);

          step = 0;

          rerender();

        }

      }
    );

}