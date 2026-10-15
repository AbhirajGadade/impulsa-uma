import { getTemplateExample } from "./template-examples.uma-762763cc8b3c.js";

const documents = new Map();
const wordType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const wNamespace = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const relationships = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const pageWidth = 10600;
const escapeXml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
})[character]);

function paragraph(text, options = {}) {
  const { size = 20, color = "273345", bold = false, align = "left", before = 0,
    after = 80, heading = false, bullet = false, line = 260 } = options;
  const properties = [
    heading ? '<w:pStyle w:val="Heading1"/><w:keepNext/>' : options.keepNext ? "<w:keepNext/>" : "",
    '<w:keepLines/>', `<w:jc w:val="${align}"/>`,
    `<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`,
    bullet ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : "",
    options.rule ? `<w:pBdr><w:bottom w:val="single" w:sz="4" w:color="${options.rule}" w:space="5"/></w:pBdr>` : "",
  ].join("");
  return `<w:p><w:pPr>${properties}</w:pPr><w:r><w:rPr>${bold ? "<w:b/>" : ""}<w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function section(title, content, model, { sidebar = false, first = false } = {}) {
  return paragraph(title, {
    heading: true, bold: true, size: sidebar ? 20 : 22, color: model.ink,
    before: first ? 0 : 180, after: 100, rule: model.accent,
  }) + content;
}

function mainSections(model) {
  return model.sections.map((group, index) => section(group.title,
    group.entries.map(entry =>
      paragraph(entry.title, { bold: true, size: 20, before: 60, after: 40, keepNext: true })
      + paragraph(entry.meta, { size: 17, color: "64748b", after: 60, keepNext: true })
      + entry.lines.map(line => paragraph(line, { bullet: true, after: 55 })).join(""),
    ).join(""), model, { first: index === 0 }),
  ).join("");
}

function sidebarSections(model, sidebar = true) {
  const size = sidebar ? 18 : 20;
  return section(model.labels.profile, paragraph(model.profile, { size, after: 75 }), model, { sidebar, first: sidebar })
    + section(model.labels.skills, model.skills.map(skill => paragraph(skill, { size, after: 65 })).join(""), model, { sidebar })
    + section(model.labels.languages, model.languages.map(language => paragraph(language, { size, after: 65 })).join(""), model, { sidebar });
}

const noBorders = '<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/>';

function cell(content, width, { fill = "ffffff", span = 1, padding = 230, bottomRule, edges = {} } = {}) {
  const borders = { ...edges, ...(bottomRule ? { bottom: bottomRule } : {}) };
  const borderXml = ["top", "left", "bottom", "right"].map(side => borders[side]
    ? `<w:${side} w:val="single" w:sz="${borders[side].size}" w:color="${borders[side].color}"/>`
    : `<w:${side} w:val="nil"/>`).join("");
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ""}<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:vAlign w:val="top"/><w:tcMar><w:top w:w="${padding}" w:type="dxa"/><w:left w:w="${padding}" w:type="dxa"/><w:bottom w:w="${padding}" w:type="dxa"/><w:right w:w="${padding}" w:type="dxa"/></w:tcMar><w:tcBorders>${borderXml}</w:tcBorders></w:tcPr>${content}</w:tc>`;
}

function table(rows, columns, borders = noBorders) {
  return `<w:tbl><w:tblPr><w:tblW w:w="${columns.reduce((a, b) => a + b, 0)}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>${borders}</w:tblBorders><w:tblCellSpacing w:w="0" w:type="dxa"/></w:tblPr><w:tblGrid>${columns.map(width => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>${rows.join("")}</w:tbl>`;
}

function photoXml() {
  return '<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="914400" cy="914400"/><wp:docPr id="1" name="Espacio para foto" descr="Marcador de foto editable"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="photo.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdPhoto"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="914400" cy="914400"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>';
}

function photoPlaceholder(model) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 160;
  const context = canvas.getContext("2d");
  context.fillStyle = "#" + model.tint;
  context.fillRect(0, 0, 160, 160);
  context.beginPath(); context.arc(80, 80, 72, 0, Math.PI * 2);
  context.strokeStyle = "#" + model.accent; context.lineWidth = 3; context.stroke();
  context.beginPath(); context.arc(80, 80, 56, 0, Math.PI * 2);
  context.fillStyle = "#cbd2da"; context.fill();
  return canvas.toDataURL("image/png").split(",")[1];
}

