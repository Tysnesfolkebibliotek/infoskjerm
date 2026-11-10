// navigasjon.js — felles navigasjon for oversikta og byggjarane.
//
// Oversikta (oversikt.html) er den einaste inngangen. Her finst to ting:
//   1. NYTT: det som kan lagast frå «+ Lag nytt ▾» på oversikta.
//   2. Toppstripa «← Tilbake til oversikta» øvst i byggjarane.
//
// Byggjarane hentar denne fila berre når dei blir opna som byggjar, aldri
// når skjermane viser dei (#vis=1). Skjermane les altså ikkje denne fila.

(function () {
  // ---- Det som kan lagast -------------------------------------------------
  // href: sida som skal opnast. id: noko oversikta gjer sjølv (sjå «lag-nytt»
  // i oversikt.html). Ny type = éi ny linje her, til dømes:
  //   { namn: "Video", forklaring: "Ein videosnutt på skjermen", href: "video.html" },
  const NYTT = [
    { namn: "Karusell", forklaring: "Bøker som vekslar på skjermen", href: "index.html" },
    { namn: "Plakat", forklaring: "Digital teneste eller arrangement", href: "plakat.html" },
    { namn: "Plakatkarusell", forklaring: "Fleire plakatar etter tur", id: "plakatkarusell" },
    { namn: "Klokke", forklaring: "Klokke, vêr og ferje", href: "plakat.html#side=klokke" },
  ];

  const stil = document.createElement("style");
  stil.textContent = `
    .nyttmeny { position: relative; display: inline-block; }
    .nyttliste { position: absolute; right: 0; top: calc(100% + 6px); z-index: 50; min-width: 250px; padding: 6px;
      background: var(--flate, #fff); border: 1px solid var(--strek, #e3ddd3); border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.18); }
    .nyttliste[hidden] { display: none; }
    .nyttliste a, .nyttliste button { display: block; width: 100%; text-align: left; font: inherit; font-size: 14px; color: var(--tekst, #22201d);
      background: none; border: 0; border-radius: 7px; padding: 7px 10px; text-decoration: none; cursor: pointer; }
    .nyttliste a:hover, .nyttliste button:hover, .nyttliste a:focus-visible, .nyttliste button:focus-visible { background: var(--bg, #f6f3ee); outline: none; }
    .nyttliste b { display: block; font-weight: 600; }
    .nyttliste small { display: block; font-size: 12.5px; color: var(--dempa, #6f675d); }

    .navstripe { box-sizing: border-box; height: 40px; display: flex; align-items: center; padding: 0 18px;
      background: var(--b-flate, #fff); border-bottom: 1px solid var(--b-strek, #e3ddd3); font-size: 14px; }
    .navstripe a { color: var(--b-dempa, #6f675d); text-decoration: none; font-weight: 600; }
    .navstripe a:hover { color: var(--b-tekst, #22201d); }
    @media (min-width: 821px) {
      .navstripe + .b-ramme { height: calc(100vh - 40px); }
      .navstripe + .b-ramme .b-skjerm { max-height: calc(100vh - 150px); }
    }`;
  document.head.append(stil);

  const lag = (tag, eig, ...born) => { const e = Object.assign(document.createElement(tag), eig); e.append(...born); return e; };

  // ---- «+ Lag nytt ▾» på oversikta ----------------------------------------
  function lagMeny(stad) {
    const knapp = lag("button", { type: "button", className: "knapp" }, "+ Lag nytt ▾");
    knapp.setAttribute("aria-haspopup", "menu");
    const liste = lag("div", { className: "nyttliste", role: "menu", hidden: true });
    const opne = ja => { liste.hidden = !ja; knapp.setAttribute("aria-expanded", String(ja)); };
    opne(false);
    for (const t of NYTT) {
      const innhald = [lag("b", {}, t.namn), lag("small", {}, t.forklaring)];
      const val = t.href
        ? lag("a", { href: t.href, role: "menuitem" }, ...innhald)
        : lag("button", { type: "button", role: "menuitem" }, ...innhald);
      if (!t.href) val.addEventListener("click", () => {
        opne(false);
        document.dispatchEvent(new CustomEvent("lag-nytt", { detail: t.id }));
      });
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

  // ---- Toppstripa i byggjarane --------------------------------------------
  function lagStripe(byggjar) {
    if (window.top !== window.self || document.querySelector(".navstripe")) return;
    byggjar.before(lag("nav", { className: "navstripe" }, lag("a", { href: "oversikt.html" }, "← Tilbake til oversikta")));
  }

  const meny = document.getElementById("nyttmeny");
  const byggjar = document.getElementById("byggjar");
  if (meny) lagMeny(meny);
  else if (byggjar) lagStripe(byggjar);
})();
