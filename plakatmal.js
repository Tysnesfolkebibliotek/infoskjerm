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