function documentBody(model) {
  const centered = ["minimal", "classic"].includes(model.layout);
  const darkHeader = model.layout === "executive";
  const color = darkHeader ? "ffffff" : "172033";
  const headerFill = darkHeader ? model.ink : model.layout === "photo" ? model.tint : "ffffff";
  const align = centered ? "center" : "left";
  const header = paragraph(model.name.toUpperCase(), { bold: true, size: 44, color, align, after: 100 })
    + paragraph(model.role, { bold: true, size: 20, color: darkHeader ? "ffffff" : model.accent, align, after: 120 })
    + paragraph(model.contact.join("  |  "), { size: 16, color: darkHeader ? "e2e8f0" : "64748b", align, after: 0 });
  const headerPadding = 320;
  const innerHeaderWidth = pageWidth - headerPadding * 2;
  const withPhoto = model.layout === "photo"
    ? table(['<w:tr>' + cell(photoXml(), 1800, { fill: headerFill, padding: 0 }) + cell(header, innerHeaderWidth - 1800, { fill: headerFill, padding: 0 }) + '</w:tr>'], [1800, innerHeaderWidth - 1800]) + paragraph("", { size: 2, line: 20, after: 0 })
    : header;
  const singleColumn = model.layout === "minimal";
  const sidebarWidth = model.layout === "classic" ? 3300 : 3700;
  const columns = singleColumn ? [pageWidth] : [sidebarWidth, pageWidth - sidebarWidth];
  const headerRule = ["minimal", "corporate"].includes(model.layout)
    ? { color: model.accent, size: model.layout === "corporate" ? 24 : 10 } : null;
  const leftEdge = ["modern", "photo"].includes(model.layout)
    ? { left: { color: model.accent, size: model.layout === "photo" ? 40 : 64 } } : {};
  const rightEdge = model.layout === "corporate" ? { right: { color: model.tint, size: 80 } } : {};
  const topEdge = ["executive", "classic"].includes(model.layout)
    ? { top: { color: model.accent, size: model.layout === "executive" ? 80 : 32 } } : {};
  const rows = [
    '<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="1600" w:hRule="atLeast"/></w:trPr>'
      + cell(withPhoto, pageWidth, { fill: headerFill, span: columns.length, padding: headerPadding, bottomRule: headerRule, edges: { ...leftEdge, ...rightEdge, ...topEdge } }) + '</w:tr>',
    '<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="9600" w:hRule="atLeast"/></w:trPr>'
      + (singleColumn
        ? cell(mainSections(model) + sidebarSections(model, false), pageWidth, { padding: 360 })
        : cell(sidebarSections(model), sidebarWidth, { fill: model.tint, padding: 240, edges: leftEdge })
          + cell(mainSections(model), pageWidth - sidebarWidth, { padding: 280, edges: rightEdge }))
      + '</w:tr>',
  ];
  return table(rows, columns) + paragraph(model.labels.note, { size: 14, color: "64748b", before: 180, after: 0 });
}

// Both preview and download consume the bytes returned here. No placeholder DOCX is used.
export async function createTemplateDocument(template, { type = "arraybuffer", zipLibrary = globalThis.JSZip, photoData } = {}) {
  if (!zipLibrary) throw new Error("El generador Word no está disponible. Recarga la página.");
  const model = getTemplateExample(template);
  const zip = new zipLibrary();
  const photo = model.layout === "photo";
  zip.file("[Content_Types].xml", declaration + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>');
  zip.file("_rels/.rels", declaration + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${relationships}/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file("word/_rels/document.xml.rels", declaration + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="${relationships}/styles" Target="styles.xml"/><Relationship Id="rIdNumbering" Type="${relationships}/numbering" Target="numbering.xml"/>${photo ? `<Relationship Id="rIdPhoto" Type="${relationships}/image" Target="media/photo.png"/>` : ""}</Relationships>`);
  zip.file("word/styles.xml", declaration + `<w:styles xmlns:w="${wNamespace}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="20"/><w:color w:val="273345"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="90" w:line="280" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="Heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="${model.ink}"/></w:rPr></w:style></w:styles>`);
  zip.file("word/numbering.xml", declaration + `<w:numbering xmlns:w="${wNamespace}"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="220"/></w:tabs><w:ind w:left="220" w:hanging="160"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
  zip.file("word/document.xml", declaration + `<w:document xmlns:w="${wNamespace}" xmlns:r="${relationships}" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${documentBody(model)}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="650" w:right="653" w:bottom="650" w:left="653" w:header="0" w:footer="0"/></w:sectPr></w:body></w:document>`);
  if (photo) zip.file("word/media/photo.png", photoData || photoPlaceholder(model), { base64: true });
  return zip.generateAsync({ type, mimeType: wordType, compression: "DEFLATE" });
}

export function getTemplateDocument(template) {
  if (!documents.has(template.id)) {
    const pending = createTemplateDocument(template).catch(error => { documents.delete(template.id); throw error; });
    documents.set(template.id, pending);
  }
  return documents.get(template.id);
}

export async function downloadTemplateDocument(template) {
  const data = await getTemplateDocument(template);
  const blob = new Blob([data], { type: wordType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const profile = template.experiencia === "sin" ? "junior" : template.experiencia === "con" ? "experiencia" : String(template.id);
  anchor.href = url;
  anchor.download = `CV_UMA_${template.facultad}_${profile}.docx`;
  document.body.appendChild(anchor);
  try { anchor.click(); } finally { anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000); }
}
