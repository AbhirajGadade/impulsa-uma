import { j as e, A as AnimatePresence, m as motion } from "./motion-CbgZZ6e6.uma-100a908aec6e.js";
import { r as React } from "./vendor-DwWQ8ttR.uma-100a908aec6e.js";
import { I as Icon } from "./index-DSiOxGBJ.uma-100a908aec6e.js";
import { A as AnimatedSection } from "./AnimatedSection-a29Q7Nj3.uma-100a908aec6e.js";
import {
  C as templates,
  F as filters,
  a as facultyLabels,
  D as DownloadModal,
} from "./cvs-CSTab4zF.uma-100a908aec6e.js";
import "./textNormalizer-DelE0G2e.uma-100a908aec6e.js";
import { WordTemplatePreview } from "./WordTemplatePreview.uma-100a908aec6e.js";
import { downloadTemplateDocument } from "./template-documents.uma-100a908aec6e.js";

const experienceOptions = [
  { id: "all", label: "Todos los perfiles" },
  { id: "con", label: "Con experiencia" },
  { id: "sin", label: "Primer empleo / Prácticas" },
];

const facultyIcons = {
  general: "fileText",
  derecho: "bookOpen",
  ingenieria: "code2",
  negocios: "briefcase",
  salud: "stethoscope",
  farmacia: "stethoscope",
  internacional: "globe",
};

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.045 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function builderHref(template) {
  const params = new URLSearchParams({
    template: String(template.builderTemplateId),
    origen: "plantillas",
  });

  if (template.facultad && template.facultad !== "internacional") {
    params.set("facultad", template.facultad);
  }

  if (template.experiencia) {
    params.set("experiencia", template.experiencia);
  }

  return `/crear?${params.toString()}`;
}

function ResumeArtwork({ template, large = false }) {
  return e.jsx(WordTemplatePreview, { template, large });
}

