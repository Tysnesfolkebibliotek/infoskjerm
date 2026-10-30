// =====================================================================
// TEMA FOR KARUSELLEN
// =====================================================================
// Alle tema ligg her, kvart på éin stad. Eit tema kan ha:
//
//   id       Det interne namnet som står i lenkja («tema=…»). IKKJE endre
//            dette for eit tema som er i bruk – då mistar karusellane temaet.
//   namn     Det som står i temavalet i byggjaren. Kan endrast fritt.
//   gruppe   Kva gruppe temaet står i (sjå TEMAGRUPPER under).
//   dato     Liten tekst ved sida av namnet, t.d. «8. mars». Valfritt.
//   aktuell  Når temaet skal stå under «Aktuelt no» i byggjaren. Valfritt.
//            "MM-DD/MM-DD" (kan gå over nyttår), "påske" eller "veke17".
//   skrift   Skrift eller skriftpar temaet brukar når «Standard» er valt. Valfritt.
//   fargar   CSS-variablane for temaet (bakgrunn, tekst, aksent …).
//   css      Ekstra CSS for temaet. Valfritt. Har temaet eit symbol øvst til høgre
//            (flagg, logo), set --symbol-plass så overskrifta ikkje går inn i det.
//   pynt     Funksjon som teiknar pynten bak bøkene. Valfritt.
//
// Nytt tema: kopier eit liknande tema, gje det ein ny id og endre resten.
// «kveld» har ingen fargar her: det brukar standardfargane i index.html.

const TEMAGRUPPER = ["Faste", "Årstider", "Høgtider og merkedagar", "Bibliotek"];

