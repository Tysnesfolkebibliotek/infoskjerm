// navigasjon.js — felles navigasjon for oversikta og byggjarane («CMS-et»).
//
// Oversikta (oversikt.html) er hovudsida. Her finst tre ting:
//   1. NYTT: det som kan lagast, både i «+ Lag nytt ▾» på oversikta og i menyen.
//   2. Menyen til venstre (på mobil: stripa øvst med «Meny») på alle admin-sidene.
//   3. IKON: små strekikon som menyen og oversikta deler.
//
// Byggjarane hentar denne fila berre når dei blir opna som byggjar, aldri når
// skjermane viser dei (#vis=1). Skjermane les altså ikkje denne fila – og heller
// ikkje admin.css, som denne fila hentar til byggjarane.

(function () {
  // ---- Ikon (24 × 24, strek) ---------------------------------------------
  const ikon = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IKON = {
    skjermar: ikon('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
    karusell: ikon('<path d="M4 19V5a1 1 0 0 1 1-1h3v15H5a1 1 0 0 1-1-1zM8 4h4v15H8zM13.5 5.2l3.4-.9 3.6 13.5-3.4.9z"/>'),
    plakat: ikon('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4"/>'),
    plakatkarusell: ikon('<rect x="7" y="3" width="12" height="16" rx="2"/><path d="M4 6v13a2 2 0 0 0 2 2h9"/>'),
    klokke: ikon('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    video: ikon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/>'),
    nettside: ikon('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/>'),
    lokal: ikon('<path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>'),
    innstillingar: ikon('<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2"/>'),
    meny: ikon('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  };
  window.INFOSKJERM_IKON = IKON;

  // ---- Det som kan lagast -------------------------------------------------
  // href: sida som skal opnast. id: noko oversikta gjer sjølv (sjå «lag-nytt»
  // i oversikt.html). Frå ein byggjar går id-ane via oversikt.html#lag=<id>.
  // Ny type = éi ny linje her.
  const NYTT = [
    { namn: "Karusell", forklaring: "Bøker som vekslar på skjermen", href: "index.html", ikon: "karusell" },
    { namn: "Plakat", forklaring: "Digital teneste eller arrangement", href: "plakat.html", ikon: "plakat" },
    { namn: "Plakatkarusell", forklaring: "Fleire plakatar etter tur", id: "plakatkarusell", ikon: "plakatkarusell" },
    { namn: "Klokke", forklaring: "Klokke, vêr og ferje", href: "plakat.html#side=klokke", ikon: "klokke" },
    { namn: "Video", forklaring: "Ein videosnutt utan lyd", id: "video", ikon: "video" },
    { namn: "Nettsider", forklaring: "Ei side frå tysnesbibliotek.no, t.d. ein kanal", id: "nettside", ikon: "nettside" },
  ];

  const erOversikt = /oversikt\.html$/.test(location.pathname) || !!document.getElementById("nyttmeny");

  // Byggjarane har ikkje admin.css i <head> (skjermane skal aldri hente ho)
  if (!document.querySelector('link[href="admin.css"]'))
    document.head.append(Object.assign(document.createElement("link"), { rel: "stylesheet", href: "admin.css" }));

  const lag = (tag, eig, ...born) => { const e = Object.assign(document.createElement(tag), eig); e.append(...born); return e; };
  const medIkon = (namn, ...born) => { const s = document.createElement("span"); s.innerHTML = IKON[namn] || ""; return [s.firstChild, ...born]; };
  const vel = id => document.dispatchEvent(new CustomEvent("lag-nytt", { detail: id }));

  // ---- «+ Lag nytt ▾» på oversikta ----------------------------------------
  function lagNyttMeny(stad) {
    const knapp = lag("button", { type: "button", className: "knapp hoved" }, "+ Lag nytt ▾");
    knapp.setAttribute("aria-haspopup", "menu");
    const liste = lag("div", { className: "nyttliste", role: "menu", hidden: true });
    const opne = ja => { liste.hidden = !ja; knapp.setAttribute("aria-expanded", String(ja)); };
    opne(false);
    for (const t of NYTT) {
      const innhald = medIkon(t.ikon, lag("span", {}, lag("b", {}, t.namn), lag("small", {}, t.forklaring)));
      const val = t.href
        ? lag("a", { href: t.href, role: "menuitem" }, ...innhald)
        : lag("button", { type: "button", role: "menuitem" }, ...innhald);
      if (!t.href) val.addEventListener("click", () => { opne(false); vel(t.id); });
      liste.append(val);
    }
    knapp.addEventListener("click", () => { opne(liste.hidden); if (!liste.hidden) liste.querySelector("a, button").focus(); });
    document.addEventListener("click", e => { if (!stad.contains(e.target)) opne(false); });
    document.addEventListener("keydown", e => {
      if (liste.hidden) return;
      if (e.key === "Escape") { opne(false); knapp.focus(); }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const val = [...liste.children], i = val.indexOf(document.activeElement);
        val[(i + (e.key === "ArrowDown" ? 1 : -1) + val.length) % val.length].focus();
      }
    });
    stad.classList.add("nyttmeny");
    stad.replaceChildren(knapp, liste);
  }

  // ---- Menyen (venstre på PC, stripe øvst på mobil) -----------------------
  function lagAdminmeny() {
    if (window.top !== window.self || document.querySelector(".adminmeny")) return;
    const her = location.pathname.split("/").pop() || "index.html";
    const klokke = /(^|[#&])side=klokke(&|$)/.test(location.hash);
    const aktiv = href => {
      const [fil, hash = ""] = href.split("#");
      if (fil !== her) return false;
      if (fil === "plakat.html") return klokke === /side=klokke/.test(hash);
      return true;
    };
    const lenkje = (href, ikonnamn, tekst) => {
      const a = lag("a", { href }, ...medIkon(ikonnamn, tekst));
      if (aktiv(href)) { a.classList.add("aktiv"); a.setAttribute("aria-current", "page"); }
      return a;
    };
    const lenkjer = lag("div", { className: "lenkjer" },
      lenkje("oversikt.html", "skjermar", "Skjermane"),
      lag("div", { className: "gruppe" }, "Lag nytt"));
    for (const t of NYTT) {
      if (t.href) { lenkjer.append(lenkje(t.href, t.ikon, t.namn)); continue; }
      if (erOversikt) {
        const b = lag("button", { type: "button", className: "lenkje" }, ...medIkon(t.ikon, t.namn));
        b.addEventListener("click", () => { meny.classList.remove("open"); vel(t.id); });
        lenkjer.append(b);
      } else lenkjer.append(lenkje("oversikt.html#lag=" + t.id, t.ikon, t.namn));
    }
    lenkjer.append(lag("div", { className: "skil" }));
    if (erOversikt) {
      const b = lag("button", { type: "button", className: "lenkje" }, ...medIkon("innstillingar", "Innstillingar"));
      b.addEventListener("click", () => { meny.classList.remove("open"); document.dispatchEvent(new CustomEvent("opne-innstillingar")); });
      lenkjer.append(b);
    } else lenkjer.append(lenkje("oversikt.html#innstillingar", "innstillingar", "Innstillingar"));

    const menyknapp = lag("button", { type: "button", className: "menyknapp" }, ...medIkon("meny", "Meny"));
    const meny = lag("nav", { className: "adminmeny", ariaLabel: "Hovudmeny" },
      lag("a", { className: "merkenamn", href: "oversikt.html" }, "Infoskjerm", lag("small", {}, "Tysnes folkebibliotek")),
      menyknapp, lenkjer);
    menyknapp.setAttribute("aria-expanded", "false");
    menyknapp.addEventListener("click", () => menyknapp.setAttribute("aria-expanded", String(meny.classList.toggle("open"))));
    document.addEventListener("click", e => { if (!meny.contains(e.target)) { meny.classList.remove("open"); menyknapp.setAttribute("aria-expanded", "false"); } });
    document.body.prepend(meny);
    document.body.classList.add("har-meny");
  }

  const nytt = document.getElementById("nyttmeny");
  if (nytt) lagNyttMeny(nytt);
  if (document.body) lagAdminmeny();
  else document.addEventListener("DOMContentLoaded", lagAdminmeny);
})();
