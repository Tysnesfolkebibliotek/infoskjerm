# Infoskjerm — Tysnes folkebibliotek

Karusellar og rotasjon for infoskjermane på Tysnes folkebibliotek.

## Filene

| Fil | Kva ho gjer |
|---|---|
| `index.html` | Karusellbyggjaren. Opne <https://tysnesfolkebibliotek.github.io/infoskjerm/> |
| `oppsett.json` | Kva kvar skjerm viser, og kor lenge |
| `skjerm/rotasjon.html` | Fila som køyrer på kvar skjerm. Les `oppsett.json` og vekslar mellom sidene |

## Byte innhald på ein skjerm

1. Lag karusellen i byggjaren, og kopier lenkja som viser han på skjerm
   (den med `#vis=1`).
2. Opne `oppsett.json` her på GitHub, og klikk blyanten («Edit this file»).
3. Lim inn lenkja som `"url"` for den sida du vil byte, eller legg til ei ny linje.
4. Klikk **Commit changes**.

Skjermane hentar `oppsett.json` ved starten av kvar runde. GitHub Pages kan
bruke opptil 10 minutt på å publisere endringa, så rekn med 10–15 minutt før
du ser henne på skjermen.

### Oppsettet

```json
"skjerm2": [
  { "namn": "Nyheiter (lokal)", "lokal": "index.html", "sekund": 180 },
  { "namn": "Kanalside 1", "url": "https://www.tysnesbibliotek.no/nn/kanal/1", "sekund": 180, "frisk": true }
]
```

- **`skjerm2`** er oppsettet for tysnes-infoskjerm-2, **`skjerm1`** for
  tysnes-infoskjerm. Kva skjerm som brukar kva, står i `kiosk.desktop` på
  skjermen (`rotasjon.html?oppsett=skjerm1`).
- **`url`**: ei nettadresse, til dømes ei lenkje frå karusellbyggjaren eller ei
  kanalside på tysnesbibliotek.no.
- **`lokal`**: ei fil som ligg på skjermen, i `~/nytt-paa-hylla/`. Dei lokale
  karusellane (Nyheiter og Frå hylla) blir framleis oppdaterte av
  Python-skripta på skjermen.
- **`sekund`**: kor lenge sida blir vist. Minst 5.
- **`frisk`**: `true` lastar sida på nytt kvar gong ho blir vist.
- **`namn`**: berre for deg, skjermen bryr seg ikkje om det.

### Tidsstyring

Kvar linje kan få tre valfrie felt som avgjer når ho skal visast:

```json
{ "namn": "Julebøker", "url": "…", "sekund": 120, "periode": "12-01/12-24" },
{ "namn": "Barnebøker", "url": "…", "sekund": 120, "dagar": "man-fre", "tid": "13:00-17:00" },
{ "namn": "Boktober", "url": "…", "sekund": 120, "periode": "2026-10-01/2026-10-31" }
```

- **`periode`**: `12-01/12-24` gjeld kvart år, og kan gå over nyttår (`11-15/01-15`).
  Med årstal (`2026-10-01/2026-10-31`) gjeld det berre den eine gongen.
- **`dagar`**: `man-fre`, `lør,søn`, `tys` osv.
- **`tid`**: `13:00-17:00`.
- Linjer utan desse felta blir alltid viste. Gjeld ingen linjer akkurat no,
  viser skjermen dei utan tidsstyring.

Skjermen sjekkar ved starten av kvar runde kva som gjeld.

Pass på kommaa: det skal vere komma mellom linjene, men ikkje etter den siste
i kvar liste. Er fila ugyldig, held skjermane fram med det førre oppsettet.

## Når noko går gale

- **GitHub eller nettet er nede:** skjermen brukar det sist henta oppsettet.
  Nettsider som ikkje svarar, blir hoppa over, så dei lokale karusellane står att.
- **Skjermen har aldri fått henta oppsettet:** han brukar reserven som står
  øvst i `skjerm/rotasjon.html`, som er det same som skjermane viste før.
- **Gå tilbake til ein tidlegare versjon:** opne `oppsett.json`, klikk
  **History**, og kopier innhaldet frå ein versjon som fungerte.

## Oppdatere rotasjon.html på ein skjerm

```bash
ssh tysnes-folkebibliotek@tysnes-infoskjerm-2
cd ~/nytt-paa-hylla
cp rotasjon.html rotasjon.html.gammal
curl -fsSL -o rotasjon.html https://tysnesfolkebibliotek.github.io/infoskjerm/skjerm/rotasjon.html
```