const TEMA_LISTE = [
  {
    id: "kveld", namn: "Kveld", gruppe: "Faste",
  },
  {
    id: "fjord", namn: "Fjord", gruppe: "Faste",
    fargar: { bakgrunn: "#0a1822", tekst: "#eef6fb", dempa: "#9db5c4", aksent: "#2fb2ee", "aksent-tekst": "#04141d", skugge: "10,24,34", "reserve-a": "#17384c", "reserve-b": "#0b1c27" },
  },
  {
    id: "skog", namn: "Skog", gruppe: "Faste",
    fargar: { bakgrunn: "#0e1712", tekst: "#f0f3ec", dempa: "#a9b8a6", aksent: "#9cc96b", "aksent-tekst": "#122008", skugge: "14,23,18", "reserve-a": "#233a2a", "reserve-b": "#111c15" },
  },
  {
    id: "lys", namn: "Lys", gruppe: "Faste",
    fargar: { bakgrunn: "#f4efe6", tekst: "#1f1b16", dempa: "#62584c", aksent: "#b8741a", "aksent-tekst": "#ffffff", brikke: "rgba(0,0,0,.07)", skugge: "244,239,230", spor: "rgba(0,0,0,.10)", "reserve-a": "#e4d8c4", "reserve-b": "#d3c3a9", "bakteppe-lys": "1.15" },
  },
  {
    id: "natt", namn: "Natt", gruppe: "Faste",
    fargar: { bakgrunn: "#070b1f", tekst: "#eef1ff", dempa: "#a9b1d6", aksent: "#9db4ff", "aksent-tekst": "#070b1f", skugge: "7,11,31", "reserve-a": "#22306b", "reserve-b": "#0c1230" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Stjernehimmel som blinkar, og ein smal månesigd
      for (let i = 0; i < 70; i++) {
        const st = document.createElement("div"), d = tilf(0.15, 0.45);
        st.className = "stjerne";
        st.style.cssText = `left:${tilf(0, 100)}vw; top:${tilf(0, 100)}vh; width:${d}vw; height:${d}vw;` +
          `animation-duration:${tilf(2, 6)}s; animation-delay:${-tilf(0, 6)}s;`;
        pynt.append(st);
      }
      pynt.append(svg("0 0 100 100", "right:7vw; top:8vh; width:9vw; opacity:.3;",
        `<path fill="#e8ecff" d="M60,10 A40,40 0 1,0 60,90 A32,32 0 1,1 60,10 Z"/>`));
    },
  },
  {
    id: "kontrast", namn: "Kontrast (lettlesen)", gruppe: "Faste",
    fargar: { bakgrunn: "#000000", tekst: "#ffffff", dempa: "#ececec", aksent: "#ffd400", "aksent-tekst": "#000000", brikke: "#262626", skugge: "0,0,0", spor: "rgba(255,255,255,.25)", "reserve-a": "#262626", "reserve-b": "#111111" },
    css: `
      :root[data-tema="kontrast"]:not([data-bakgrunn]) .bakteppe,
      :root[data-tema="kontrast"]:not([data-bakgrunn]) .skugge { display: none; }
      :root[data-tema="kontrast"] .tittel { font-size: 6.6vw; }
      :root[data-tema="kontrast"] .forfattar { font-size: 4vw; opacity: 1; }
      :root[data-tema="kontrast"] .brikke { font-size: 3vw; }
      :root[data-tema="kontrast"] .omtale { font-size: 3.3vw; color: var(--tekst); }
      :root[data-tema="kontrast"] .botnnamn { font-size: 3.2vw; }`,
  },
  {
    id: "libry", namn: "Libry content", gruppe: "Faste",
    skrift: "sourcesans",
    fargar: { bakgrunn: "#333333", tekst: "#ffffff", dempa: "#c9c9c9", aksent: "#ffffff", "aksent-tekst": "#1f1f1f", brikke: "#555555", skugge: "51,51,51", spor: "rgba(255,255,255,.18)", "reserve-a": "#00474d", "reserve-b": "#002e33" },
    css: `
      :root[data-tema="libry"] .bakteppe,
      :root[data-tema="libry"] .skugge { display: none; }
      :root[data-tema="libry"] .avdeling { color: var(--dempa); }
      :root[data-tema="libry"] .brikke { border-radius: .5vw; text-transform: uppercase; letter-spacing: .06em; font-size: 2.2vw; }
      /* Plasseringa blir utheva som ein kvit lapp med mørk tekst */
      :root[data-tema="libry"] .brikke.hylle { background: var(--aksent); color: var(--aksent-tekst); font-weight: 700; }
      :root[data-tema="libry"] .omslag { border-radius: .3vw; }`,
  },
  {
    id: "vinter", namn: "Vinter", gruppe: "Årstider",
    aktuell: "12-01/02-28",
    fargar: { bakgrunn: "#0b1724", tekst: "#f2f7fb", dempa: "#a9bccb", aksent: "#8fd3ff", "aksent-tekst": "#06121c", skugge: "11,23,36", "reserve-a": "#1d3a55", "reserve-b": "#0e1f30" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Iskrystallar i hjørna (seksarma, med greiner) og litt lett snø
      const krystall = () => {
        let g = "";
        for (let v = 0; v < 360; v += 60) {
          g += `<g transform="rotate(${v} 50 50)"><line x1="50" y1="50" x2="50" y2="4"/>` +
               `<line x1="50" y1="22" x2="40" y2="12"/><line x1="50" y1="22" x2="60" y2="12"/>` +
               `<line x1="50" y1="34" x2="43" y2="27"/><line x1="50" y1="34" x2="57" y2="27"/></g>`;
        }
        return g;
      };
      pynt.append(svg("0 0 100 100", "left:-4vw; top:-3vh; width:24vw; fill:none; stroke:#dff3ff; stroke-width:1.6; stroke-linecap:round; opacity:.08;", krystall()));
      pynt.append(svg("0 0 100 100", "right:-3vw; top:6vh; width:14vw; fill:none; stroke:#dff3ff; stroke-width:1.6; stroke-linecap:round; opacity:.07;", krystall()));
      pynt.append(svg("0 0 100 100", "right:10vw; bottom:-4vh; width:18vw; fill:none; stroke:#dff3ff; stroke-width:1.6; stroke-linecap:round; opacity:.06;", krystall()));
      snøfall(14, 0.4);
    },
  },
  {
    id: "var", namn: "Vår", gruppe: "Årstider",
    aktuell: "03-01/05-31",
    fargar: { bakgrunn: "#12231a", tekst: "#f4f8ee", dempa: "#b9c8ad", aksent: "#a7d977", "aksent-tekst": "#10200c", skugge: "18,35,26", "reserve-a": "#2f5530", "reserve-b": "#16291c" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Kvite og rosa blomsterblad som dalar, og små spirer nedst
      dalande(16, "0 0 12 14", `<path fill="FARGE" d="M6,0 C10,3 10,9 6,14 C2,9 2,3 6,0 Z"/>`,
        ["#ffffff", "#f7c6d4", "#fbe3ea"], [0.9, 1.7], [0.3, 0.55]);
      const spire = x => `<g transform="translate(${x},0)"><path d="M10,40 C10,30 10,22 11,14" stroke="#a7d977" stroke-width="1.6" fill="none"/>` +
        `<path fill="#a7d977" d="M11,16 C6,10 2,12 1,16 C5,18 9,18 11,16 Z"/><path fill="#a7d977" d="M11,13 C15,6 20,7 21,11 C17,14 13,14 11,13 Z"/></g>`;
      pynt.append(svg("0 0 120 40", "left:0; bottom:0; width:30vw; opacity:.14;", spire(0) + spire(30) + spire(62)));
      pynt.append(svg("0 0 120 40", "right:0; bottom:0; width:24vw; opacity:.12;", spire(20) + spire(60) + spire(92)));
    },
  },
  {
    id: "sommar", namn: "Sommar", gruppe: "Årstider",
    aktuell: "06-01/08-31",
    fargar: { bakgrunn: "#fff0d4", tekst: "#1d3a4f", dempa: "#56687a", aksent: "#ff6b4a", "aksent-tekst": "#ffffff", brikke: "rgba(29,58,79,.08)", skugge: "255,240,212", spor: "rgba(29,58,79,.14)", "reserve-a": "#ffd08a", "reserve-b": "#ffb06b", "bakteppe-lys": "1.15" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Sol med glød, og tre lag med bølgjer som glir sakte nedst
      pynt.append(svg("0 0 100 100", "right:3vw; top:5vh; width:22vw; opacity:.75;",
        `<defs><radialGradient id="sol"><stop offset="38%" stop-color="#ffc23d"/><stop offset="55%" stop-color="#ffb13d" stop-opacity=".45"/><stop offset="100%" stop-color="#ff9d3d" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#sol)"/>`));
      const bølgje = (y, h) => { let d = `M0,${y}`; for (let x = 0; x < 400; x += 50) d += ` Q${x + 25},${y - h} ${x + 50},${y}`; return d + " L400,60 L0,60 Z"; };
      [[30, 8, 0.18, 50, "#7fd6e3"], [38, 6, 0.26, 36, "#3fbfd2"], [46, 5, 0.34, 26, "#2a9fc0"]].forEach(([y, h, o, sek, farge]) => {
        const lag = svg("0 0 400 60", `left:0; bottom:0; width:200vw; opacity:${o}; animation: glidSide ${sek}s linear infinite;`,
          `<path fill="${farge}" d="${bølgje(y, h)}"/>`);
        lag.setAttribute("preserveAspectRatio", "none"); lag.style.height = "9vh";
        pynt.append(lag);
      });
    },
  },
  {
    id: "haust", namn: "Haust", gruppe: "Årstider",
    aktuell: "09-01/11-30",
    fargar: { bakgrunn: "#1d0f0b", tekst: "#fbefe6", dempa: "#cfae9d", aksent: "#e9773d", "aksent-tekst": "#1d0f0b", skugge: "29,15,11", "reserve-a": "#5c2b1b", "reserve-b": "#2b130c" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Lauv i haustfargar som dalar sakte
      dalande(12, "0 0 20 22", `<path fill="FARGE" d="M10,0 C13,4 17,5 20,9 C16,10 15,13 16,18 C13,16 11,16 10,19 C9,16 7,16 4,18 C5,13 4,10 0,9 C3,5 7,4 10,0 Z"/><path d="M10,19 L10,22" stroke="FARGE" stroke-width="1"/>`,
        ["#e9773d", "#c9512b", "#e0a43a", "#a8462a"], [1.6, 3], [0.22, 0.4]);
    },
  },
  {
    id: "samisk", namn: "Samefolkets dag", gruppe: "Høgtider og merkedagar",
    dato: "6. februar",
    aktuell: "01-20/02-06",
    fargar: { bakgrunn: "#0f162b", tekst: "#ffffff", dempa: "#b8bfd6", aksent: "#e0332a", "aksent-tekst": "#ffffff", skugge: "15,22,43", "reserve-a": "#1f4f8f", "reserve-b": "#14203d" },
    css: `
      :root[data-tema="samisk"] { --symbol-plass: 20vw; }`,
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Det samiske flagget, teikna etter offisielle fargar og proporsjonar (4:3).
      // Raud, grøn, gul og blå felt, og ringen: blå venstre halvdel, raud høgre.
      const R = "#dc241f", G = "#007229", Y = "#ffce00", B = "#0035ad";
      const cx = 497, cy = 480, ro = 304, ri = 254;
      const halvring = (side, farge) => {
        const s = side < 0 ? 0 : 1;   // 0 = venstre halvdel, 1 = høgre
        return `<path fill="${farge}" d="M${cx},${cy - ro} A${ro},${ro} 0 0,${s} ${cx},${cy + ro} L${cx},${cy + ri} A${ri},${ri} 0 0,${1 - s} ${cx},${cy - ri} Z"/>`;
      };
      pynt.append(svg("0 0 1280 960", "right:6vw; top:5vh; width:17vw; border-radius:.4vw; box-shadow:0 .6vh 1.6vh rgba(0,0,0,.45);",
        `<rect width="409" height="960" fill="${R}"/><rect x="409" width="88" height="960" fill="${G}"/>` +
        `<rect x="497" width="89" height="960" fill="${Y}"/><rect x="586" width="694" height="960" fill="${B}"/>` +
        halvring(-1, B) + halvring(1, R)));
      // Sola (Beaivi) og reinsdyr i tromme-stil, spora frå førelegg biblioteket
      // valde ut. Solene stig sakte; reinsdyra vandrar over nedre del av skjermen.
      const SOL = { v: "0 0 100.0 80.5", d: "M36.9,0.0 L35.5,0.9 L35.0,2.2 L35.2,2.6 L34.6,3.1 L34.4,5.7 L33.6,8.6 L31.8,11.2 L30.4,12.6 L27.6,13.8 L26.6,13.8 L26.0,13.2 L25.5,13.2 L23.5,11.2 L22.3,8.6 L21.7,8.0 L20.3,8.1 L20.0,8.6 L20.0,9.5 L20.9,12.3 L20.9,15.4 L20.4,16.1 L20.4,16.9 L19.8,17.4 L18.7,19.2 L18.6,20.0 L17.7,20.6 L16.0,23.5 L15.8,24.4 L14.6,26.1 L13.7,26.1 L10.1,22.9 L9.2,22.4 L8.8,22.4 L8.0,23.0 L8.0,24.3 L8.4,25.5 L10.3,28.4 L10.9,30.1 L11.1,32.9 L10.6,36.7 L10.6,40.6 L10.1,41.8 L8.8,43.2 L7.5,43.5 L5.8,44.5 L4.3,44.9 L2.2,45.9 L0.2,47.5 L0.0,48.5 L1.2,49.3 L8.6,49.2 L9.7,49.8 L10.6,49.6 L12.0,50.4 L12.6,51.6 L13.1,51.9 L13.4,53.0 L13.2,53.9 L12.6,54.4 L12.6,54.8 L8.8,57.5 L6.6,58.2 L4.3,60.1 L3.7,60.8 L3.7,61.4 L4.3,61.9 L6.5,61.8 L9.4,61.0 L9.8,61.1 L12.4,59.8 L16.0,58.7 L16.7,59.0 L17.7,58.5 L18.9,58.5 L19.4,58.8 L22.1,59.1 L23.8,60.5 L23.8,61.0 L24.4,61.8 L24.4,63.1 L22.3,67.4 L20.9,68.7 L20.3,69.7 L20.7,70.7 L22.0,70.7 L23.2,69.9 L25.5,67.6 L27.0,66.5 L28.6,64.4 L30.1,62.8 L32.0,62.8 L34.4,63.6 L35.9,64.5 L36.6,65.3 L38.1,69.6 L38.4,72.4 L39.0,73.9 L39.5,74.3 L40.9,74.3 L41.3,73.6 L41.3,68.2 L42.4,64.8 L43.5,64.5 L44.5,64.8 L47.0,67.4 L48.4,71.1 L49.3,72.2 L50.8,77.1 L51.3,77.6 L51.3,78.2 L51.9,78.8 L51.9,79.3 L52.8,80.3 L53.6,80.3 L54.4,79.9 L54.5,78.3 L54.4,77.3 L53.9,76.7 L53.8,72.0 L53.3,71.6 L53.3,70.7 L52.8,69.7 L52.1,65.4 L52.2,64.5 L51.8,63.6 L51.8,63.1 L52.8,61.6 L53.6,61.4 L54.4,62.2 L54.8,62.2 L55.1,62.8 L58.2,65.6 L58.8,66.8 L60.7,68.7 L62.4,71.1 L65.0,73.3 L65.7,73.3 L66.2,72.8 L66.2,71.7 L65.7,71.1 L65.6,70.2 L64.4,68.0 L61.9,64.8 L61.1,62.8 L61.1,61.6 L60.7,60.8 L60.7,59.9 L61.1,59.4 L61.1,58.7 L62.4,56.8 L63.7,55.6 L65.1,55.1 L67.1,55.6 L67.6,56.1 L68.5,56.1 L72.0,58.2 L73.6,58.8 L75.6,60.4 L77.3,60.8 L77.7,61.3 L78.3,61.3 L79.7,62.1 L80.6,62.1 L81.4,61.3 L77.6,57.5 L75.4,55.9 L74.7,55.0 L72.4,53.5 L71.3,53.1 L68.8,50.8 L67.7,48.2 L67.7,47.2 L68.4,45.8 L69.9,44.4 L72.5,42.7 L73.7,42.7 L76.0,42.1 L80.8,41.8 L86.9,41.9 L88.0,41.6 L95.7,41.5 L99.7,40.1 L99.8,39.3 L99.4,38.7 L95.5,37.2 L84.9,37.0 L84.5,36.7 L83.9,36.9 L82.3,36.6 L77.1,36.7 L76.8,36.4 L74.3,36.4 L71.3,35.9 L68.8,35.0 L68.4,34.1 L68.4,32.1 L68.8,30.3 L70.4,28.7 L74.0,26.1 L75.9,24.1 L76.7,23.8 L81.3,19.2 L81.9,18.3 L82.3,16.6 L82.0,16.0 L81.4,15.7 L80.5,16.3 L79.3,16.3 L78.3,16.9 L77.9,16.9 L76.5,18.1 L76.2,18.0 L74.8,19.0 L73.4,19.7 L69.1,22.9 L68.4,23.0 L67.6,23.7 L65.4,24.1 L63.7,23.0 L63.0,20.3 L64.4,17.1 L65.0,16.4 L65.9,14.6 L67.7,12.7 L68.5,10.8 L69.6,9.5 L70.4,6.9 L69.6,5.5 L68.7,5.7 L67.0,7.2 L65.4,8.0 L63.3,10.3 L61.6,11.4 L61.1,12.1 L58.4,14.7 L56.4,15.7 L55.1,15.7 L53.8,14.6 L53.5,11.7 L55.9,5.4 L56.4,4.9 L56.7,2.2 L56.1,1.2 L55.5,1.2 L52.4,4.5 L48.4,10.1 L46.9,11.2 L46.1,11.4 L45.3,12.1 L40.9,11.2 L39.3,10.3 L38.6,9.4 L38.2,4.9 L37.8,4.1 L37.9,2.3 L37.6,1.7 L37.6,0.6Z M17.7,43.2 L19.8,42.2 L27.3,42.2 L28.9,43.0 L29.5,43.6 L30.0,45.2 L29.5,54.2 L28.0,56.1 L27.3,56.4 L24.7,56.4 L23.7,56.1 L21.2,54.5 L19.7,52.8 L18.6,51.3 L17.7,48.8 L16.9,47.8 L16.4,44.7Z M59.6,42.2 L59.8,46.1 L58.5,49.2 L56.7,51.5 L54.2,53.6 L47.3,57.1 L42.5,58.4 L36.7,57.9 L35.5,57.3 L34.1,56.1 L33.2,53.9 L33.2,48.7 L34.1,46.9 L34.3,45.8 L37.3,42.2 L39.6,41.2 L43.8,40.4 L46.1,40.6 L50.8,40.1 L56.4,40.1 L57.9,40.6Z M28.6,18.1 L29.0,18.6 L29.2,19.5 L30.0,20.4 L29.8,21.4 L30.3,23.0 L30.3,27.0 L30.6,27.3 L30.6,28.9 L30.1,29.3 L30.0,30.9 L30.6,31.2 L30.6,31.6 L29.8,32.7 L30.1,33.0 L30.1,35.0 L29.2,37.5 L27.2,39.2 L25.2,39.2 L24.4,39.6 L19.7,39.6 L17.8,39.2 L16.3,37.6 L16.0,36.4 L16.1,32.0 L17.1,30.7 L18.1,27.8 L20.6,23.8 L22.4,21.8 L22.9,20.6 L25.3,18.1 L26.9,17.8Z M35.8,16.7 L36.9,15.7 L37.9,15.2 L42.5,15.2 L43.0,15.5 L45.0,15.5 L48.1,16.9 L49.6,17.2 L52.7,19.7 L53.8,20.0 L58.8,26.6 L60.2,29.8 L60.2,33.3 L59.3,35.0 L57.0,36.9 L53.5,37.9 L49.9,37.9 L49.2,37.6 L47.3,37.9 L43.6,37.8 L41.6,37.0 L38.9,36.9 L36.9,36.4 L36.4,35.9 L35.0,35.5 L34.1,34.1 L33.8,32.0 L34.1,31.5 L33.9,25.8 L34.6,24.1 L34.6,22.4 L35.0,21.7 L34.7,20.6 L35.0,20.1 L35.2,18.1Z" };
      const REIN = { v: "0 0 79.0 100.0", d: "M11.5,1.4 L11.1,1.9 L11.1,3.8 L11.7,5.6 L12.5,6.8 L10.1,8.3 L10.1,10.1 L11.5,10.1 L14.3,8.7 L15.7,8.3 L19.1,8.5 L23.7,10.1 L24.0,10.4 L24.0,11.3 L24.7,12.2 L27.5,12.3 L30.6,18.4 L31.5,20.9 L31.5,21.7 L28.9,29.9 L26.1,36.0 L24.9,37.2 L22.3,39.0 L18.8,40.3 L15.8,40.2 L14.4,39.5 L12.3,37.2 L11.1,34.4 L10.6,31.0 L11.3,28.0 L12.9,26.4 L14.8,25.2 L14.8,23.8 L14.3,23.3 L12.7,23.3 L10.6,24.3 L9.0,26.1 L7.5,29.2 L6.8,32.0 L6.8,34.8 L8.0,38.3 L11.8,42.6 L13.0,43.1 L12.5,44.5 L11.5,45.6 L10.3,45.7 L7.3,44.5 L4.7,42.8 L2.4,41.7 L1.2,41.6 L0.0,42.8 L0.2,44.9 L1.0,47.1 L4.2,52.3 L5.7,54.1 L6.4,54.4 L8.7,54.4 L9.7,55.3 L11.1,57.6 L12.9,63.5 L13.7,65.2 L15.3,66.6 L19.0,68.5 L20.0,70.3 L20.9,73.0 L21.6,77.0 L22.8,78.8 L23.1,80.3 L23.5,88.5 L24.2,92.0 L23.8,92.9 L9.6,92.7 L4.7,93.4 L1.4,95.0 L1.7,98.1 L4.9,99.0 L6.8,98.4 L14.1,99.0 L24.5,99.0 L27.7,98.6 L35.7,99.0 L37.4,98.4 L60.7,99.7 L78.1,99.7 L78.8,98.4 L78.8,95.7 L78.3,94.3 L75.8,93.9 L62.6,94.1 L61.9,93.7 L60.2,88.2 L59.5,83.7 L59.5,80.2 L60.5,77.2 L60.5,75.8 L59.7,71.7 L54.6,68.9 L53.6,68.0 L52.3,65.9 L52.3,65.0 L56.9,61.4 L57.7,60.3 L59.0,53.4 L61.4,48.5 L61.2,47.1 L60.2,45.4 L58.4,45.6 L56.5,46.4 L53.4,48.9 L51.1,50.1 L35.8,53.4 L34.1,52.9 L30.3,51.0 L27.7,51.1 L24.2,52.9 L20.7,52.9 L18.1,52.0 L16.2,51.0 L13.7,48.9 L16.0,44.9 L18.4,42.8 L20.3,42.8 L25.0,44.2 L32.3,43.8 L35.1,42.6 L38.1,41.9 L38.6,41.2 L38.6,40.2 L38.1,39.8 L35.1,40.0 L29.0,41.4 L26.8,41.0 L26.1,40.7 L25.9,40.2 L27.1,39.0 L27.8,37.4 L30.8,37.4 L35.7,36.7 L41.6,34.6 L44.3,32.7 L45.2,31.5 L45.2,30.6 L44.9,30.3 L43.7,30.4 L40.9,32.5 L35.8,34.1 L32.5,34.6 L31.1,34.4 L30.8,34.1 L30.8,33.4 L31.7,32.7 L35.3,32.2 L39.0,30.4 L41.4,28.5 L42.4,26.8 L42.6,25.7 L41.9,25.4 L40.3,25.9 L36.7,28.5 L35.0,29.4 L32.5,29.7 L32.2,28.9 L32.7,26.1 L33.7,25.2 L36.2,24.7 L37.6,23.8 L41.6,19.5 L43.3,16.3 L43.1,15.3 L41.4,15.7 L40.2,17.6 L37.6,20.2 L35.1,21.7 L34.8,21.6 L34.6,20.2 L37.2,17.4 L38.8,14.4 L39.7,11.1 L39.7,9.7 L39.1,8.5 L37.9,8.7 L34.6,16.3 L33.9,15.5 L32.5,12.2 L32.3,10.6 L32.7,6.3 L32.0,4.5 L30.6,2.6 L29.9,2.8 L29.6,3.3 L30.3,9.0 L29.6,9.6 L26.8,7.8 L25.9,4.0 L24.5,1.7 L23.3,1.9 L23.3,4.0 L23.8,6.3 L23.1,6.4 L21.9,5.9 L20.9,4.9 L19.1,1.2 L18.1,0.2 L17.4,0.0 L16.9,0.5 L16.9,1.7 L18.6,5.6 L18.4,5.9 L16.2,6.1 L14.8,4.5 L13.6,1.9 L12.5,1.2Z M24.5,68.7 L25.4,68.9 L26.4,70.3 L27.0,73.4 L28.9,78.1 L29.6,85.6 L30.4,88.7 L30.3,92.0 L30.6,92.7 L30.3,93.0 L29.2,93.0 L28.9,92.2 L28.3,86.6 L28.5,83.7 L26.1,74.6 L23.8,69.4Z M46.1,67.1 L49.4,66.6 L50.8,69.6 L51.8,70.8 L53.2,71.0 L55.0,72.2 L56.9,72.5 L57.6,73.6 L57.7,74.8 L56.5,77.9 L56.9,82.1 L56.5,84.0 L57.4,87.7 L57.4,92.2 L58.4,93.2 L58.4,93.9 L55.1,93.9 L54.3,92.2 L54.4,89.4 L53.4,84.0 L54.1,73.4 L53.2,72.3 L48.9,71.0 L47.1,69.9 L45.6,67.5Z M29.9,66.8 L32.0,66.1 L40.7,67.7 L43.7,71.7 L47.3,73.7 L50.1,74.8 L49.2,81.0 L49.2,84.5 L50.1,87.5 L50.1,89.7 L51.5,92.9 L51.5,93.4 L51.0,93.9 L49.7,94.1 L47.1,93.4 L37.7,93.7 L35.8,93.4 L35.3,92.9 L34.8,91.5 L34.6,87.3 L33.9,84.2 L33.2,78.1 L29.4,68.3 L29.4,67.7Z" };
      stigande(6, SOL.v, `<path fill="${Y}" fill-rule="evenodd" d="${SOL.d}"/>`, [4.5, 7.5], [0.14, 0.24]);
      for (let i = 0; i < 3; i++) {
        const el = document.createElement("div");
        el.className = "vandrar";
        el.style.cssText = `top:${56 + i * 12 + tilf(0, 5)}vh; width:${tilf(7, 10)}vw; opacity:${tilf(0.1, 0.17)};` +
          `animation-duration:${tilf(70, 100)}s; animation-delay:${-tilf(0, 100)}s;`;
        el.append(svg(REIN.v, "", `<path fill="#eef1ff" fill-rule="evenodd" d="${REIN.d}"/>`));
        pynt.append(el);
      }
    },
  },
  {
    id: "kvinnedagen", namn: "Kvinnedagen", gruppe: "Høgtider og merkedagar",
    dato: "8. mars",
    aktuell: "02-20/03-08",
    fargar: { bakgrunn: "#220e1d", tekst: "#fff3f7", dempa: "#dcc0cc", aksent: "#e04a7d", "aksent-tekst": "#ffffff", skugge: "34,14,29", "reserve-a": "#8f2850", "reserve-b": "#331528" },
    css: `
      :root[data-tema="kvinnedagen"] { --symbol-plass: 17vw; }`,
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Kvinnesymbolet med knytt neve øvst til høgre, plassert som flagga i dei andre temaa
      const logo = document.createElement("img");
      logo.src = "kvinnedagen.png"; logo.alt = "";
      logo.style.cssText = "position:absolute; right:6vw; top:4vh; width:14vw; height:auto;";
      pynt.append(logo);
    },
  },
  {
    id: "paaske", namn: "Påske", gruppe: "Høgtider og merkedagar",
    aktuell: "påske",
    fargar: { bakgrunn: "#1b1f0f", tekst: "#fbf7e6", dempa: "#d0c99f", aksent: "#f3d23c", "aksent-tekst": "#1b1f0f", skugge: "27,31,15", "reserve-a": "#5d5b1d", "reserve-b": "#262a12" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Påskefjell med sol øvst til høgre, og påskeliljer som vaiar nedst
      pynt.append(svg("0 0 100 100", "right:4vw; top:5vh; width:22vw; opacity:.6;",
        `<defs><radialGradient id="paaskesol"><stop offset="36%" stop-color="#ffd84a"/><stop offset="55%" stop-color="#ffd84a" stop-opacity=".35"/><stop offset="100%" stop-color="#ffd84a" stop-opacity="0"/></radialGradient></defs>` +
        `<circle cx="62" cy="40" r="40" fill="url(#paaskesol)"/>`));
      pynt.append(svg("0 0 200 60", "right:0; top:15vh; width:40vw; opacity:.22;",
        `<path fill="#8f8a5c" d="M0,60 L38,22 L52,32 L82,4 L112,30 L128,18 L168,52 L200,40 L200,60 Z"/>` +
        `<path fill="#ffffff" d="M82,4 L72,14 L78,13 L84,17 L90,12 L96,15 Z M38,22 L32,28 L37,27 L42,30 Z M128,18 L122,24 L128,23 L133,25 Z"/>`));
      // Ei påskelilje sett forfrå: stilk, blad, seks kronblad og trompet
      const lilje = (kron, trompet) => {
        let blad = "";
        for (let v = 0; v < 360; v += 60) blad += `<ellipse cx="20" cy="12" rx="5.2" ry="9" fill="${kron}" transform="rotate(${v} 20 21)"/>`;
        return `<path d="M20,30 C20,48 21,62 20,80" stroke="#7fb24a" stroke-width="2.2" fill="none"/>` +
          `<path fill="#6c9e3c" d="M19,80 C12,64 10,52 13,40 C16,52 18,64 21,80 Z"/><path fill="#7fb24a" d="M21,80 C28,66 31,56 29,46 C25,58 22,68 19,80 Z"/>` +
          blad + `<circle cx="20" cy="21" r="6.4" fill="${trompet}"/><circle cx="20" cy="21" r="4.2" fill="none" stroke="#e07f12" stroke-width="1.1"/>`;
      };
      const liljerad = (stil, tal) => {
        const rad = document.createElement("div");
        rad.style.cssText = "position:absolute; bottom:-1vh; display:flex; align-items:flex-end; " + stil;
        for (let i = 0; i < tal; i++) {
          const l = document.createElement("div"), b = tilf(5.5, 8.5);
          l.className = "vaiar";
          l.style.cssText = `width:${b}vw; margin:0 -.8vw; opacity:${tilf(0.4, 0.55)}; animation-duration:${tilf(4, 7)}s; animation-delay:${-tilf(0, 7)}s;`;
          l.append(svg("0 0 40 80", "position:static; width:100%; height:auto; display:block;", lilje(vel(["#ffe14d", "#fff3a8", "#ffd23a"]), vel(["#f6a91f", "#ffc53a"]))));
          rad.append(l);
        }
        pynt.append(rad);
      };
      liljerad("left:1vw;", 4);
      liljerad("right:1vw;", 3);
    },
  },
  {
    id: "mai17", namn: "17. mai", gruppe: "Høgtider og merkedagar",
    aktuell: "05-01/05-17",
    fargar: { bakgrunn: "#0e1a33", tekst: "#ffffff", dempa: "#b8c3dc", aksent: "#d9263b", "aksent-tekst": "#ffffff", skugge: "14,26,51", "reserve-a": "#7d1b28", "reserve-b": "#14264a" },
    css: `
      :root[data-tema="mai17"] { --symbol-plass: 20vw; }`,
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Vimpelrekkje i raudt, kvitt og blått langs toppen
      let v = `<path d="M0,2 Q50,12 100,2" stroke="#ffffff" stroke-width=".3" fill="none"/>`;
      const fargar = ["#d9263b", "#ffffff", "#1f3f8f"];
      for (let i = 0; i < 14; i++) {
        const x = 3 + i * 7, t = x / 100, y = 2 + 40 * t * (1 - t) * 0.5;   // følgjer kurva
        v += `<polygon points="${x - 2.4},${y} ${x + 2.4},${y} ${x},${y + 6}" fill="${fargar[i % 3]}"/>`;
      }
      pynt.append(svg("0 0 100 16", "left:0; top:0; width:100vw; opacity:.32;", v));
      // Det norske flagget i offisielle fargar og proporsjonar (22:16): 6-1-2-1-12 i breidda, 6-1-2-1-6 i høgda
      const RAUD = "#ba0c2f", BLÅ = "#00205b";
      const flagg = `<rect width="22" height="16" fill="${RAUD}"/><rect x="6" width="4" height="16" fill="#fff"/><rect y="6" width="22" height="4" fill="#fff"/>` +
        `<rect x="7" width="2" height="16" fill="${BLÅ}"/><rect y="7" width="22" height="2" fill="${BLÅ}"/>`;
      pynt.append(svg("0 0 22 16", "right:6vw; top:5vh; width:17vw; border-radius:.4vw; box-shadow:0 .6vh 1.6vh rgba(0,0,0,.45);", flagg));
      // Små handflagg på pinne nedst, som vaiar som i eit barnetog
      const handflagg = `<rect x="1" y="0" width="1.4" height="40" rx=".7" fill="#e8d9b5"/><g transform="translate(2.4,1)">${flagg}</g>`;
      const flaggrad = (stil, tal) => {
        const rad = document.createElement("div");
        rad.style.cssText = "position:absolute; bottom:-2vh; display:flex; align-items:flex-end; gap:1.4vw; " + stil;
        for (let i = 0; i < tal; i++) {
          const f = document.createElement("div");
          f.className = "vaiar";
          f.style.cssText = `width:${tilf(5, 7)}vw; margin-bottom:${tilf(-3, 2)}vh; opacity:${tilf(0.55, 0.75)}; animation-duration:${tilf(1.6, 2.6)}s; animation-delay:${-tilf(0, 3)}s;`;
          f.append(svg("0 0 25 41", "position:static; width:100%; height:auto; display:block;", handflagg));
          rad.append(f);
        }
        pynt.append(rad);
      };
      flaggrad("left:2vw;", 3);
      flaggrad("right:3vw;", 3);
    },
  },
  {
    id: "pride", namn: "Pride", gruppe: "Høgtider og merkedagar",
    dato: "juni",
    aktuell: "06-01/06-30",
    fargar: { bakgrunn: "#15121c", tekst: "#ffffff", dempa: "#c4bdd2", aksent: "#ffffff", "aksent-tekst": "#15121c", skugge: "21,18,28", "reserve-a": "#5a3d7a", "reserve-b": "#1f1a29" },
    css: `
      :root[data-tema="pride"] { --symbol-plass: 18vw; }`,
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Eit regnbogehjarte med dei åtte fargane i det opphavlege prideflagget
      const fargar = ["#ff7ac2", "#e40303", "#ff8c00", "#ffed00", "#008026", "#14c7c7", "#3b1f9e", "#8a1fa0"];
      const hjarte = "M50,88 C22,68 3,50 3,29 C3,14 14,3 28,3 C38,3 46,9 50,18 C54,9 62,3 72,3 C86,3 97,14 97,29 C97,50 78,68 50,88 Z";
      const h = 85 / fargar.length;
      const striper = fargar.map((f, i) => `<rect x="0" y="${(3 + i * h).toFixed(2)}" width="100" height="${(h + 0.3).toFixed(2)}" fill="${f}"/>`).join("");
      pynt.append(svg("0 0 100 92", "right:6vw; top:4vh; width:15vw; filter:drop-shadow(0 .6vh 1.2vh rgba(0,0,0,.45));",
        `<defs><clipPath id="hjarte"><path d="${hjarte}"/></clipPath></defs><g clip-path="url(#hjarte)">${striper}</g>`));
      // Små regnbogehjarte som stig sakte i bakgrunnen
      stigande(11, "0 0 100 92",
        i => `<defs><clipPath id="hj${i}"><path d="${hjarte}"/></clipPath></defs><g clip-path="url(#hj${i})">${striper}</g>`,
        [3, 6], [0.16, 0.3]);
    },
  },
  {
    id: "halloween", namn: "Halloween", gruppe: "Høgtider og merkedagar",
    dato: "31. oktober",
    aktuell: "10-10/10-31",
    fargar: { bakgrunn: "#140c1b", tekst: "#f7efe4", dempa: "#b9a5c6", aksent: "#f07c1b", "aksent-tekst": "#140c1b", skugge: "20,12,27", "reserve-a": "#4a2366", "reserve-b": "#1d1028" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Måne øvst til høgre, med ein mjuk glød
      pynt.append(svg("0 0 100 100", "right:6vw; top:9vh; width:16vw; opacity:.22;",
        `<defs><radialGradient id="glod"><stop offset="55%" stop-color="#ffe9b0"/><stop offset="100%" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient></defs>` +
        `<circle cx="50" cy="50" r="50" fill="url(#glod)"/><circle cx="50" cy="50" r="30" fill="#ffe7a8"/>`));
      // Spindelvev i hjørnet øvst til venstre
      let vev = "";
      for (let v = 0; v <= 90; v += 15) { const r = v * Math.PI / 180; vev += `<line x1="0" y1="0" x2="${(Math.cos(r) * 100).toFixed(1)}" y2="${(Math.sin(r) * 100).toFixed(1)}"/>`; }
      for (const ring of [22, 40, 58, 76, 94]) {
        let d = "";
        for (let v = 0; v <= 90; v += 15) {
          const r = v * Math.PI / 180, x = (Math.cos(r) * ring).toFixed(1), y = (Math.sin(r) * ring).toFixed(1);
          d += v === 0 ? `M${x},${y}` : ` Q${(Math.cos(r - 0.13) * ring * 0.9).toFixed(1)},${(Math.sin(r - 0.13) * ring * 0.9).toFixed(1)} ${x},${y}`;
        }
        vev += `<path d="${d}"/>`;
      }
      pynt.append(svg("0 0 100 100", "left:0; top:0; width:26vw; fill:none; stroke:#fff; stroke-width:.5; opacity:.09;", vev));
      // Fire flaggermus som flyg sakte over skjermen på ulike høgder
      const bat = `<path fill="#000" d="M0,6 C2,2 5,1 7,4 C8,2 9.5,2 10,4 L10.6,2.6 L11.4,2.6 L12,4 C12.5,2 14,2 15,4 C17,1 20,2 22,6 C19.5,4.8 17.5,5.8 16.5,8 C15.5,6.8 14,6.8 13,8 L11,10 L9,8 C8,6.8 6.5,6.8 5.5,8 C4.5,5.8 2.5,4.8 0,6 Z"/>`;
      for (let i = 0; i < 4; i++) {
        const b = document.createElement("div");
        b.className = "flaggermus";
        b.style.cssText = `left:0; top:${8 + i * 17 + Math.random() * 8}vh; width:${4.5 + Math.random() * 3}vw; opacity:${0.28 + Math.random() * 0.15};` +
          `animation-duration:${28 + Math.random() * 20}s; animation-delay:${-Math.random() * 40}s;`;
        b.append(svg("0 0 22 10", "", bat.replace('#000', '#0a0610')));
        // Silhuetten blir svak lilla mot den mørke bakgrunnen
        b.querySelector("path").setAttribute("fill", "#cdb6e0");
        pynt.append(b);
      }
    },
  },
  {
    id: "jul", namn: "Jul", gruppe: "Høgtider og merkedagar",
    aktuell: "11-20/12-26",
    fargar: { bakgrunn: "#0d1f17", tekst: "#fbf5ea", dempa: "#c9bda6", aksent: "#c9392f", "aksent-tekst": "#ffffff", skugge: "13,31,23", "reserve-a": "#6b1e19", "reserve-b": "#123326" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      snøfall(28, 0.5);
      // Grantre-silhuettar nedst i begge hjørna
      const tre = (x, h) => `<g transform="translate(${x},${100 - h}) scale(${h / 100})">` +
        `<polygon points="50,0 68,28 60,28 78,55 66,55 88,88 12,88 34,55 22,55 40,28 32,28"/><rect x="45" y="88" width="10" height="12"/></g>`;
      pynt.append(svg("0 0 300 100", "left:-2vw; bottom:0; width:40vw; fill:#fff; opacity:.05;", tre(0, 80) + tre(70, 100) + tre(150, 65)));
      pynt.append(svg("0 0 300 100", "right:-2vw; bottom:0; width:34vw; fill:#fff; opacity:.05;", tre(40, 70) + tre(120, 95) + tre(210, 60)));
    },
  },
  {
    id: "sommarles", namn: "Sommarles", gruppe: "Bibliotek",
    dato: "1. juni–31. august", aktuell: "05-15/08-31",
    fargar: { bakgrunn: "#fff4dc", tekst: "#23314a", dempa: "#5b6475", aksent: "#ff7a45", "aksent-tekst": "#ffffff", brikke: "rgba(35,49,74,.08)", skugge: "255,244,220", spor: "rgba(35,49,74,.12)", "reserve-a": "#ffd27a", "reserve-b": "#ffb35c", "bakteppe-lys": "1.15" },
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Sol som snur seg sakte, og fargerike bobler som stig
      let stråler = "";
      for (let v = 0; v < 360; v += 30) stråler += `<line x1="50" y1="8" x2="50" y2="20" transform="rotate(${v} 50 50)"/>`;
      const sol = svg("0 0 100 100", "right:3vw; top:5vh; width:20vw; opacity:.55; animation: snu 80s linear infinite;",
        `<g stroke="#ffb72b" stroke-width="4" stroke-linecap="round">${stråler}</g><circle cx="50" cy="50" r="22" fill="#ffc83d"/>`);
      pynt.append(sol);
      for (let i = 0; i < 12; i++) {
        const b = document.createElement("div"), d = tilf(1, 3.2);
        b.className = "boble";
        b.style.cssText = `left:${tilf(0, 96)}vw; width:${d}vw; height:${d}vw; background:${vel(["#ff7a45", "#4cc3d9", "#7bc96f", "#ffc83d", "#b48cf2"])};` +
          `opacity:${tilf(0.12, 0.25)}; animation-duration:${tilf(22, 40)}s; animation-delay:${-tilf(0, 40)}s;`;
        pynt.append(b);
      }
    },
  },
  {
    id: "berekraft", namn: "Berekraftsveka", gruppe: "Bibliotek",
    dato: "veke 17",
    aktuell: "veke17",
    fargar: { bakgrunn: "#f7f8f5", tekst: "#3c3c3b", dempa: "#5f6366", aksent: "#00689d", "aksent-tekst": "#ffffff", brikke: "rgba(60,60,59,.08)", skugge: "247,248,245", spor: "rgba(60,60,59,.14)", "reserve-a": "#26bde2", "reserve-b": "#19486a", "bakteppe-lys": "1.15" },
    css: `
      .veke17 { display: block; width: 52vw; height: auto; margin-bottom: 1.6vh; }
      @keyframes skli { from { transform: translate(-1.2px, -1.2px); } to { transform: translate(1.2px, 1.2px); } }`,
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Logoen til Veke 17 øvst i overskriftsfeltet
      const header = document.querySelector("#visning header");
      if (header && !header.querySelector(".veke17")) {
        const logo = document.createElement("img");
        logo.className = "veke17"; logo.src = "veke17.png"; logo.alt = "Veke 17 – Berekraftsveka";
        header.prepend(logo);
      }
      // Skrå, avrunda strekar i fargane til dei 17 berekraftsmåla, som i logoen.
      // Dei glir sakte fram og tilbake langs sin eigen retning.
      const MÅL = ["#e5243b", "#dda63a", "#4c9f38", "#c5192d", "#ff3a21", "#26bde2", "#fcc30b", "#a21942", "#fd6925",
                   "#dd1367", "#fd9d24", "#bf8b2e", "#3f7e44", "#0a97d9", "#56c02b", "#00689d", "#19486a"];
      const strekar = (tal, start) => {
        let g = "";
        for (let i = 0; i < tal; i++) {
          const farge = MÅL[(start + i) % MÅL.length];
          const x = tilf(0, 80), y = tilf(0, 80), l = tilf(10, 34);
          g += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + l).toFixed(1)}" y2="${(y + l).toFixed(1)}" stroke="${farge}" stroke-width="4.4" stroke-linecap="round"` +
            ` style="animation: skli ${tilf(5, 9).toFixed(1)}s ease-in-out ${-tilf(0, 9).toFixed(1)}s infinite alternate"/>`;
        }
        return g;
      };
      pynt.append(svg("0 0 120 120", "right:-6vw; top:18vh; width:34vw; opacity:.22;", strekar(9, 0)));
      pynt.append(svg("0 0 120 120", "left:-3vw; bottom:8vh; width:34vw; opacity:.2;", strekar(9, 8)));
    },
  },
  {
    id: "forbodne", namn: "Forbodne bøker", gruppe: "Bibliotek",
    dato: "byrjinga av okt.", aktuell: "09-20/10-10",
    fargar: { bakgrunn: "#1d1430", tekst: "#fbf6e4", dempa: "#cfc6dd", aksent: "#faee9c", "aksent-tekst": "#3d2670", skugge: "29,20,48", "reserve-a": "#4f338a", "reserve-b": "#26193f" },
    css: `
      .forbodne-logo { display: block; width: 50vw; height: auto; margin-bottom: 1.6vh; filter: drop-shadow(0 0 .3vw rgba(250,238,156,.45)); }`,
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Kampanjelogoen øvst i overskriftsfeltet
      const header = document.querySelector("#visning header");
      if (header && !header.querySelector(".forbodne-logo")) {
        const logo = document.createElement("img");
        logo.className = "forbodne-logo"; logo.src = "forbodne.png"; logo.alt = "Forbodne bøker";
        header.prepend(logo);
      }
    },
  },
  {
    id: "spel", namn: "Spel", gruppe: "Bibliotek",
    dato: "pikselstil, t.d. Bibliobattles",
    skrift: "par-spel",
    fargar: { bakgrunn: "#121628", tekst: "#ffffff", dempa: "#b6bdd8", aksent: "#6fd14f", "aksent-tekst": "#0d1a08", skugge: "18,22,40", "reserve-a": "#2b4a8a", "reserve-b": "#18203d" },
    css: `
      :root[data-tema="spel"] .brikke, :root[data-tema="spel"] .omslag { border-radius: 0; }
      :root[data-tema="spel"] .framdrift, :root[data-tema="spel"] #framdrift { border-radius: 0; }`,
    pynt({ pynt, svg, tilf, vel, snøfall, stigande, dalande }) {
      // Teiknar pikselkunst: kvar rad er ein tekst, kvart teikn ein piksel (punktum = tomt)
      const pikslar = (rader, fargar, x0 = 0, y0 = 0) => {
        let r = "";
        rader.forEach((rad, y) => [...rad].forEach((t, x) => {
          if (fargar[t]) r += `<rect x="${x0 + x}" y="${y0 + y}" width="1.02" height="1.02" fill="${fargar[t]}"/>`;
        }));
        return r;
      };
      // Blokkterreng nedst: gras øvst, jord under, stein djupast. Kvar blokk er 8×8 pikslar
      const GRAS = ["ggGggGgg", "gGggggGg", "dgdGdgdg", "dddddDdd", "dDdddddd", "ddddDddd", "dddDdddd", "Dddddddd"];
      const JORD = ["dddDdddd", "dDdddddD", "ddddddDd", "Dddddddd", "dddDdddd", "ddddddDd", "dDdddddd", "ddddDddd"];
      const STEIN = ["sssSssss", "sSssssSs", "ssssSsss", "sssssssS", "sSssSsss", "ssssssss", "sssSsssS", "Ssssssss"];
      const blokkfargar = { g: "#6fbf3f", G: "#4f9a2c", d: "#8a5a32", D: "#6b4224", s: "#8a8f99", S: "#6c717b" };
      const kolonnar = 24;
      let høgd = 2, terreng = "";
      for (let k = 0; k < kolonnar; k++) {
        høgd = Math.max(1, Math.min(2, høgd + vel([-1, 0, 0, 1])));
        for (let h = 0; h < høgd; h++) {
          const mønster = h === høgd - 1 ? GRAS : (k % 3 === 0 ? STEIN : JORD);
          terreng += pikslar(mønster, blokkfargar, k * 8, (2 - h - 1) * 8);
        }
      }
      const t = svg(`0 0 ${kolonnar * 8} 16`, "left:0; bottom:0; width:100vw; opacity:.45; shape-rendering:crispEdges;", terreng);
      pynt.append(t);
      // Kantete skyer som driv sakte over toppen
      const SKY = ["...wwww.....", ".wwwwwwww...", "wwwwwwwwwwww", ".wwwwwwwwww."];
      for (let i = 0; i < 3; i++) {
        const el = document.createElement("div");
        el.className = "vandrar";
        el.style.cssText = `top:${3 + i * 7 + tilf(0, 3)}vh; width:${tilf(14, 22)}vw; opacity:${tilf(0.1, 0.18)};` +
          `animation-duration:${tilf(90, 140)}s; animation-delay:${-tilf(0, 140)}s;`;
        el.append(svg("0 0 12 4", "shape-rendering:crispEdges;", pikslar(SKY, { w: "#ffffff" })));
        pynt.append(el);
      }
      // Små pikselting som stig: hjarte, krystallar, myntar og stjerner
      const TING = [
        [[".rr.rr.", "rRrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r..."], { r: "#ff4d5e", R: "#ffb3bb" }],
        [["..cc..", ".cCcc.", "cCcccc", "cccccc", ".cccc.", "..cc.."], { c: "#4fe0d6", C: "#d8fffb" }],
        [[".yyy.", "yYyyy", "yYyOy", "yyyOy", ".yyy."], { y: "#ffcf3d", Y: "#fff2a8", O: "#d99a10" }],
        // Hakke: jernhovud med bøygde spissar og treskaft, litt på skrå
        [["..hhhhh..", ".hHHHHHh.", "hH..w..Hh", "h...w...h", "....w....", "....w....", "....w....", "....w....", "....W...."],
          { h: "#8e98a4", H: "#dce3ea", w: "#b07a40", W: "#7a5228" }, "rotate(-25 4.5 4.5)"],
      ];
      // Alle figurane blir sentrerte i eit 9×9-rutenett
      stigande(12, "0 0 9 9", i => {
        const [rader, f, snu = ""] = TING[i % TING.length];
        const x0 = (9 - rader[0].length) / 2, y0 = (9 - rader.length) / 2;
        return `<g style="shape-rendering:crispEdges" transform="${snu}">${pikslar(rader, f, x0, y0)}</g>`;
      }, [4, 6], [0.25, 0.45]);
    },
  }
];

