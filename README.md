# Infoskjerm — Tysnes folkebibliotek

Karusellar og rotasjon for dei to infoskjermane på Tysnes folkebibliotek.

## Filene

| Fil | Kva ho gjer |
|---|---|
| `index.html` | Karusellbyggjaren, og sjølve karusellen når lenkja har `#vis=1`. Opne <https://tysnesfolkebibliotek.github.io/infoskjerm/> |
| `oversikt.html` | Oversikt over og redigering av kva skjermane viser. Ikkje lenkja til frå byggjaren for andre, og skjult for søkjemotorar. Lagring krev ein GitHub-nøkkel |
| `oppsett.json` | Kva kvar skjerm viser, kor lenge og når. Blir endra frå oversiktssida |
| `emneord.json` | Emneord og sjangrar til forslaga i byggjaren. Blir laga med knappen på oversiktssida |
| `forrigebok.json` | Appellfaktorar frå Forrige bok for bøkene i samlinga, per tittelnummer. Blir laga med same knappen |
| `skjerm/rotasjon.html` | Fila som køyrer på kvar skjerm. Les `oppsett.json` og vekslar mellom sidene |
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

Kvar side i `oppsett.json` er éi linje:

```json
{ "namn": "Julebøker", "url": "https://tysnesfolkebibliotek.github.io/infoskjerm/#vis=1&…", "sekund": 180, "periode": "11-01/12-31" }
```

- **`namn`**: berre for deg.
- **`url`**: ei lenkje frå karusellbyggjaren eller ei kanalside på tysnesbibliotek.no.
- **`lokal`**: i staden for `url`, ei fil på skjermen i `~/nytt-paa-hylla/`.
- **`sekund`**: kor lenge sida blir vist. Minst 5.
- **`frisk`**: `true` lastar sida på nytt kvar gong ho blir vist (kanalsider).
- **`periode`**: `12-01/12-24` kvart år, kan gå over nyttår (`11-15/01-15`).
  Med årstal (`2026-10-01/2026-10-31`) berre den eine gongen.
- **`dagar`**: `man-fre`, `lør,søn`, `tys` osv.
- **`tid`**: `13:00-17:00`.

Sider utan tidsstyring blir alltid viste. Gjeld ingen sider akkurat no, viser
skjermen dei utan tidsstyring.

## Karusellane

Kjelder i byggjaren: **Nyaste** titlar, **Søk** i samlinga, **Handplukka** bøker
og **Likte du?** (liknande bøker frå Forrige bok). Søk og Nyaste kan òg
avgrensast med **appellfaktorar** frå Forrige bok, og bøkene kan få
**merkelappar** med appellfaktorar.

Appellfaktorane og merkelappane kjem frå `forrigebok.json`, så karusellen
slepp å slå opp kvar bok. Fila blir laga med knappen **Oppdater emneordlista og
Forrige bok-indeksen** på oversiktssida (i boksen nedst): sida les alle titlane
i Vaksen og Born og unge frå Bibliofil, lastar ned heile katalogen til Forrige
bok og koplar verka til tittelnummera på tittel og forfattar. Køyr han ein gong
i blant, til dømes kvar månad. Bøker som har kome inn etter at fila vart laga,
er ikkje med når ein filtrerer på appellfaktor før fila er laga på nytt.
«Likte du?» hentar framleis frå Forrige bok direkte.

Data frå Forrige bok (Biblioteksentralen) er lisensierte under CC BY-NC 4.0.
Karusellar som brukar dei, viser kjelda nedst.

Karusellane lagrar boklista i nettlesaren og hentar ny med det intervallet som
står i «Hent nytt» (standard 6 timar). Lister som ikkje er brukte på 30 dagar,
blir sletta automatisk.

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
