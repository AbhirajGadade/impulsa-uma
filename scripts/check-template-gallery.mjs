// Local browser QA for the actual Word preview/download path. Requires Chrome or Edge.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { getTemplateExample } from "../src/portal/template-examples.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const qa = path.join(root, ".codex", "template-qa");
mkdirSync(qa, { recursive: true });
const downloadPath = mkdtempSync(path.join(qa, "downloads-"));
const profile = mkdtempSync(path.join(qa, "browser-"));
const browserPath = process.env.TEMPLATE_QA_BROWSER || [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find(existsSync);
if (!browserPath) throw new Error("Set TEMPLATE_QA_BROWSER to a local Chrome/Edge executable.");
const url = process.env.TEMPLATE_QA_URL || "http://127.0.0.1:5174/plantillas";
const catalog = readFileSync(path.join(root, "src/portal/cvs-CSTab4zF.js"), "utf8");
const templates = JSON.parse(catalog.slice(catalog.indexOf("const Q=") + 8, catalog.indexOf(",X=[")));
const { release } = JSON.parse(readFileSync(path.join(root, "src/portal-build.json"), "utf8"));
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check, message, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { const result = await check(); if (result) return result; await pause(150); }
  throw new Error(message);
}

const browser = spawn(browserPath, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--disable-background-networking", "--disable-extensions", "--disable-component-update",
  "--remote-debugging-port=0", "--remote-debugging-address=127.0.0.1",
  `--user-data-dir=${profile}`, "about:blank",
], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
let browserLogs = "";
browser.stderr.on("data", chunk => { browserLogs += chunk.toString(); });
browser.on("error", error => { browserLogs += error.message; });
let socket;
try {
  await until(() => existsSync(path.join(profile, "DevToolsActivePort")), "Browser could not start: " + browserLogs);
  const port = readFileSync(path.join(profile, "DevToolsActivePort"), "utf8").split(/\r?\n/)[0];
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(tabs.find(tab => tab.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const packet = JSON.parse(event.data);
    if (!packet.id) return;
    const request = pending.get(packet.id);
    if (!request) return;
    pending.delete(packet.id);
    clearTimeout(request.timer);
    packet.error ? request.reject(new Error(JSON.stringify(packet.error))) : request.resolve(packet.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error("CDP timeout: " + method)); }, 15000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (fn, ...args) => {
    const response = await send("Runtime.evaluate", {
      expression: `(${fn.toString()})(${args.map(arg => JSON.stringify(arg)).join(",")})`,
      awaitPromise: true, returnByValue: true,
    });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath });
  await send("Page.navigate", { url });
  await until(() => evaluate(() => document.querySelectorAll(".tpl-card").length === 16), "Gallery did not render 16 cards.");
  const desktopPreview = await evaluate(() => {
    const preview = document.querySelector(".tpl-card-preview").getBoundingClientRect();
    const paper = document.querySelector(".tpl-card-paper").getBoundingClientRect();
    return { height: preview.height, paperHeight: paper.height, paperTop: paper.top, top: preview.top };
  });
  assert.ok(desktopPreview.height <= 225, "Desktop template previews should stay compact.");
  assert.ok(desktopPreview.paperTop >= desktopPreview.top, "The compact preview must show the document header.");
  const zipModule = { exports: {} };
  const zipContext = { module: zipModule, exports: zipModule.exports, Buffer, Uint8Array, ArrayBuffer, setTimeout, clearTimeout, setImmediate };
  vm.runInNewContext(readFileSync(path.join(root, "public/vendor/jszip.min.js"), "utf8"), zipContext);
  const JSZip = zipContext.module.exports;
  const results = [];

  for (let index = 0; index < templates.length; index++) {
    const template = templates[index];
    const example = getTemplateExample(template);
    await evaluate(index => document.querySelectorAll(".tpl-card-preview")[index].click(), index);
    await until(() => evaluate(() => {
      const frame = document.querySelector(".tpl-preview-modal-art .tpl-word-preview");
      return frame && frame.getAttribute("aria-busy") === "false";
    }), "Preview did not finish for " + template.id);
    const rendered = await evaluate(() => {
      const host = document.querySelector(".tpl-preview-modal-art .tpl-word-host");
      const page = host?.shadowRoot?.querySelector("section");
      if (!page) return { error: "No rendered Word page" };
      return {
        text: page.textContent,
        height: page.scrollHeight,
        nominalHeight: parseFloat(getComputedStyle(page).minHeight),
        width: page.offsetWidth,
        tableWidth: page.querySelector("table")?.offsetWidth,
        horizontalOverflow: page.scrollWidth > page.offsetWidth + 2,
        images: [...page.querySelectorAll("img")].map(image => ({ loaded: image.complete && image.naturalWidth > 0 })),
      };
    });
    assert.equal(rendered.error, undefined, template.id + ": Word renderer error");
    assert.ok(rendered.text.includes(example.name.toUpperCase()), template.id + ": correct identity");
    assert.ok(rendered.text.includes(example.experience[0].title), template.id + ": correct area/profile example");
    assert.ok(!rendered.text.includes("[NOMBRES"), template.id + ": no old placeholder file");
    assert.ok(rendered.height <= rendered.nominalHeight + 2, template.id + ": content overflows A4 page " + JSON.stringify(rendered));
    assert.equal(rendered.horizontalOverflow, false, template.id + ": content exceeds the page width");
    assert.ok(rendered.images.every(image => image.loaded), template.id + ": missing photo placeholder");

    // Clone the rendered page at full A4 size for readable visual QA.
    await evaluate(() => {
      const source = document.querySelector(".tpl-preview-modal-art .tpl-word-host").shadowRoot;
      const overlay = document.createElement("div");
      overlay.id = "template-qa-page";
      overlay.style.cssText = "position:fixed;inset:0 auto auto 0;width:794px;height:1123px;background:white;z-index:100000";
      const shadow = overlay.attachShadow({ mode: "open" });
      for (const child of source.children) shadow.appendChild(child.cloneNode(true));
      shadow.querySelector(".word-page").style.transform = "scale(1)";
      document.body.appendChild(overlay);
    });
    await pause(100);
    const scroll = await evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
    const image = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: scroll.x, y: scroll.y, width: 794, height: 1123, scale: 1 } });
    writeFileSync(path.join(qa, `template-${template.id}.png`), Buffer.from(image.data, "base64"));
    await evaluate(() => document.querySelector("#template-qa-page").remove());
    const previewHash = await evaluate(async (id, release) => {
      const { C: templates } = await import(`/assets/cvs-CSTab4zF.uma-${release}.js`);
      const { getTemplateDocument } = await import(`/assets/template-documents.uma-${release}.js`);
      const bytes = await getTemplateDocument(templates.find(template => template.id === id));
      return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(value => value.toString(16).padStart(2, "0")).join("");
    }, template.id, release);
    await evaluate(() => document.querySelector(".tpl-preview-modal-actions button").click());
    await until(() => evaluate(() => !!document.querySelector(".dl-modal .btn-primary")), "Download dialog did not open.");
    await evaluate(() => document.querySelector(".dl-modal .btn-primary").click());
    const profileName = template.experiencia === "sin" ? "junior" : template.experiencia === "con" ? "experiencia" : String(template.id);
    const file = path.join(downloadPath, `CV_UMA_${template.facultad}_${profileName}.docx`);
    await until(() => existsSync(file), "Missing download for " + template.id);
    const buffer = readFileSync(file);
    assert.equal(createHash("sha256").update(buffer).digest("hex"), previewHash, template.id + ": preview and download bytes differ");
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file("word/document.xml").async("string");
    assert.ok(xml.includes(example.name.toUpperCase()));
    assert.ok(xml.includes(example.accent));
    results.push({ id: template.id, layout: example.layout, name: example.name, bytes: buffer.length, pageHeight: rendered.height, previewMatchesDownload: true });
    console.log(`Verified template ${template.id}: ${example.name} / ${example.layout}`);
    await until(() => evaluate(() => !document.querySelector(".dl-modal")), "Download dialog did not close.");
  }
  await evaluate(() => document.querySelector(".tpl-gallery").scrollIntoView());
  await pause(150);
  const galleryShot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(qa, "gallery.png"), Buffer.from(galleryShot.data, "base64"));
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
  await evaluate(() => document.querySelector(".tpl-gallery").scrollIntoView());
  await pause(200);
  const mobilePreview = await evaluate(() => {
    const preview = document.querySelector(".tpl-card-preview").getBoundingClientRect();
    const paper = document.querySelector(".tpl-card-paper").getBoundingClientRect();
    return { height: preview.height, paperTop: paper.top, top: preview.top, paperBottom: paper.bottom, bottom: preview.bottom };
  });
  assert.ok(mobilePreview.height <= 275, "Mobile template previews should stay compact.");
  assert.ok(mobilePreview.paperTop >= mobilePreview.top && mobilePreview.paperBottom <= mobilePreview.bottom, "Mobile previews must display the whole page.");
  const mobileShot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(qa, "gallery-mobile.png"), Buffer.from(mobileShot.data, "base64"));
  writeFileSync(path.join(qa, "results.json"), JSON.stringify({ release, results }, null, 2));
  console.log(`PASS: all ${results.length} DOCX downloads match their rendered previews. Visual QA: ${qa}`);
} finally {
  socket?.close();
  browser.kill();
}
