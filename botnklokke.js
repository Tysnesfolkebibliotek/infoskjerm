// botnklokke.js — lita klokke i botnen på alle sidene skjermane viser.
//
// Set klokkeslettet (hh:mm:ss) rett etter «Tysnes folkebibliotek» nede til
// venstre, i same skrift og farge som namnet, men tynnare og dempa.
// Fila blir henta av index.html (alle karusellar og malar), plakat.html
// (plakatar og plakatkarusellar) og video.html. Ikkje på klokke.html,
// som har si eiga store klokke.
//
// Slå av for éi side: «klokke=0» i lenkja (t.d. index.html#vis=1&klokke=0).

(function () {
  const p = new URLSearchParams(location.hash.slice(1) + "&" + location.search.slice(1));
  if (p.get("klokke") === "0") return;

  const stil = document.createElement("style");
  stil.textContent = `
    .botnklokke { margin-left: .9em; font-weight: 400; opacity: .55;
      font-variant-numeric: tabular-nums; letter-spacing: .04em; }
    .botnklokke.utansek .sek { display: none; }
    .botnklokke.skjult { display: none; }`;
  document.head.append(stil);

  function start() {
    const namn = document.querySelector(".botnnamn");
    if (!namn || namn.querySelector(".botnklokke")) return;
    const klokke = document.createElement("span");
    klokke.className = "botnklokke";
    klokke.setAttribute("aria-hidden", "true");
    namn.append(klokke);

    function tikk() {
      const no = new Date();
      const to = n => String(n).padStart(2, "0");
      klokke.innerHTML = to(no.getHours()) + ":" + to(no.getMinutes()) +
                         '<span class="sek">:' + to(no.getSeconds()) + "</span>";
      tilpass();
      // Neste oppdatering rett etter at sekundet skiftar
      setTimeout(tikk, 1000 - no.getMilliseconds() + 20);
    }
    // Får klokka ikkje plass (t.d. logo frå avsendaren eller QR-kode nede til
    // høgre, eller stor skrift i temaet), fell sekunda bort først, så heile klokka.
    function kolliderer() {
      const botn = klokke.closest("footer") || namn.parentElement;
      const r = klokke.getBoundingClientRect();
      if (!r.width) return false;
      return [...botn.children].some(el => {
        if (el.contains(klokke)) return false;
        const e = el.getBoundingClientRect();
        return e.width && e.left < r.right + 24 && e.right > r.left &&
               e.top < r.bottom && e.bottom > r.top;
      });
    }
    function tilpass() {
      klokke.classList.remove("utansek", "skjult");
      if (kolliderer()) klokke.classList.add("utansek");
      if (kolliderer()) klokke.classList.replace("utansek", "skjult");
    }

    tikk();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