function PreviewDialog({ template, onClose, onDownload }) {
  const closeRef = React.useRef(null);

  React.useEffect(() => {
    if (!template) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [template, onClose]);

  if (!template) return null;

  return e.jsx("div", {
    className: "tpl-preview-modal-overlay",
    onClick: onClose,
    children: e.jsxs("section", {
      className: "tpl-preview-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "template-preview-title",
      onClick: (event) => event.stopPropagation(),
      children: [
        e.jsx("button", {
          ref: closeRef,
          type: "button",
          className: "tpl-preview-close",
          onClick: onClose,
          "aria-label": "Cerrar vista previa",
          children: e.jsx(Icon, { name: "x", size: 20 }),
        }),
        e.jsx("div", {
          className: "tpl-preview-modal-art",
          children: e.jsx(ResumeArtwork, { template, large: true }),
        }),
        e.jsxs("div", {
          className: "tpl-preview-modal-copy",
          children: [
            e.jsxs("div", {
              className: "tpl-preview-modal-tag",
              children: [
                e.jsx(Icon, {
                  name: facultyIcons[template.facultad] || "fileText",
                  size: 15,
                }),
                facultyLabels[template.facultad],
              ],
            }),
            e.jsx("h2", {
              id: "template-preview-title",
              children: template.carrera,
            }),
            e.jsx("p", { children: template.descripcion }),
            e.jsx("p", {
              className: "tpl-example-note",
              children: "Este es el mismo documento Word que descargarás, con un CV ficticio editable. Reemplaza sus datos con tu información real.",
            }),
            e.jsxs("ul", {
              className: "tpl-preview-benefits",
              children: [
                e.jsxs("li", {
                  children: [e.jsx(Icon, { name: "check", size: 15 }), "Diseño claro y compatible con procesos ATS"],
                }),
                e.jsxs("li", {
                  children: [e.jsx(Icon, { name: "check", size: 15 }), "Contenido y secciones completamente editables"],
                }),
                e.jsxs("li", {
                  children: [e.jsx(Icon, { name: "check", size: 15 }), "Adaptado al perfil profesional seleccionado"],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "tpl-preview-modal-actions",
              children: [
                e.jsxs("a", {
                  className: "btn btn-primary tpl-modal-use",
                  href: builderHref(template),
                  children: [
                    e.jsx(Icon, { name: "edit3", size: 17 }),
                    "Usar esta plantilla",
                  ],
                }),
                e.jsxs("button", {
                  type: "button",
                  className: "btn btn-secondary",
                  onClick: () => {
                    onClose();
                    onDownload(template);
                  },
                  children: [
                    e.jsx(Icon, { name: "fileDown", size: 17 }),
                    "Descargar Word",
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}

function TemplateCard({ template, onPreview, onDownload }) {
  const badge = template.badge || (template.id === 1 ? "Recomendada" : null);

  return e.jsxs(motion.article, {
    className: "tpl-card",
    variants: cardVariants,
    children: [
      e.jsxs("button", {
        type: "button",
        className: "tpl-card-preview",
        onClick: () => onPreview(template),
        "aria-label": `Ver vista previa de ${template.carrera}`,
        children: [
          badge && e.jsx("span", {
            className: `tpl-card-badge${template.badgeType === "popular" ? " is-popular" : ""}`,
            children: badge,
          }),
          e.jsx("div", {
            className: "tpl-card-paper",
            children: e.jsx(ResumeArtwork, { template }),
          }),
          e.jsxs("span", {
            className: "tpl-preview-action",
            children: [
              e.jsx(Icon, { name: "eye", size: 17 }),
              "Vista previa",
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "tpl-card-body",
        children: [
          e.jsxs("div", {
            className: "tpl-card-meta",
            children: [
              e.jsxs("span", {
                className: `faculty-tag faculty-${template.facultad}`,
                children: [
                  e.jsx(Icon, {
                    name: facultyIcons[template.facultad] || "fileText",
                    size: 13,
                  }),
                  facultyLabels[template.facultad],
                ],
              }),
              e.jsx("span", { className: "tpl-format-label", children: "WORD" }),
            ],
          }),
          e.jsx("h3", { className: "tpl-card-title", children: template.carrera }),
          e.jsx("p", { className: "tpl-card-desc", children: template.descripcion }),
          e.jsxs("div", {
            className: "tpl-card-features",
            children: [
              e.jsxs("span", {
                children: [e.jsx(Icon, { name: "check", size: 12 }), "ATS"],
              }),
              e.jsxs("span", {
                children: [e.jsx(Icon, { name: "check", size: 12 }), "Editable"],
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "tpl-card-actions",
        children: [
          e.jsxs("a", {
            className: "tpl-use-button",
            href: builderHref(template),
            children: [
              "Usar plantilla",
              e.jsx(Icon, { name: "arrowRight", size: 16 }),
            ],
          }),
          e.jsx("button", {
            type: "button",
            className: "tpl-download-button",
            onClick: () => onDownload(template),
            title: "Descargar plantilla editable en Word",
            "aria-label": `Descargar ${template.carrera} en Word`,
            children: e.jsx(Icon, { name: "fileDown", size: 18 }),
          }),
        ],
      }),
    ],
  }, template.id);
}

function TemplatesPage() {
  const [faculty, setFaculty] = React.useState(() =>
    new URLSearchParams(location.search).get("facultad") ||
    new URLSearchParams(location.search).get("area") ||
    "all",
  );
  const [experience, setExperience] = React.useState("all");
  const [downloadTemplate, setDownloadTemplate] = React.useState(null);
  const [downloadOpen, setDownloadOpen] = React.useState(false);
  const [previewTemplate, setPreviewTemplate] = React.useState(null);

  const visibleTemplates = React.useMemo(
    () => templates.filter((template) => {
      const matchesFaculty = faculty === "all" || template.facultad === faculty;
      const matchesExperience = experience === "all" || template.experiencia === null || template.experiencia === experience;
      return matchesFaculty && matchesExperience;
    }),
    [faculty, experience],
  );

  const showExperience = faculty === "all" || ["derecho", "ingenieria", "negocios", "salud", "farmacia"].includes(faculty);

  const openDownload = (template) => {
    setDownloadTemplate(template);
    setDownloadOpen(true);
  };

  const downloadWord = downloadTemplateDocument;

  return e.jsxs("section", {
    className: "tpl-page",
    children: [
      e.jsx("div", {
        className: "tpl-hero",
        children: e.jsxs("div", {
          className: "container tpl-hero-inner",
          children: [
            e.jsxs("div", {
              className: "tpl-hero-copy",
              children: [
                e.jsxs("div", {
                  className: "tpl-eyebrow",
                  children: [
                    e.jsx(Icon, { name: "sparkles", size: 15 }),
                    "Plantillas profesionales UMA",
                  ],
                }),
                e.jsx("h1", { children: "Elige un CV que haga visible tu potencial" }),
                e.jsx("p", {
                  children: "Explora diseños modernos, editables y preparados para una lectura rápida. Personalízalos en el creador o descárgalos en Word.",
                }),
                e.jsxs("div", {
                  className: "tpl-hero-proof",
                  children: [
                    e.jsxs("span", { children: [e.jsx(Icon, { name: "checkCircle", size: 15 }), "16 diseños"] }),
                    e.jsxs("span", { children: [e.jsx(Icon, { name: "shieldCheck", size: 15 }), "Compatibles con ATS"] }),
                    e.jsxs("span", { children: [e.jsx(Icon, { name: "fileDown", size: 15 }), "Word editable"] }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className: "tpl-hero-stack",
              "aria-hidden": "true",
              children: [1, 4, 8].map((id, index) => {
                const template = templates.find((item) => item.id === id) || templates[index];
                return e.jsx("div", {
                  className: `tpl-hero-sheet sheet-${index + 1}`,
                  children: e.jsx(ResumeArtwork, { template }),
                }, id);
              }),
            }),
          ],
        }),
      }),
      e.jsxs("div", {
        className: "container tpl-gallery",
        children: [
          e.jsx(AnimatedSection, {
            className: "tpl-filter-panel",
            children: e.jsxs("div", {
              children: [
                e.jsx("p", { className: "tpl-filter-label", children: "Filtrar por área" }),
                e.jsx("div", {
                  className: "tpl-chips-row",
                  children: filters.map((filter) =>
                    e.jsxs("button", {
                      type: "button",
                      className: `tpl-chip${faculty === filter.id ? " active" : ""}`,
                      onClick: () => {
                        setFaculty(filter.id);
                        setExperience("all");
                      },
                      children: [
                        e.jsx(Icon, { name: facultyIcons[filter.id] || "layers", size: 14 }),
                        filter.label,
                      ],
                    }, filter.id),
                  ),
                }),
                showExperience && e.jsxs("div", {
                  className: "tpl-experience-filter",
                  children: [
                    e.jsx("span", { children: "Nivel:" }),
                    e.jsx("div", {
                      className: "tpl-exp-row",
                      children: experienceOptions.map((option) =>
                        e.jsx("button", {
                          type: "button",
                          className: `tpl-exp-chip${experience === option.id ? " active" : ""}`,
                          onClick: () => setExperience(option.id),
                          children: option.label,
                        }, option.id),
                      ),
                    }),
                  ],
                }),
              ],
            }),
          }),
          e.jsxs("div", {
            className: "tpl-results-heading",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("h2", { children: faculty === "all" ? "Todos los diseños" : facultyLabels[faculty] }),
                  e.jsxs("p", { children: ["Mostrando ", visibleTemplates.length, " de ", templates.length, " plantillas"] }),
                ],
              }),
              e.jsx("span", { children: "Selecciona una plantilla para empezar" }),
            ],
          }),
          faculty === "internacional" && e.jsxs(AnimatedSection, {
            delay: 0.05,
            className: "tpl-intl-banner",
            children: [
              e.jsx("div", { className: "tpl-intl-icon", children: e.jsx(Icon, { name: "globe", size: 21 }) }),
              e.jsxs("div", {
                children: [
                  e.jsx("strong", { children: "Formatos para postulaciones internacionales" }),
                  e.jsx("p", { children: "Modelos orientativos para Alemania, Canadá, China, España y Reino Unido." }),
                ],
              }),
            ],
          }),
          e.jsx(AnimatePresence, {
            mode: "wait",
            children: visibleTemplates.length === 0
              ? e.jsx(motion.div, {
                  className: "tpl-empty",
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  children: "No encontramos plantillas con estos filtros.",
                }, "empty")
              : e.jsx(motion.div, {
                  className: "tpl-grid",
                  variants: gridVariants,
                  initial: "hidden",
                  animate: "show",
                  exit: "hidden",
                  children: visibleTemplates.map((template) =>
                    e.jsx(TemplateCard, {
                      template,
                      onPreview: setPreviewTemplate,
                      onDownload: openDownload,
                    }, template.id),
                  ),
                }, `${faculty}-${experience}`),
          }),
          e.jsx(AnimatedSection, {
            delay: 0.1,
            className: "tpl-bottom-cta",
            children: e.jsxs("div", {
              children: [
                e.jsxs("span", {
                  className: "tpl-bottom-icon",
                  children: [e.jsx(Icon, { name: "edit3", size: 20 })],
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", { children: "¿Prefieres construir tu CV paso a paso?" }),
                    e.jsx("p", { children: "Completa tu información una sola vez y prueba diferentes diseños en el creador UMA." }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      e.jsx(PreviewDialog, {
        template: previewTemplate,
        onClose: () => setPreviewTemplate(null),
        onDownload: openDownload,
      }),
      e.jsx(DownloadModal, {
        isOpen: downloadOpen,
        onClose: () => setDownloadOpen(false),
        cv: downloadTemplate,
        onSuccessDownload: downloadWord,
      }),
    ],
  });
}

export { TemplatesPage as default };
