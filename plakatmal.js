// plakatmal.js — lagar ein plakat rett frå ein mal i tenester.json.
//
// Blir brukt av oversikta (oversikt.html) og plakatkarusellen
// (plakatkarusell.html). Plakatar som «følgjer malen» står i karusellen berre
// som «mal=<id>&folg=1». Teksten blir henta frå tenester.json kvar gong
// plakaten blir vist, så ei endring i malen kjem på skjermane av seg sjølv.
//
// Resultatet er det same som når du vel malen i plakatbyggjaren og ikkje
// endrar noko (sjå brukMal og lesSkjema i plakat.html – endrar du dei, må
// dette følgje med).

// Gir det som står etter # i plakatlenkja (utan vis=1), eller "" om malen ikkje finst.
function plakatFråMal(data, id) {
  const tn = ((data && data.tenester) || []).find(t => t.id === id);
  if (!tn) return "";
  const sel = tn.standardbilete || (tn.bilete && tn.bilete[0] ? tn.bilete[0].fil : "ikon");
  const b = (tn.bilete || []).find(x => x.fil === sel);
  const eige = !b && sel !== "ikon" && !sel.startsWith("anim:");
  const cfg = {
    mal: tn.id,
    overlinje: tn.overlinje ?? "Digitalt bibliotek",
    overskrift: tn.overskrift || tn.namn,
    logo: tn.logo && tn.brukLogo !== false ? tn.logo : "",
    avsendar: tn.avsendarlogo && tn.brukAvsendar !== false ? tn.avsendarlogo : "",
    tekst: tn.tekst || "", merkelapp: tn.merkelapp || "",
    bilete: sel === "ingen" ? "" : sel,
    biletform: b && b.form === "foto" ? "foto" : eige ? (tn.standardbiletform || "") : "",
    kjelde: b && b.kjelde ? b.kjelde : "",
    ikon: tn.ikon || "",
    lenkje: tn.lenkje || data.standardlenkje || "",
    qrtekst: tn.qrtekst ?? "Skann for å kome i gang",
    tema: tn.tema || "lys",
    skrift: tn.skrift && tn.skrift !== "standard" ? tn.skrift : "",
  };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(cfg)) if (v) p.set(k, v);
  return p.toString();
}

// Følgjer denne plakaten malen?
const følgjerMal = h => new URLSearchParams(h).get("folg") === "1";

// Ein plakat slik han skal visast: plakatar som følgjer malen, blir fylte ut
// frå malen. «til» blir med vidare. "" om malen ikkje finst (lenger).
function løysPlakat(data, h) {
  if (!følgjerMal(h)) return h;
  const p = new URLSearchParams(h);
  const ut = plakatFråMal(data, p.get("mal"));
  if (!ut) return "";
  const q = new URLSearchParams(ut);
  if (p.get("til")) q.set("til", p.get("til"));
  return q.toString();
}

// Sider som kan stå i ein plakatkarusell som om dei var plakatar («side=klokke»).
// Dei blir opna som eiga side i staden for plakat.html.
// Vala frå plakatbyggjaren (variant=…, utan=…, fodd=1, tema=…) står i same lenkja og blir sende vidare.
const PLAKATSIDER = {
  klokke: { namn: "Klokke, vêr og ferje", fil: "klokke.html" },
};
const KLOKKEVARIANTAR = { klokke: "Klokke", ver: "Klokke og meir vêr", vertavle: "Vêrtavle" };
const plakatside = h => PLAKATSIDER[new URLSearchParams(h).get("side")] || null;
// Namnet på ei plakatside, med varianten: «Klokke, vêr og ferje (Vêrtavle)»
function plakatsideNamn(h) {
  const s = plakatside(h), p = new URLSearchParams(h);
  if (!s) return "";
  const v = p.get("side") === "klokke" && p.get("variant") && KLOKKEVARIANTAR[p.get("variant")];
  return s.namn + (v ? " (" + v + ")" : "") + (p.get("fodd") === "1" ? " + Fødd i dag" : "");
}
// Adressa ein plakat (eller ei plakatside) blir opna med, relativt til mappa på GitHub Pages
function plakatAdresse(data, h) {
  const s = plakatside(h);
  if (s) { const p = new URLSearchParams(h); p.delete("til"); return s.fil + "#vis=1&" + p.toString(); }
  const l = løysPlakat(data, h);
  return l ? "plakat.html#vis=1&" + l : "";
}

