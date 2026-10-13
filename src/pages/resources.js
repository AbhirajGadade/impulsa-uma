import {
  resources
} from '../data.js';


export function resourcesPage() {

  return `

<section class="page-hero">

  <div class="container">

    <div class="section-kicker">
      Recursos
    </div>

    <h1>
      Mejora tu postulación,
      no solo tu formato
    </h1>

    <p>
      Ideas breves para convertir
      tu experiencia académica y profesional
      en mensajes más claros y relevantes.
    </p>

  </div>

</section>



<section class="section">

  <div class="container">

    <div class="resource-grid">

      ${
        resources
          .map(
            resource => `

            <article class="resource-card">

              <div class="resource-tag">
                ${resource.tag}
              </div>

              <h3>
                ${resource.title}
              </h3>

              <p>
                ${resource.text}
              </p>

            </article>

          `
          )
          .join('')
      }

    </div>

  </div>

</section>



<section class="section soft">

  <div class="container">

    <div class="banner">

      <div>

        <h2>
          ¿Ya tienes un CV?
        </h2>

        <p>
          Súbelo al analizador local y revisa
          qué secciones pueden fortalecerse.
        </p>

      </div>


      <a
        class="btn"
        href="/analizar"
        data-link
      >
        Analizar mi CV
      </a>

    </div>

  </div>

</section>

`;

}


export function mountResources() {}