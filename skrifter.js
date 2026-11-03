// =====================================================================
// SKRIFTER FOR KARUSELLEN OG PLAKATANE
// =====================================================================
// Blir brukte av index.html (karusellane) og plakat.html (plakatane).

// ---- Skrifter. «standard» brukar skrifta på maskina; dei andre kjem frå
// Google Fonts. Manglar nettet, fell sida tilbake til standardskrifta.
// Kvar skrift: [namn hos Google Fonts, kva som skal lastast ned, storleik, feittleik]
// Storleiken (overskrift og boktittel) jamnar ut at skrifter er ulikt breie: 1 = som standardskrifta.
// Feittleiken gjeld skrifter som berre finst i éin vekt: 400 hindrar at nettlesaren lagar ei
// kunstig feit utgåve, som ser stygg ut på skrifter som er tjukke frå før.
const FONTAR = {
  atkinson:     ["Atkinson Hyperlegible", "Atkinson+Hyperlegible:wght@400;700"],
  nunito:       ["Nunito",                "Nunito:wght@400;600;700;800"],
  quicksand:    ["Quicksand",             "Quicksand:wght@400;600;700"],
  montserrat:   ["Montserrat",            "Montserrat:wght@400;600;700"],
  oswald:       ["Oswald",                "Oswald:wght@400;500;600;700",                        1.1],   // smal
  sourcesans:   ["Source Sans 3",         "Source+Sans+3:wght@400;600;700"],
  lora:         ["Lora",                  "Lora:ital,wght@0,400;0,600;0,700;1,400"],
  merriweather: ["Merriweather",          "Merriweather:ital,wght@0,400;0,700;1,400",           0.9],   // brei
  playfair:     ["Playfair Display",      "Playfair+Display:ital,wght@0,400;0,600;0,700;1,400"],
  robotoslab:   ["Roboto Slab",           "Roboto+Slab:wght@400;600;700"],
  dancing:      ["Dancing Script",        "Dancing+Script:wght@600;700",                        1.35],  // handskrift ser lita ut
  pixelify:     ["Pixelify Sans",         "Pixelify+Sans:wght@500;700",                         0.9],   // brei
  lato:         ["Lato",                  "Lato:ital,wght@0,400;0,700;1,400"],
  opensans:     ["Open Sans",             "Open+Sans:wght@400;600;700"],
  faunaone:     ["Fauna One",             "Fauna+One"],
  slabo:        ["Slabo 27px",            "Slabo+27px"],
  abril:        ["Abril Fatface",         "Abril+Fatface",                                      0.85, 400],  // brei og feit
  cinzel:       ["Cinzel",                "Cinzel:wght@400;600;700",                            0.85],       // berre store bokstavar
  ultra:        ["Ultra",                 "Ultra",                                              0.8,  400],  // svært brei og feit
  bubblegum:    ["Bubblegum Sans",        "Bubblegum+Sans",                                     1.05, 400],  // smal
  grandhotel:   ["Grand Hotel",           "Grand+Hotel",                                        1.3,  400],  // handskrift ser lita ut
  bangers:      ["Bangers",               "Bangers",                                            1.1,  400],  // smal teikneserieskrift
  orbitron:     ["Orbitron",              "Orbitron:wght@500;700",                              0.75],       // svært brei
  exo2:         ["Exo 2",                 "Exo+2:wght@400;600;700"],
  creepster:    ["Creepster",             "Creepster",                                          1.05, 400],  // grøsserskrift med bokstavar som renn
  bowlby:       ["Bowlby One",            "Bowlby+One",                                         0.8,  400],  // svært feit plakatskrift (Faltu Riltu)
};
// Vala i byggjaren. «tekst» er brødteksten. «overskrift» og «titlar» er valfrie:
// utan dei brukar overskrifta og boktitlane same skrift som teksten.
// «versalar»: overskrifta med store bokstavar og litt luft mellom dei.
const SKRIFTER = {
  atkinson:     { namn: "Atkinson",         skildring: "lettlesen",    tekst: "atkinson" },
  nunito:       { namn: "Nunito",           skildring: "rund",         tekst: "nunito" },
  quicksand:    { namn: "Quicksand",        skildring: "mjuk og rund", tekst: "quicksand" },
  montserrat:   { namn: "Montserrat",       skildring: "kraftig",      tekst: "montserrat" },
  oswald:       { namn: "Oswald",           skildring: "smal, plakat", tekst: "oswald" },
  sourcesans:   { namn: "Source Sans",      skildring: "nøytral",      tekst: "sourcesans" },
  lora:         { namn: "Lora",             skildring: "med serifar",  tekst: "lora" },
  merriweather: { namn: "Merriweather",     skildring: "klassisk",     tekst: "merriweather" },
  playfair:     { namn: "Playfair Display", skildring: "elegant",      tekst: "playfair" },
  robotoslab:   { namn: "Roboto Slab",      skildring: "skrivemaskin", tekst: "robotoslab" },
  // Skriftpar: ei skrift til overskrifter og ei til teksten
  "par-elegant":    { par: true, namn: "Elegant",    skildring: "Playfair + Source Sans",       overskrift: "playfair",     titlar: "playfair",     tekst: "sourcesans" },
  "par-klassisk":   { par: true, namn: "Klassisk",   skildring: "Merriweather + Atkinson",      overskrift: "merriweather", titlar: "merriweather", tekst: "atkinson" },
  "par-litteraer":  { par: true, namn: "Litterær",   skildring: "Abril Fatface + Lato",         overskrift: "abril",        titlar: "abril",        tekst: "lato" },
  "par-historisk":  { par: true, namn: "Historisk",  skildring: "Cinzel + Fauna One",           overskrift: "cinzel",       titlar: "cinzel",       tekst: "faunaone" },
  "par-plakat":     { par: true, namn: "Plakat",     skildring: "Oswald + Source Sans",         overskrift: "oswald",       titlar: "oswald",       tekst: "sourcesans", versalar: true },
  "par-krim":       { par: true, namn: "Krim",       skildring: "Ultra + Slabo",                overskrift: "ultra",        titlar: "ultra",        tekst: "slabo" },
  "par-venleg":     { par: true, namn: "Venleg",     skildring: "Nunito + Lora",                overskrift: "nunito",       titlar: "nunito",       tekst: "lora" },
  "par-leiken":     { par: true, namn: "Leiken",     skildring: "Bubblegum + Open Sans",        overskrift: "bubblegum",    titlar: "bubblegum",    tekst: "opensans" },
  "par-handskrift": { par: true, namn: "Handskrift", skildring: "Dancing + Source Sans",        overskrift: "dancing",     titlar: "sourcesans",   tekst: "sourcesans" },
  "par-retro":      { par: true, namn: "Retro",      skildring: "Grand Hotel + Lato",           overskrift: "grandhotel",   titlar: "lato",         tekst: "lato" },
  "par-teikneserie": { par: true, namn: "Teikneserie", skildring: "Bangers + Nunito",         overskrift: "bangers",      titlar: "nunito",       tekst: "nunito" },
  "par-framtid":    { par: true, namn: "Framtid",    skildring: "Orbitron + Exo 2",             overskrift: "orbitron",     titlar: "exo2",         tekst: "exo2" },
  "par-skummel":    { par: true, namn: "Skummel",    skildring: "Creepster + Nunito",           overskrift: "creepster",    titlar: "nunito",       tekst: "nunito" },
  "par-spel":       { par: true, namn: "Spel",       skildring: "Pixelify Sans + Nunito",       overskrift: "pixelify",     titlar: "nunito",       tekst: "nunito" },
  "par-feit":       { par: true, namn: "Feit",       skildring: "Bowlby One + Nunito",          overskrift: "bowlby",       titlar: "nunito",       tekst: "nunito" },
};
const fontstabel = id => `"${FONTAR[id][0]}", "Ubuntu", "DejaVu Sans", system-ui, sans-serif`;
function brukSkrift(namn) {
  const s = SKRIFTER[namn];
  if (!s) return;
  const bruk = new Set([s.tekst, s.overskrift, s.titlar].filter(Boolean));
  for (const id of bruk) {
    const lenkje = document.createElement("link");
    lenkje.rel = "stylesheet";
    lenkje.href = `https://fonts.googleapis.com/css2?family=${FONTAR[id][1]}&display=swap`;
    document.head.append(lenkje);
  }
  const rot = document.documentElement.style;
  rot.setProperty("--skrift", fontstabel(s.tekst));
  const overskrift = s.overskrift || s.tekst, titlar = s.titlar || s.tekst;
  rot.setProperty("--skrift-overskrift", fontstabel(overskrift));
  rot.setProperty("--skrift-tittel", fontstabel(titlar));
  rot.setProperty("--skala-overskrift", FONTAR[overskrift][2] || 1);
  rot.setProperty("--skala-tittel", FONTAR[titlar][2] || 1);
  rot.setProperty("--vekt-overskrift", FONTAR[overskrift][3] || 700);
  rot.setProperty("--vekt-tittel", FONTAR[titlar][3] || 700);
  if (s.versalar) document.documentElement.dataset.versalar = "";
}