// ---- CSS som fleire tema deler: pyntelaget og rørslene ---------------
const TEMA_FELLES_CSS = `
  #pynt { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
  #pynt svg { position: absolute; }
  /* Snø: små prikkar som fell sakte og vaggar litt */
  .snø { position: absolute; top: -2vh; border-radius: 50%; background: #fff; animation: snøfall linear infinite; }
  @keyframes snøfall {
    0%   { transform: translate(0, 0); }
    50%  { transform: translate(1.5vw, 52vh); }
    100% { transform: translate(-1vw, 105vh); }
  }
  /* Flaggermus: flyg sakte over skjermen og blafrar litt */
  .flaggermus { position: absolute; animation: flyg linear infinite; }
  .flaggermus svg { position: static; width: 100%; height: auto; animation: blafr 0.6s ease-in-out infinite alternate; transform-origin: 50% 60%; }
  @keyframes flyg {
    0%   { transform: translate(-15vw, 0); }
    25%  { transform: translate(25vw, -3vh); }
    50%  { transform: translate(55vw, 2vh); }
    75%  { transform: translate(85vw, -2vh); }
    100% { transform: translate(120vw, 1vh); }
  }
  @keyframes blafr { from { transform: scaleY(1); } to { transform: scaleY(.55); } }
  /* Generell «dalande» rørsle for lauv og blomsterblad: fell, vaggar og roterer */
  .dalar { position: absolute; top: -4vh; animation: dal linear infinite; }
  .dalar svg { position: static; width: 100%; height: auto; }
  @keyframes dal {
    0%   { transform: translate(0, 0) rotate(0deg); }
    25%  { transform: translate(3vw, 26vh) rotate(90deg); }
    50%  { transform: translate(-2vw, 52vh) rotate(180deg); }
    75%  { transform: translate(3vw, 78vh) rotate(270deg); }
    100% { transform: translate(0, 106vh) rotate(360deg); }
  }
  /* Bobler som stig sakte (Sommarles) */
  .boble { position: absolute; bottom: -6vh; border-radius: 50%; animation: stig linear infinite; }
  /* Vandrar sakte frå høgre mot venstre (reinsdyr) */
  .vandrar { position: absolute; left: 0; animation: vandre linear infinite; }
  /* Påskeliljer og handflagg: vaiar fram og tilbake rundt foten */
  .vaiar { transform-origin: 50% 100%; animation: vai ease-in-out infinite alternate; }
  .vaiar svg { position: static; width: 100%; height: auto; display: block; }
  @keyframes vai { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
  .vandrar svg { position: static; width: 100%; height: auto; display: block; }
  @keyframes vandre { from { transform: translateX(110vw); } to { transform: translateX(-30vw); } }
  @keyframes stig { from { transform: translate(0, 0); } 50% { transform: translate(2vw, -55vh); } to { transform: translate(-1vw, -112vh); } }
  /* Stjerner som blinkar (Natt) */
  .stjerne { position: absolute; border-radius: 50%; background: #fff; animation: blink ease-in-out infinite alternate; }
  @keyframes blink { from { opacity: .08; } to { opacity: .7; } }
  /* Bølgjer som glir sakte (Sommar) og sol som roterer (Sommarles) */
  @keyframes glidSide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes snu { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .dalar, .boble, .stjerne, .vaiar, #pynt * { animation: none !important; } }
  @media (prefers-reduced-motion: reduce) { .snø, .flaggermus, .flaggermus svg { animation: none; } }
`;

