#!/usr/bin/env python3
"""
hent_sakprosa.py — trekkjer tilfeldige fagbøker frå Tysnes folkebibliotek og
skriv dei til sakprosa.js, som infoskjermsida kan vise.

Med i utvalet blir berre bøker som
  - har omslagsbilete,
  - står på hylla (inne og ikkje reservert), og
  - ikkje står på magasin eller nærmagasin.

Køyr manuelt:      python3 hent_sakprosa.py
Test utan nett:    python3 hent_sakprosa.py --test testdata

Brukar funksjonar frå hent_nytt.py, som må ligge i same mappe.
"""

import argparse
import json
import os
import random
import sys
import urllib.parse
import urllib.request
from datetime import datetime

import hent_nytt as felles   # gjenbruker rydding, eksemplaroppslag og skriving

# ---------------------------------------------------------------------------
# Innstillingar
# ---------------------------------------------------------------------------

AVDELING = "tyfv"
NAMN_PÅ_SKJERMEN = "Sakprosa"

# Søket: faglitteratur (lf=0) som Tysnes vaksen har, og berre bøker.
SØK = 'bibliofil.ccl="lf=0" and bibliofil.ccl="avd=tyfv" and norzig.materialType=l'

MÅL_TAL = 40          # kor mange bøker vi vil ende opp med
# Små bunkar frå mange tilfeldige stader i trefflista gir eit meir variert utval.
# Trefflista er sortert, så bøker som står ved sida av kvarandre, liknar ofte.
BUNKESTORLEIK = 5     # kor mange treff vi hentar frå kvar tilfeldige stad
MAKS_BUNKAR = 80      # gi opp etter så mange førespurnader
MAKS_PER_FORFATTAR = 1
UTELAT_PLASSERING = ("magasin", "nærmag")   # plasseringar som inneheld desse orda, blir hoppa over («Nærmag.» er forkorta)

UTFIL = os.path.join(felles.MAPPE, "sakprosa.js")


# ---------------------------------------------------------------------------
# Henting
# ---------------------------------------------------------------------------

def søk(start, tal):
    """Hentar 'tal' treff frå plass 'start' i trefflista."""
    parametrar = {
        "operation": "searchRetrieve",
        "recordSchema": "bsdc",
        "query": SØK,
        "startRecord": str(start),
        "maximumRecords": str(tal),
        "responseType": "application/json",
    }
    url = felles.SERVER + "?" + urllib.parse.urlencode(parametrar)
    førespurnad = urllib.request.Request(url, headers={"User-Agent": "tysnes-infoskjerm/1.0"})
    with urllib.request.urlopen(førespurnad, timeout=60) as svar:
        return json.loads(svar.read().decode("utf-8"))


def har_omslag(post):
    return bool(post.get("sru_recordData", {}).get("bs_krydderbildeurl"))


SKJØNNLITTERÆRE_SJANGRAR = {"romanar", "romaner", "noveller", "dikt", "skodespel", "skuespill"}


def ser_ut_som_fag(post):
    """
    Tryggingsnett mot katalogfeil: nokre romanar har fått litteraturform «fag»
    (lf=0) ved ein feil. Vi hoppar over bøker som
      - har litteraturform «R» (roman),
      - har ein skjønnlitterær sjanger, eller
      - manglar deweynummer, som alle fagbøker skal ha.
    """
    d = post.get("sru_recordData", {})
    if d.get("bs_littform") == "R":
        return False
    if {g.lower() for g in d.get("bs_genre", [])} & SKJØNNLITTERÆRE_SJANGRAR:
        return False
    ident = d.get("bsdc_identifier", {})
    return bool(ident.get("dewey") or ident.get("hylle"))


def aktuell(post):
    return har_omslag(post) and ser_ut_som_fag(post)


def forfattar(post):
    """
    Forfattarnamnet som sammenlikningsnøkkel. Bøker utan forfattar (til dømes
    antologiar) får kvar sin eigen nøkkel, så dei ikkje stengjer ute kvarandre.
    """
    d = post.get("sru_recordData", {})
    c = d.get("bsdc_creator", {})
    if isinstance(c, list):
        c = c[0] if c else {}
    namn = (c.get("name") or "").strip().lower()
    return namn or f"utan-forfattar-{post.get('id')}"


