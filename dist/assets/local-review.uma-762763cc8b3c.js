// CV extraction stays in the user's browser; no remote analysis endpoint.
export async function readCv(file) {
  if (!file) throw new Error('Selecciona un archivo para analizar.');
  if (file.size > 10 * 1024 * 1024) throw new Error('El archivo supera los 10 MB.');
  const ext = file.name.split('.').pop().toLowerCase();
  let text = '';
  if (ext === 'txt') text = await file.text();
  else if (ext === 'docx') {
    const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
    const entry = zip.file('word/document.xml');
    if (!entry) throw new Error('El archivo no contiene un documento Word válido.');
    if (entry._data?.uncompressedSize > 4000000) throw new Error('El documento es demasiado extenso.');
    const dom = new DOMParser().parseFromString(await entry.async('string'), 'application/xml');
    if (dom.querySelector('parsererror')) throw new Error('No se pudo leer el documento.');
    text = Array.from(dom.getElementsByTagNameNS('*', 'p')).map(p => Array.from(p.getElementsByTagNameNS('*', 't')).map(t => t.textContent).join('')).join('\n');
  } else if (ext === 'pdf') {
    const pdfjs = await import('/vendor/pdf.min.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.mjs';
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), cMapUrl: '/vendor/cmaps/', cMapPacked: true, standardFontDataUrl: '/vendor/standard_fonts/' }).promise;
    try {
      if (pdf.numPages > 20) throw new Error('El PDF supera las 20 páginas. Pega solo el texto de tu CV.');
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await (await pdf.getPage(i)).getTextContent();
        pages.push(page.items.map(t => t.str + (t.hasEOL ? '\n' : ' ')).join(''));
      }
      text = pages.join('\n');
    } finally { await pdf.destroy(); }
  } else throw new Error('Elige un archivo PDF, DOCX o TXT.');
  if (!text.trim()) throw new Error('No se encontró texto. Si tu PDF es una imagen, pega el texto del CV.');
  if (text.length > 100000) throw new Error('El documento es demasiado extenso. Pega solo tu CV.');
  return text;
}
