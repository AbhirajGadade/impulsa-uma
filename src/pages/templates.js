import {
  templates
} from '../data.js';


let current =
  'Todos';


const cats = [
  'Todos',
  'Salud',
  'Negocios',
  'Ingeniería',
  'Derecho',
  'Internacional',
  'General'
];


function card(template) {

  return `

<article
  class="template-card"
  data-area="${template.area}"
>

  <div class="template-preview">

    <div class="paper">

      <div
        class="paper-top"
        style="background:${template.accent}"
      ></div>


      <div class="paper-name">
        Nombre Apellido
      </div>


      <div class="paper-role">
        Perfil profesional
      </div>


      <div class="paper-rule"></div>


      <div class="paper-cols">

        <div>

          <h5 style="color:${template.accent}">
            EXPERIENCIA
          </h5>

          <div class="line"></div>
          <div class="line"></div>
          <div class="line s"></div>

          <br>

          <h5 style="color:${template.accent}">
            FORMACIÓN
          </h5>

          <div class="line"></div>
          <div class="line s"></div>

        </div>


        <div>

          <h5 style="color:${template.accent}">
            COMPETENCIAS
          </h5>

          <div class="line"></div>
          <div class="line"></div>
          <div class="line s"></div>

        </div>

      </div>

    </div>

  </div>


  <div class="template-body">

    <div class="template-meta">

      <h3>
        ${template.name}
      </h3>

      <span class="template-tag">
        ${template.area}
      </span>

    </div>


    <p>
      ${template.description}
    </p>


    <div class="template-actions">

      <a
        class="btn btn-primary"
        href="/crear?template=${template.id}"
        data-link
      >
        Usar diseño
      </a>

    </div>

  </div>

</article>

`;

}


export function templatesPage() {

  const visible =
    templates.filter(
      template =>
        current === 'Todos' ||
        template.area === current
    );


  return `

<section class="page-hero">

  <div class="container">

    <div class="section-kicker">
      Biblioteca visual
    </div>

    <h1>
      Elige cómo quieres presentar tu historia
    </h1>

    <p>
      Seis diseños creados para Impulsa UMA.
      Comparten la misma información, pero
      cambian jerarquía, ritmo y personalidad visual.
    </p>

  </div>

</section>



<section class="section">

  <div class="container">

    <div class="filter-row">

      ${cats.map(category => `

        <button
          type="button"
          class="chip ${category === current ? 'active' : ''}"
          data-filter="${category}"
        >
          ${category}
        </button>

      `).join('')}

    </div>


    <div
      class="template-grid"
      id="templateGrid"
    >

      ${visible.map(card).join('')}

    </div>

  </div>

</section>

`;

}


export function mountTemplates() {

  document
    .querySelectorAll(
      '[data-filter]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          current =
            button.dataset.filter;


          document
            .querySelector('#app')
            .dispatchEvent(
              new CustomEvent(
                'rerender'
              )
            );

        }
      );

    });

}