def godkjent(eksemplar):
    """Står på hylla, og ikkje på magasin."""
    if not eksemplar or not felles.på_hylla(eksemplar):
        return False
    plassering = (eksemplar.get("plc") or "").lower()
    return not any(ord in plassering for ord in UTELAT_PLASSERING)


# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Trekk tilfeldige fagbøker frå Bibliofil")
    parser.add_argument("--test", metavar="MAPPE", help="les testdata frå MAPPE i staden for nettet")
    args = parser.parse_args()

    if args.test:
        rå = json.load(open(os.path.join(args.test, "sakprosa.json"), encoding="utf-8"))
        kandidatar = rå["feed"]["entry"]
        eksemplardata = json.load(open(os.path.join(args.test, "copies.json"), encoding="utf-8"))["elements"]
        totalt = len(kandidatar)
        bunkar_brukt = 1
    else:
        # 1. Finn ut kor mange treff søket gir totalt
        totalt = int(søk(1, 1)["feed"].get("sru_numberOfRecords", 0))
        if not totalt:
            print("Søket gav ingen treff.", file=sys.stderr)
            sys.exit(1)

        # 2. Trekk tilfeldige bunkar frå trefflista til vi har nok godkjende bøker.
        #    Vi deler lista i bunkar og vel bunkane i tilfeldig rekkjefølgje,
        #    så same bok ikkje kan kome med to gonger.
        bunkar = list(range(0, (totalt + BUNKESTORLEIK - 1) // BUNKESTORLEIK))
        random.shuffle(bunkar)
        kandidatar, eksemplardata, forfattarar_sett = [], {}, set()
        bunkar_brukt = 0
        for b in bunkar[:MAKS_BUNKAR]:
            bunkar_brukt += 1
            treff = søk(b * BUNKESTORLEIK + 1, BUNKESTORLEIK)["feed"].get("entry", [])
            med_omslag = [p for p in treff if aktuell(p)]
            ny_eks = felles.hent_eksemplar([str(p["id"]) for p in med_omslag])
            eksemplardata.update(ny_eks)
            kandidatar += med_omslag
            for p in med_omslag:
                if godkjent(felles.finn_eksemplar(ny_eks, p["id"], AVDELING)):
                    forfattarar_sett.add(forfattar(p))
            # Tel forfattarar, ikkje bøker, sidan vi berre tek éi bok per forfattar
            if len(forfattarar_sett) >= MÅL_TAL:
                break

    # 3. Rydd og filtrer. Kandidatane blir stokka først, så det er tilfeldig
    #    kva bok som blir valt når ein forfattar har fleire.
    random.shuffle(kandidatar)
    titlar, per_forfattar = [], {}
    for p in kandidatar:
        if not aktuell(p):
            continue
        eksemplar = felles.finn_eksemplar(eksemplardata, p.get("id"), AVDELING)
        if not godkjent(eksemplar):
            continue
        f = forfattar(p)
        if per_forfattar.get(f, 0) >= MAKS_PER_FORFATTAR:
            continue
        t = felles.rydd_post(p, AVDELING, eksemplardata)
        if t["tittel"]:
            titlar.append(t)
            per_forfattar[f] = per_forfattar.get(f, 0) + 1

    titlar = titlar[:MÅL_TAL]
    print(f"{totalt} fagbøker i søket, {bunkar_brukt} bunkar henta, {len(titlar)} godkjende")

    if not titlar:
        print("Ingen bøker oppfylte krava — rører ikkje sakprosa.js.", file=sys.stderr)
        sys.exit(1)

    data = {
        "oppdatert": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "avdelingar": [{"kode": AVDELING, "namn": NAMN_PÅ_SKJERMEN, "titlar": titlar}],
    }
    felles.skriv_data(data, UTFIL)
    print(f"Skreiv {UTFIL}")


if __name__ == "__main__":
    main()