// ---- Hjelparar --------------------------------------------------------
const TEMA_ETTER_ID = Object.fromEntries(TEMA_LISTE.map(t => [t.id, t]));

// Påskedag (gregoriansk), etter den kjende «anonyme» algoritmen
function påskedag(år) {
  const a = år % 19, b = Math.floor(år / 100), c = år % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const månad = Math.floor((h + l - 7 * m + 114) / 31), dag = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(år, månad - 1, dag);
}
// Måndagen i ISO-veke nr. «veke» i året «år»
function vekestart(år, veke) {
  const jan4 = new Date(år, 0, 4), dag = (jan4.getDay() + 6) % 7;
  return new Date(år, 0, 4 - dag + (veke - 1) * 7);
}
// Er temaet aktuelt på denne datoen? (Brukt til «Aktuelt no» i byggjaren)
function erAktuell(tema, dato = new Date()) {
  const a = tema.aktuell;
  if (!a) return false;
  const dagen = new Date(dato.getFullYear(), dato.getMonth(), dato.getDate());
  const mellom = (frå, til) => dagen >= frå && dagen <= til;
  const år = dato.getFullYear(), dagar = n => n * 86400000;
  if (a === "påske") { const p = påskedag(år); return mellom(new Date(p - dagar(21)), new Date(+p + dagar(1))); }
  if (a === "veke17") { const v = vekestart(år, 17); return mellom(new Date(v - dagar(14)), new Date(+v + dagar(6))); }
  const [frå, til] = a.split("/").map(x => x.split("-").map(Number));
  const md = (dagen.getMonth() + 1) * 100 + dagen.getDate(), f = frå[0] * 100 + frå[1], t = til[0] * 100 + til[1];
  return f <= t ? md >= f && md <= t : md >= f || md <= t;   // perioden kan gå over nyttår
}