// ---- Arrangement frå nettsida (Bibliotek.no) ----------------------------
// Eitt element i plakatkarusellen, «arr=nettside&tema=lys», blir til éin plakat
// per arrangement, dei neste ARR_TAL. Arrangementa blir henta frå API-et til
// nettsida (sjå prosjektdokumentet bibliotekno-api), høgst kvart tiande minutt
// (API-et sjølv oppdaterer seg ikkje oftare). Sist henta svar blir teke vare på
// i nettlesaren, så plakatane kan visast sjølv om nettet er nede. Ein plakat
// forsvinn når arrangementet er over. Ingen arrangement → elementet blir hoppa over.
// For testing: «fra=2026-01-01» i elementet tek med arrangement som alt er haldne.
const ARR_TAL = 5;
const ARR_API = "https://www.tysnesbibliotek.no/api/v1/events";
const ARR_HOVUD = { "Client-Identifier": "Tysnes folkebibliotek infoskjerm (biblioteket@tysnes.kommune.no)" };
const ARR_KVART_MS = 10 * 60000;
const ARR_STANDARDTEMA = "lys";
const erArrangement = h => new URLSearchParams(h).get("arr") === "nettside";
const arrFrå = h => (new URLSearchParams(h).get("fra") || "").replace(/[^0-9-]/g, "");
const arrLager = h => "infoskjerm-arrangement" + (arrFrå(h) ? ":" + arrFrå(h) : "");
const arrMinne = {};   // per lager: { data, henta, forsøkt }
function arrLes(h) {
  const k = arrLager(h);
  if (!arrMinne[k]) {
    let m = null;
    try { m = JSON.parse(localStorage.getItem(k) || "null"); } catch (e) {}
    arrMinne[k] = { data: m && Array.isArray(m.data) ? m.data : null, henta: (m && m.henta) || 0, forsøkt: 0 };
  }
  return arrMinne[k];
}
// Hentar arrangementa (høgst kvart tiande minutt). Gjer ingenting om nettet er nede.
async function hentArrangement(h) {
  const m = arrLes(h);
  if (Date.now() - m.forsøkt < ARR_KVART_MS) return;
  m.forsøkt = Date.now();
  const q = new URLSearchParams({ view: "full", limit: String(ARR_TAL) });
  if (arrFrå(h)) q.set("from", arrFrå(h));
  try {
    const svar = await fetch(ARR_API + "?" + q, { headers: ARR_HOVUD, cache: "no-cache", signal: AbortSignal.timeout(8000) });
    if (!svar.ok) throw new Error("HTTP " + svar.status);
    const d = await svar.json();
    if (!d || !Array.isArray(d.data)) throw new Error("uventa svar");
    m.data = d.data; m.henta = Date.now();
    try { localStorage.setItem(arrLager(h), JSON.stringify({ data: m.data, henta: m.henta })); } catch (e) {}
  } catch (e) { console.warn("Fekk ikkje henta arrangementa:", e.message); }
}
// Når er arrangementet over? Utan sluttid: ved slutten av dagen det byrjar.
function arrSlutt(ev) {
  if (ev.endsAt) return new Date(ev.endsAt);
  const d = new Date(String(ev.startsAt || "").slice(0, 10) + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d;
}
// Dei arrangementa som skal visast no (null = aldri henta)
function arrangementNo(h) {
  const m = arrLes(h);
  if (!m.data) return null;
  const no = new Date();
  return m.data.filter(ev => ev && ev.title && ev.startsAt && (arrFrå(h) || arrSlutt(ev) > no)).slice(0, ARR_TAL);
}

const ARR_MÅLGRUPPE = {
  children: "barn", "older-children": "større barn", youth: "ungdom", adults: "vaksne",
  kindergartens: "barnehagar", "schools-and-school-classes": "skuleklassar",
};
const ARR_STATUS = {
  "almost-full": "Nesten fullt", full: "Fullt", "fully-booked": "Fullt", "sold-out": "Utselt",
  cancelled: "Avlyst", canceled: "Avlyst", postponed: "Utsett", "waiting-list": "Venteliste", waitlist: "Venteliste",
};
const MÅNAD_KORT = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
// Felt som kan vere tekst eller objekt med namn/merkelapp
const arrTekst = x => typeof x === "string" ? x : x && (x.label || x.name || x.title || x.id) || "";
const arrId = x => typeof x === "string" ? x : x && (x.id || x.key || x.value) || "";
// Kort ingress: teaser, elles første avsnitt i body (CommonMark utan formatering)
function arrIngress(ev) {
  let t = ev.teaser || "";
  if (!t && Array.isArray(ev.body)) {
    const b = ev.body.find(b => b && typeof (b.text || b.content || b.markdown) === "string");
    t = b ? (b.text || b.content || b.markdown) : "";
  }
  t = String(t).replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_#>`]+/g, "").split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim();
  if (t.length > 200) t = t.slice(0, 200).replace(/\s+\S*$/, "") + " …";
  return t;
}
function arrBilete(ev) {
  const b = Array.isArray(ev.images) ? ev.images[0] : ev.image;
  if (!b) return { url: "", kjelde: "" };
  let url = typeof b === "string" ? b : b.url || b.src || b.href || (b.asset && b.asset.url) || "";
  // Sanity-bilete: be om ein passande storleik i staden for originalen
  if (/cdn\.sanity\.io\/images\//.test(url) && !url.includes("?")) url += "?w=1400&fit=max&auto=format";
  const kjelde = typeof b === "object" ? (b.credit || b.photographer || b.byline || b.copyright || "") : "";
  return { url, kjelde: arrTekst(kjelde) };
}
function arrStad(l) {
  if (!l) return "";
  if (typeof l === "string") return l;
  const rom = arrTekst(l.room);
  if (rom) return rom;
  if (l.library || /library/i.test(l.type || l._type || "")) return "Biblioteket";
  return arrTekst(l.name ? l.name : l) || "";
}
// Eitt arrangement som plakat (det som står etter # i plakatlenkja, utan vis=1)
function arrangementPlakat(ev, h) {
  const tema = new URLSearchParams(h).get("tema") || ARR_STANDARDTEMA;
  const start = String(ev.startsAt || ""), slutt = String(ev.endsAt || "");
  const dag = start.slice(0, 10), sluttdag = slutt.slice(0, 10);
  let dato = dag, tid = "";
  if (sluttdag && sluttdag !== dag) {
    // Over fleire dagar: «12.–14. november» eller «28. november – 3. desember»
    const [, m1, d1] = dag.split("-").map(Number), [, m2, d2] = sluttdag.split("-").map(Number);
    dato = m1 === m2 ? `${d1}.–${d2}. ${MÅNAD_KORT[m2 - 1]}` : `${d1}. ${MÅNAD_KORT[m1 - 1]} – ${d2}. ${MÅNAD_KORT[m2 - 1]}`;
  } else if (!ev.allDay) {
    tid = start.slice(11, 16) + (slutt && slutt.slice(11, 16) !== start.slice(11, 16) ? "-" + slutt.slice(11, 16) : "");
  }
  const grupper = (ev.targetAudiences || []).map(arrId).filter(g => ARR_MÅLGRUPPE[g]).map(g => ARR_MÅLGRUPPE[g]);
  const overlinje = "Arrangement" + (grupper.length && !(ev.targetAudiences || []).map(arrId).includes("for-all")
    ? " for " + (grupper.length > 1 ? grupper.slice(0, -1).join(", ") + " og " + grupper.at(-1) : grupper[0]) : "");
  let merkelapp = ARR_STATUS[arrId(ev.status)] || "";
  const inngang = ev.admission && arrId(ev.admission.type);
  if (!merkelapp && /^(free|gratis)/i.test(inngang || "")) merkelapp = "Gratis";
  const bilete = arrBilete(ev);
  const cfg = {
    mal: "arrangement", overlinje, overskrift: ev.title, tekst: arrIngress(ev), merkelapp,
    bilete: bilete.url || "ikon", biletform: bilete.url ? "foto" : "", kjelde: bilete.kjelde, ikon: "kalender",
    dato, tid: /^\d{2}:\d{2}(-\d{2}:\d{2})?$/.test(tid) ? tid : "", stad: arrStad(ev.location),
    lenkje: ev.url || "", qrtekst: "Les meir", tema,
  };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(cfg)) if (v) p.set(k, v);
  return p.toString();
}
