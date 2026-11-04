# Infoskjerm — Tysnes folkebibliotek

Karusellar og rotasjon for dei to infoskjermane på Tysnes folkebibliotek.

## Filene

| Fil | Kva ho gjer |
|---|---|
| `index.html` | Karusellbyggjaren, og sjølve karusellen når lenkja har `#vis=1`. Opne <https://tysnesfolkebibliotek.github.io/infoskjerm/> |
| `plakat.html` | Plakatbyggjaren for digitale tenester og arrangement, og sjølve plakaten når lenkja har `#vis=1`. Opne <https://tysnesfolkebibliotek.github.io/infoskjerm/plakat.html> |
| `plakatkarusell.html` | Fleire plakatar etter tur på éi linje i oppsettet. Blir laga og endra på oversikta med **+ Lag plakatkarusell** |
| `tenester.json` | Dei digitale tenestene i plakatbyggjaren: namn, tekst, merkelapp, lenkje, ikon, logo og bilete |
| `skrifter.js` | Skriftene (Google Fonts) som karusellane og plakatane deler |
| `qrcode.js` | Lagar QR-kodane på plakatane (Kazuhiko Arase, MIT-lisens) |
| `bilete/tenester/` | Logoar og bilete til tenestene (marknadsmateriell frå leverandørane) |
| `bilete/plakatar/` | Bilete lasta opp frå plakatbyggjaren |
| `oversikt.html` | Oversikt over og redigering av kva skjermane viser. Ikkje lenkja til frå byggjaren for andre, og skjult for søkjemotorar. Lagring krev ein GitHub-nøkkel |
| `oppsett.json` | Kva kvar skjerm viser, kor lenge og når. Blir endra frå oversiktssida |
| `emneord.json` | Emneord og sjangrar til forslaga i byggjaren. Blir laga med knappen på oversiktssida |
| `forrigebok.json` | Appellfaktorar frå Forrige bok for bøkene i samlinga, per tittelnummer. Blir laga med same knappen |
| `svarteliste.json` | Bøker som aldri skal visast på skjermane. Blir endra på oversiktssida |
| `skjerm/rotasjon.html` | Fila som køyrer på kvar skjerm. Les `oppsett.json` og vekslar mellom sidene |
| `tema.js` | Alle tema (fargar, CSS og pynt) til karusellen |
| `bilete/` | Bilete og logoar til tema. Nye bilete skal òg liggje her |
| `bilete/julenisse.svg` | Julenisse med slede og reinsdyr som flyg forbi i juletemaet. Fri til ikkje-kommersiell bruk |
| `bilete/falturiltu-logo.png` | Falturiltu-logoen (svart, utan bakgrunn), til temaet Falturiltu |
| `manifest.webmanifest`, `ikon/` | Gjer at oversikta og byggjaren kan leggjast på startskjermen på mobilen som appen «Infoskjerm» (opnar oversikta). Med vilje ingen service worker, så skjermane aldri får gamle filer frå mellomlager |
| `skjerm/skjermbilete.py` | Tek eit bilete av det skjermen viser, over SSH |
| `skjerm/hent_nytt.py`, `skjerm/hent_sakprosa.py` | Lagar dei gamle lokale karusellane, som no berre er reserve |

## Byte innhald på ein skjerm

1. Lag karusellen i byggjaren.
2. Under «Til skjermane» nedst: klikk **Legg på skjerm 1** eller **Legg på skjerm 2**.
   (Delen er berre synleg i nettlesarar der nøkkelen er lagra på oversiktssida.)
3. Oversiktssida opnar seg med karusellen fylt ut. Legg til periode, dagar eller
   klokkeslett om du vil, klikk **Legg til** og så **Lagre**.

For å endre ein karusell som alt er på skjermen: klikk **Endre i byggjaren** på
oversiktssida, gjer endringa, og klikk **Oppdater … på skjerm N**.

Skjermen hentar `oppsett.json` ved starten av kvar runde og tek ho i bruk i
runden etter. Med publiseringa på GitHub kan det ta opptil om lag ein halvtime
før endringa syner, ofte mindre.

### Nøkkel for å lagre