// ---- Lesbar aksentfarge til tekst ------------------------------------
// Aksentfargen blir òg brukt som tekstfarge (linja under overskrifta). Mange
// aksentfargar er laga for flater, og blir for svake som tekst – særleg raudt
// på mørk bakgrunn. Har fargen for låg kontrast mot bakgrunnen, blir han
// blanda gradvis mot tekstfargen til kontrasten er god nok. Kravet er 6:1,
// godt over WCAG-kravet for vanleg tekst (4,5:1): teksten er lita, blir lesen
// på avstand, og omslaget bak kan trekkje kontrasten ned. Flatene blir ikkje endra.
function lesbarAksent(aksent, bakgrunn, tekst, krav = 6) {
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const lum = h => {
    const [r, g, b] = rgb(h).map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const kontrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bland = (a, b, t) => "#" + rgb(a).map((c, i) => Math.round(c + (rgb(b)[i] - c) * t).toString(16).padStart(2, "0")).join("");
  const hex = h => /^#[0-9a-f]{6}$/i.test(h);
  if (![aksent, bakgrunn, tekst].every(hex) || kontrast(aksent, bakgrunn) >= krav) return aksent;
  for (let t = 0.05; t <= 1; t += 0.05) {
    const f = bland(aksent, tekst, t);
    if (kontrast(f, bakgrunn) >= krav) return f;
  }
  return tekst;
}

// ---- Legg CSS-en for alle tema inn på sida ----------------------------
(function () {
  const eitTema = t => {
    let css = "";
    const f = t.fargar;
    if (f) css += `:root[data-tema="${t.id}"] { ` +
      Object.entries(f).map(([k, v]) => `--${k}: ${v};`).join(" ") +
      (f.aksent && f.bakgrunn && f.tekst ? ` --aksent-tekstfarge: ${lesbarAksent(f.aksent, f.bakgrunn, f.tekst)};` : "") + " }\n";
    if (t.css) css += t.css + "\n";
    return css;
  };
  const stil = document.createElement("style");
  stil.id = "tema-stil";
  stil.textContent = TEMA_FELLES_CSS + "\n" + TEMA_LISTE.map(eitTema).join("");
  document.head.append(stil);
})();
