import { BRAND } from './config.js';

import {
  homePage,
  mountHome
} from './pages/home.js';

import {
  templatesPage,
  mountTemplates
} from './pages/templates.js';

import {
  builderPage,
  mountBuilder
} from './pages/builder.js';

import {
  analyzePage,
  mountAnalyze
} from './pages/analyze.js';

import {
  resourcesPage,
  mountResources
} from './pages/resources.js';

import {
  privacyPage,
  termsPage,
  mountLegal
} from './pages/legal.js';

const app =
  document.querySelector('#app');


function normalizedPath() {

  return (
    location.pathname
      .replace(/\/+$/, '') ||
    '/'
  );

}


function route() {

  const path =
    normalizedPath();

  if (path === '/plantillas') {
    return [
      templatesPage,
      mountTemplates,
      'Diseños'
    ];
  }

  if (path === '/crear') {
    return [
      builderPage,
      mountBuilder,
      'Crear CV'
    ];
  }

  if (path === '/analizar') {
    return [
      analyzePage,
      mountAnalyze,
      'Revisar CV'
    ];
  }

  if (
    path === '/recursos' ||
    path === '/comunidad'
  ) {
    return [
      resourcesPage,
      mountResources,
      'Recursos'
    ];
  }

  if (path === '/privacidad') {
    return [
      privacyPage,
      mountLegal,
      'Privacidad'
    ];
  }

  if (path === '/terminos') {
    return [
      termsPage,
      mountLegal,
      'Términos'
    ];
  }

  return [
    homePage,
    mountHome,
    'Inicio'
  ];

}


function navLink(
  path,
  label,
  cta = false
) {

  const current =
    normalizedPath();

  const active =
    current === path ||
    (
      path === '/recursos' &&
      current === '/comunidad'
    );

  return `
    <a
      href="${path}"
      data-link
      class="${active ? 'active' : ''} ${cta ? 'nav-cta' : ''}"
      ${active ? 'aria-current="page"' : ''}
    >
      ${label}
    </a>
  `;

}


function shell(content) {

  return `
    <div class="app-shell">

      <header class="header">

        <div class="container nav">

          <a
            class="brand"
            href="/"
            data-link
            aria-label="Ir al inicio de ${BRAND.name}"
          >

            <img
              src="/uma-logo.png"
              alt="UMA"
            >

            <span class="brand-copy">

              <strong>
                ${BRAND.name}
              </strong>

              <span>
                ${BRAND.university}
              </span>

            </span>

          </a>


          <button
            class="menu-btn"
            id="menuBtn"
            type="button"
            aria-label="Abrir menú"
            aria-controls="navLinks"
            aria-expanded="false"
          >
            ☰
          </button>


          <nav
            class="nav-links"
            id="navLinks"
            aria-label="Navegación principal"
          >

            ${navLink(
              '/plantillas',
              'Diseños'
            )}

            ${navLink(
              '/analizar',
              'Revisar CV'
            )}

            ${navLink(
              '/recursos',
              'Recursos'
            )}

            ${navLink(
              '/crear',
              'Crear CV',
              true
            )}

          </nav>

        </div>

      </header>


      <main class="site-main">

        ${content}

      </main>


      <footer class="footer">

        <div class="container footer-inner">

          <a
            class="footer-brand footer-brand-link"
            href="/"
            data-link
            aria-label="Volver al inicio"
          >

            <img
              src="/uma-logo.png"
              alt="UMA"
            >

            <div>

              <strong>
                ${BRAND.name}
              </strong>

              <br>

              <small>
                Herramientas de desarrollo profesional
              </small>

            </div>

          </a>


          <div class="footer-links">

            <a
              href="/privacidad"
              data-link
            >
              Privacidad
            </a>

            <a
              href="/terminos"
              data-link
            >
              Términos
            </a>

            <a
              href="${BRAND.website}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sitio UMA ↗
            </a>

          </div>

        </div>

      </footer>

    </div>
  `;

}


function navigate(href) {

  if (!href) {
    return;
  }

  const target =
    new URL(
      href,
      location.origin
    );


  if (
    target.origin !==
    location.origin
  ) {

    location.href =
      target.href;

    return;

  }


  history.pushState(
    {},
    '',
    `${target.pathname}${target.search}${target.hash}`
  );


  render();


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


function bindShellControls() {

  const menuButton =
    document.querySelector(
      '#menuBtn'
    );

  const navLinks =
    document.querySelector(
      '#navLinks'
    );


  menuButton?.addEventListener(
    'click',
    () => {

      const open =
        navLinks
          ?.classList
          .toggle('open') ??
        false;


      menuButton.setAttribute(
        'aria-expanded',
        String(open)
      );


      menuButton.setAttribute(
        'aria-label',
        open
          ? 'Cerrar menú'
          : 'Abrir menú'
      );

    }
  );

}


export function render() {

  const [
    page,
    mount,
    title
  ] = route();


  document.title =
    `${title} | ${BRAND.name}`;


  app.innerHTML =
    shell(
      page()
    );


  bindShellControls();

  mount();

}


/*
  Delegated navigation.

  Every internal anchor containing data-link
  automatically works even if it was generated
  dynamically after the initial page load.
*/

document.addEventListener(
  'click',
  event => {

    const link =
      event.target.closest(
        'a[data-link]'
      );


    if (!link) {
      return;
    }


    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === '_blank' ||
      link.hasAttribute('download')
    ) {

      return;

    }


    event.preventDefault();


    navigate(
      link.getAttribute(
        'href'
      )
    );

  }
);


app.addEventListener(
  'rerender',
  render
);


window.addEventListener(
  'popstate',
  render
);


render();