Oversiktssida lagrar med ein *fine-grained personal access token* frå GitHub:
berre repoet `infoskjerm`, løyvet **Contents: Read and write**. Han blir lagra
i nettlesaren. Kvar maskin kan ha sin eigen nøkkel. Når nøkkelen går ut, kan du
framleis sjå oversikta, men må lage ein ny for å lagre.

### Oppsettet

Namnet og skildringa på kvar skjerm på oversikta kan endrast med «Endre namn».
Dei blir lagra under `_skjermnamn` i `oppsett.json`, som berre oversikta les.
Nøklane `skjerm1`/`skjerm2` og maskinnamna (`tysnes-infoskjerm`,
`tysnes-infoskjerm-2`) blir aldri endra av dette.

Kvar side i `oppsett.json` er éi linje:

```json
{ "namn": "Julebøker", "url": "https://tysnesfolkebibliotek.github.io/infoskjerm/#vis=1&…", "sekund": 180, "periode": "11-01/12-31" }
```

- **`namn`**: berre for deg.
- **`url`**: ei lenkje frå karusellbyggjaren eller ei kanalside på tysnesbibliotek.no.
- **`lokal`**: i staden for `url`, ei fil på skjermen i `~/nytt-paa-hylla/`.
- **`sekund`**: kor lenge sida blir vist. Minst 5. For julekalenderen er det eit
  tak: han går vidare sjølv når runden er ferdig.
- **`frisk`**: `true` lastar sida på nytt kvar gong ho blir vist (kanalsider).
- **`periode`**: `12-01/12-24` kvart år, kan gå over nyttår (`11-15/01-15`).
  Med årstal (`2026-10-01/2026-10-31`) berre den eine gongen.
- **`dagar`**: `man-fre`, `lør,søn`, `tys` osv.
- **`tid`**: `13:00-17:00`.

Sider utan tidsstyring blir alltid viste. Gjeld ingen sider akkurat no, viser
skjermen dei utan tidsstyring.

## Plakatar

Plakatar blir laga i **plakatbyggjaren** (`plakat.html`, eller **+ Lag ny plakat**
på oversikta). Ein plakat er ei vanleg side i `oppsett.json`, så han kan
tidsstyrast, avpubliserast og flyttast som karusellane. Han får 20 sekund som
standard.

- **Mal:** vel ei digital teneste, så blir namn, tekst, merkelapp, lenkje, logo og
  bilete fylte ut frå `tenester.json`. Du kan endre alt etterpå. **Arrangement**
  har felt for dato, klokkeslett og stad. **Tom plakat** startar blankt.
- **Logo:** logoar med gjennomsiktig bakgrunn blir farga i tekstfargen til temaet.
  Tenester frå Nasjonalbiblioteket (Biblioteksøk, Bibliotekkortet, nettbiblioteket, Tibi) kan òg
  få NB-logoen lite nedst til høgre («avsendarlogo» i `tenester.json`).
- **Bilete:** ikon, eitt av bileta til tenesta, eit eige bilete (adresse) eller
  **Last opp bilete** (krev nøkkelen frå oversikta). Opplasta bilete blir gjorde
  mindre og lagra i `bilete/plakatar/`. **Ferdig plakat** viser biletet over heile
  skjermen, til dømes ein plakat laga i Canva (1080 × 1920).
- **QR-kode:** peikar til lenkja, helst undersida for tenesta på tysnesbibliotek.no.
  Koden står alltid mørk på kvitt, så han kan skannast i alle tema.
- **Arrangement:** gje plakaten ein periode på oversikta (til dømes
  `2026-11-01/2026-11-12`), så forsvinn han av seg sjølv etterpå.

**Lagre som standard** (under malvalet, krev nøkkelen) lagrar det du har skrive og valt
(tekst, lenkje, merkelapp, bilete, tema …) som ny standard for malen i `tenester.json`.
Neste gong du vel malen, startar plakaten slik. For «Arrangement» blir datoen ikkje lagra.

**Nedteljing:** ei tynn linje nedst kryp saman til plakaten blir bytt. Tida er den som står
på oversikta (sekund): rotasjonssida sender ho med til plakaten når han blir vist. Krev
`rotasjon.html` frå 3.11.2026 (kveld) på skjermane; med ei eldre fil er plakaten utan linje.

