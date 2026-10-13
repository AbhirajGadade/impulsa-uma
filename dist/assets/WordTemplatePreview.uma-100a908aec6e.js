import { j as jsx } from "./motion-CbgZZ6e6.uma-100a908aec6e.js";
import { r as React } from "./vendor-DwWQ8ttR.uma-100a908aec6e.js";
import { getTemplateDocument } from "./template-documents.uma-100a908aec6e.js";
import { getTemplateExample } from "./template-examples.uma-100a908aec6e.js";

let rendererPromise;
let previewId = 0;

function loadRenderer() {
  if (globalThis.docx?.renderAsync) return Promise.resolve(globalThis.docx);
  if (!rendererPromise) {
    rendererPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/vendor/docx-preview-0.4.1.min.js";
      script.onload = () => globalThis.docx?.renderAsync
        ? resolve(globalThis.docx) : reject(new Error("No se pudo iniciar la vista previa."));
      script.onerror = () => { script.remove(); reject(new Error("No se pudo cargar la vista previa.")); };
      document.head.appendChild(script);
    }).catch(error => { rendererPromise = null; throw error; });
  }
  return rendererPromise;
}

export function WordTemplatePreview({ template, large = false }) {
  const frameRef = React.useRef(null);
  const hostRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  if (!instanceRef.current) instanceRef.current = "tplword" + (++previewId);
  const [status, setStatus] = React.useState("loading");

  React.useEffect(() => {
    let cancelled = false;
    let started = false;
    let resizeObserver;
    let intersectionObserver;
    const frame = frameRef.current;
    const host = hostRef.current;
    const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    setStatus("loading");

    const start = async () => {
      if (started || cancelled) return;
      started = true;
      intersectionObserver?.disconnect();
      try {
        const [renderer, data] = await Promise.all([loadRenderer(), getTemplateDocument(template)]);
        if (cancelled) return;
        shadow.replaceChildren();
        const reset = document.createElement("style");
        reset.textContent = ":host{display:block}*{box-sizing:border-box}p{margin:0}.word-page{position:absolute;top:0;left:0;transform-origin:top left;width:794px}section{margin:0!important;box-shadow:none!important;background:white}article{margin:0!important}";
        const styles = document.createElement("div");
        const pages = document.createElement("div");
        pages.className = "word-page";
        shadow.append(reset, styles, pages);
        await renderer.renderAsync(data, pages, styles, {
          className: instanceRef.current,
          inWrapper: false,
          breakPages: false,
          ignoreWidth: false,
          ignoreHeight: false,
          useBase64URL: true,
          renderHeaders: true,
          renderFooters: true,
        });
        if (cancelled) return;
        const page = pages.querySelector("section");
        if (!page) throw new Error("El documento no contiene una página.");
        const fit = () => {
          if (cancelled) return;
          const width = page.offsetWidth || 794;
          pages.style.width = width + "px";
          pages.style.transform = `scale(${frame.clientWidth / width})`;
        };
        fit();
        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(fit);
          resizeObserver.observe(frame);
        }
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    if (large || typeof IntersectionObserver === "undefined") start();
    else {
      intersectionObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) start();
      }, { rootMargin: "250px" });
      intersectionObserver.observe(frame);
    }
    return () => {
      cancelled = true;
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
    };
  }, [template.id, large]);

  return jsx.jsxs("div", {
    ref: frameRef,
    className: `tpl-resume tpl-word-preview${large ? " is-large" : ""}`,
    role: "img",
    "aria-label": `CV de ejemplo de ${getTemplateExample(template).name}`,
    "aria-busy": status === "loading",
    children: [
      jsx.jsx("div", { ref: hostRef, className: "tpl-word-host" }),
      status !== "ready" && jsx.jsx("span", {
        className: "tpl-word-status",
        children: status === "error" ? "Vista previa no disponible" : "Cargando CV…",
      }),
    ],
  });
}