All teksten står i lenkja til plakaten. Endrar du `tenester.json`, gjeld det nye
plakatar, ikkje dei som alt er på skjermen. Ny teneste: legg til ei linje i
`tenester.json`, og logo og bilete i `bilete/tenester/`.

### Plakatkarusell

Vil du ha fleire plakatar på skjermen, slepp du å leggje dei inn éin og éin:
klikk **+ Lag plakatkarusell** øvst på oversikta. Det blir éi linje i oppsettet
(`plakatkarusell.html`) som viser plakatane etter tur.

- **Legg til plakatar som finst frå før:** alle plakatane i oppsettet (på begge
  skjermane, òg avpubliserte og dei i andre plakatkarusellar) kan hakast av.
  Dei blir kopierte inn, så du kan avpublisere eller slette dei gamle linjene etterpå.
- **+ Lag ny plakat:** opnar plakatbyggjaren. Klikk **Legg til i «…»** nedst der,
  så kjem plakaten inn i karusellen. Krev at oppsettet er lagra først.
- **↑ ↓** endrar rekkjefølgja, **Endre i byggjaren** endrar éin plakat, **Fjern** tek han ut.
- **Vis til:** plakaten blir ikkje vist etter denne datoen (fint for arrangement).
- **Sekund per plakat** (standard 20) og **sekund på skjermen** for heile karusellen.
  Står sekunda på skjermen til éin heil runde, følgjer dei med når du legg til
  eller tek bort plakatar. Er dei færre, held karusellen fram med neste plakat
  neste gong han kjem på skjermen.

Kvar plakat får si eiga nedteljingslinje. Plakatane står i lenkja til karusellen
(`p=…`, alt etter `#` i plakatlenkja), så éin plakat i karusellen er uavhengig av
plakatlinjer med same innhald. Treng ingen ny `rotasjon.html` på skjermane.

## Karusellane

Kjelder i byggjaren: **Nyaste** titlar, **Søk** i samlinga, **Handplukka** bøker
og **Neste bok** (liknande bøker frå Forrige bok). Søk og Nyaste kan òg
avgrensast med **appellfaktorar** frå Forrige bok, og bøkene kan få
**merkelappar** med appellfaktorar.

### Julekalender

Vel malen **Julekalender** (under «Jul»). Det er Handplukka bøker med
visingsmåten «Julekalender», som berre kan veljast saman med Handplukka.
Kalenderen viser 24 pakkar: den første boka i lista er luke 1, den andre luke 2,
og så vidare. Utlånte bøker er med, og får merkelappen «Utlånt – kan reserverast».

- Før 1. desember står alle pakkane attlatne, og ein og ein pakke ristar litt.
- Frå 1. desember er så mange luker opne som datoen.
- Kvar gong kalenderen kjem fram, er det éin **runde**: dagens luke blir pakka
  opp, og så zoomar opptil 5 eldre luker fram, éi og éi («Tidlegare luke»). Dei
  eldre lukene går i ring på tvers av rundane, så alle blir viste etter kvart.
- Etter runden seier kalenderen «ferdig» til rotasjonen, som går vidare til neste
  side med ein gong. Sekunda i oppsettet er då berre eit tak (til dømes 240).
  Ein runde tek om lag 25 sekund 1. desember og om lag 2 minutt frå 6. desember.
  Oversikta viser ein merknad ved julekalendrar. Krev ny `rotasjon.html` på
  skjermane (frå 3.11.2026). Med ein eldre fil får kalenderen fast lengd.
- Etter 24. desember (og i januar) er alle opne, og kvar runde viser 6 av dei.

**Teste før desember:** vel ein dato i feltet «Test: sjå kalenderen som om det
var» i byggjaren. Førehandsvisinga og «Opne» viser då kalenderen den dagen.
Det same kan gjerast med `&dato=2026-12-07` til slutt i lenkja. Lenkja som
blir lagd på skjermane, har aldri testdatoen.

Appellfaktorane og merkelappane kjem frå `forrigebok.json`, så karusellen
slepp å slå opp kvar bok. Fila blir laga med knappen **Oppdater emneordlista og
Forrige bok-indeksen** på oversiktssida (i boksen nedst): sida les alle titlane
i Vaksen og Born og unge frå Bibliofil, lastar ned heile katalogen til Forrige
bok og koplar verka til tittelnummera på tittel og forfattar. Køyr han ein gong
i blant, til dømes kvar månad. Bøker som har kome inn etter at fila vart laga,
er ikkje med når ein filtrerer på appellfaktor før fila er laga på nytt.
«Neste bok» hentar framleis frå Forrige bok direkte.

Når appellfaktor er det einaste innhaldskravet i eit Søk (ikkje sjanger, emne,
dewey, serie eller eige CCL-søk) og rekkjefølgja er tilfeldig, hentar karusellen
bøkene rett på tittelnummera i `forrigebok.json`. Då er heile samlinga med, og
utvalet varierer. Elles søkjer han i Bibliofil som før, men hoppar over bøker
utan appellfaktoren før dei tel mot taket på 500.

Data frå Forrige bok (Biblioteksentralen) er lisensierte under CC BY-NC 4.0.
Karusellar som brukar dei, viser kjelda nedst.

Karusellane lagrar boklista i nettlesaren og hentar ny med det intervallet som
står i «Hent nytt» (standard 6 timar). Lister som ikkje er brukte på 30 dagar,
blir sletta automatisk.

## Svartelista bøker

Bøker som ikkje skal visast på skjermane, til dømes fordi omslaget kan verke
støytande, kan svartelistast i boksen **Svartelista bøker** på oversiktssida:
søk på tittel (eller forfattar eller tittelnummer), skriv eventuelt ein grunn,
og klikk **Svartelist**. **Frigi** tek boka av lista igjen. Kvar endring blir
lagra med ein gong i `svarteliste.json` (krev nøkkelen).

Lista gjeld tittelnummer, så same tittel i ei anna utgåve (med anna omslag)
må svartelistast for seg. Karusellane hoppar over bøkene både når dei hentar
nye bøker og i lister dei alt har lagra, og hentar svartelista på nytt kvart
tiande minutt. Ei bok forsvinn difor frå skjermen utan at karusellen må hente
alt på nytt, men publiseringa på GitHub kan ta nokre minutt.

## Når noko går gale

- **GitHub eller nettet er nede:** skjermen brukar det sist henta oppsettet.
  Nettsider som ikkje svarar, blir hoppa over.
- **Ein karusell har ingen bøker** (ingen treff, eller ingen kontakt og inga
  lagra liste): rotasjonen hoppar over han.
- **Skjermen har aldri fått henta oppsettet:** han brukar reserven som står
  øvst i `skjerm/rotasjon.html`.
- **Gå tilbake til ein tidlegare versjon:** opne `oppsett.json` på GitHub,
  klikk **History**, og kopier innhaldet frå ein versjon som fungerte.

## Oppdatere rotasjon.html på ein skjerm

```bash
ssh skjerm2
cd ~/nytt-paa-hylla
cp rotasjon.html rotasjon.html.gammal
curl -fsSL -o rotasjon.html https://tysnesfolkebibliotek.github.io/infoskjerm/skjerm/rotasjon.html
```

Den nye fila blir teken i bruk ved neste omstart (kl. 15 eller 07), eller
straks med `sudo reboot`.

## Skjermbilete over SSH

Kiosken er starta med `--remote-debugging-port=9222` og ei eiga profilmappe, så
`skjerm/skjermbilete.py` kan be Chromium om eit bilete av det skjermen viser.
Frå Fedora:

```bash
skjermbilete 2
```

(bash-funksjon i `~/.bashrc`), eller utan funksjonen:

```bash
ssh skjerm2 "python3 ~/nytt-paa-hylla/skjermbilete.py" > skjerm2.png
```

## Lokalhistorie (Beta)

`skjerm/lokalhistorie.html` viser bilete frå den lokalhistoriske bildesamlinga i Bibliofil:
`lokalhistorie.html?modus=dagens` (Dagens bilete, same heile dagen) eller
`lokalhistorie.html?modus=karusell&sek=20`. Bibliofil-tenesta har ikkje CORS, så
`skjerm/hent-lokalhistorie.sh` hentar 40 tilfeldige bilete éin gong per dag med curl og skriv
`lokalhistorie.js`. `oppdater-skjerm.sh` hentar begge filene frå stabil-greina og køyrer skriptet.
