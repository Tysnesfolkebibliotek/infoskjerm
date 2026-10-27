#!/usr/bin/env python3
"""
hent_nytt.py — hentar «nytt på hylla» for Tysnes folkebibliotek frå Bibliofil
og skriv resultatet til data.js, som infoskjermsida (index.html) les.

Køyr manuelt:      python3 hent_nytt.py
Test utan nett:    python3 hent_nytt.py --test testdata
Køyr frå cron:     sjå README.md

Skriptet brukar berre Python sitt standardbibliotek, så du treng ikkje
installere noko ekstra.
"""

import argparse
import json
import os
import re
import sys
import tempfile
import time
import urllib.parse
import urllib.request
from datetime import datetime

# ---------------------------------------------------------------------------
# Innstillingar — endre her ved behov
# ---------------------------------------------------------------------------

SERVER = "https://strdbib.bib.no/cgi-bin/sru"
EKSEMPLAR_URL = "https://strdbib.bib.no/cgi-bin/rest_service/copies/1.0/data/"

AVDELINGAR = {
    "tyfv": "Nytt for vaksne",
    "tyfb": "Nytt for born og unge",
}

ANTAL_TITLAR = 20       # kor mange titlar per avdeling
MAKS_VENTETID = 45      # sekund Bibliofil får bruke på å finne titlane
KREV_OMSLAG = 1         # 1 = berre titlar med omslagsbilete
MAKS_OMTALE = 220       # maks teikn i omtalen på skjermen
VIS_UTLÅNTE = True      # False = hopp over bøker som ikkje står på hylla

# Bibliofil sine statustekstar er laga for tilsette. Her blir dei omsette til
# ord publikum forstår. Statusar som ikkje står her, blir viste som dei er.
STATUS_FOR_PUBLIKUM = {
    "Utlånt": "Utlånt",
    "Til avhenting": "Reservert",
    "Til henteavdeling": "Reservert",
    "Ny": "Kjem snart",           # under innarbeiding
}

MAPPE = os.path.dirname(os.path.abspath(__file__))
UTFIL = os.path.join(MAPPE, "data.js")


# ---------------------------------------------------------------------------
# Henting
# ---------------------------------------------------------------------------

def lag_url(avdeling):
    """Byggjer SRU-adressa for «nyeste»-funksjonen (kikkhull) for éi avdeling."""
    extra = f"bibliofil:stat:nyeste:{ANTAL_TITLAR}:{MAKS_VENTETID}:{KREV_OMSLAG}:{avdeling}"
    parametrar = {
        "operation": "searchRetrieve",
        "recordSchema": "bsdc",
        "query": "norzig.materialType=l",
        "maximumRecords": str(ANTAL_TITLAR),
        "extraRequestData": extra,
        "responseType": "application/json",
    }
    # urlencode tek seg av kodinga (= blir %3D osb.), slik vi gjorde for hand før.
    return SERVER + "?" + urllib.parse.urlencode(parametrar, safe=":")


def hent_avdeling(avdeling):
    url = lag_url(avdeling)
    førespurnad = urllib.request.Request(url, headers={"User-Agent": "tysnes-infoskjerm/1.0"})
    with urllib.request.urlopen(førespurnad, timeout=MAKS_VENTETID + 30) as svar:
        return json.loads(svar.read().decode("utf-8"))


def hent_eksemplar(tittelnummer):
    """
    Hentar eksemplarinformasjon (plassering, status) for mange titlar i éin
    førespurnad. Tittelnummera blir sende kommaseparert, slik dokumentasjonen viser.
    """
    if not tittelnummer:
        return {}
    url = EKSEMPLAR_URL + ",".join(tittelnummer) + "?fields=full&exfields=full"
    førespurnad = urllib.request.Request(url, headers={"User-Agent": "tysnes-infoskjerm/1.0"})
    with urllib.request.urlopen(førespurnad, timeout=60) as svar:
        return json.loads(svar.read().decode("utf-8")).get("elements", {})


def les_testdata(mappe, avdeling):
    sti = os.path.join(mappe, f"{avdeling}.json")
    if not os.path.exists(sti):
        return {"feed": {"entry": []}}
    with open(sti, encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Rydding av data
# ---------------------------------------------------------------------------

def snu_namn(namn):
    """'Muncaster, Harriet' -> 'Harriet Muncaster'. Namn utan komma blir som dei er."""
    if not namn:
        return ""
    if "," in namn:
        etternamn, fornamn = namn.split(",", 1)
        return f"{fornamn.strip()} {etternamn.strip()}"
    return namn.strip()


def kort_omtale(tekst, maks=MAKS_OMTALE):
    """Kortar ned omtalen på ei setningsgrense, så han passar på skjermen."""
    if not tekst:
        return ""
    tekst = re.sub(r"<[^>]+>", " ", tekst)   # fjern eventuell HTML
    tekst = re.sub(r"\s+", " ", tekst).strip()
    if len(tekst) <= maks:
        return tekst
    kutt = tekst[:maks]
    # prøv å stoppe etter siste punktum, utrops- eller spørjeteikn
    siste = max(kutt.rfind(". "), kutt.rfind("! "), kutt.rfind("? "))
    if siste > maks * 0.5:
        return kutt[: siste + 1]
    return kutt.rsplit(" ", 1)[0] + " …"


def rydd_tittel(tittel):
    """
    'Krikkel : et himmelsvimlende eventyr' -> ('Krikkel', 'et himmelsvimlende eventyr')

    Undertitlar på eitt ord er nesten alltid ein sjangernemning som
    «kriminalroman», «roman» eller «noveller». Dei seier lite på skjermen,
    så dei blir tekne bort. Lengre undertitlar, som ofte forklarer kva ei
    fagbok handlar om, blir ståande.
    """
    if " : " in tittel:
        hovud, under = tittel.split(" : ", 1)
        under = under.strip()
        if len(under.split()) == 1:
            under = ""
        return hovud.strip(), stor_forbokstav(under)
    return tittel.strip(), ""


def stor_forbokstav(tekst):
    return tekst[:1].upper() + tekst[1:] if tekst else ""


def rydd_signatur(sig):
    """
    Behald berre deweynummer og forfattarkode: «q a,b 363.73 D» → «363.73 D»,
    «SOL bu,u» → «SOL», «q641.5 GRA» → «641.5 GRA». Små bokstavar er format-
    og alderskodar som ikkje hjelper publikum å finne boka.
    """
    bitar = [re.sub(r"^[a-zæøå]+(?=\d)", "", b) for b in (sig or "").split()]
    return " ".join(b for b in bitar
                    if re.match(r"\d", b) or (re.search(r"[A-ZÆØÅ]", b) and b == b.upper() and "," not in b))


def lag_hylle(d, eksemplar):
    """
    Set saman det publikum treng for å finne boka, til dømes «Kriminal · MAT».

    - Plasseringa (plc) kjem frå eksemplaret til avdelinga. Romanar for vaksne
      og sakprosa har ingen plassering, og då står signaturen åleine.
    - Signaturen tek vi frå eksemplaret om han finst, elles frå katalogposten.
    - Sakprosa blir plassert etter deweynummer. Manglar signaturen nummeret,
      set vi det framfor (til dømes «948.362 KYS»).
    """
    plassering = stor_forbokstav((eksemplar or {}).get("plc", "").strip())
    signatur = rydd_signatur(((eksemplar or {}).get("sign") or d.get("bs_hyllesignatur") or d.get("bs_hylle") or "").strip())
    ident = d.get("bsdc_identifier", {})
    dewey = ident.get("hylle") or ident.get("dewey") or ""
    er_sakprosa = d.get("bs_lf") == "0"
    if er_sakprosa and dewey and not re.search(r"\d", signatur):
        signatur = f"{dewey} {signatur}".strip()
    return " · ".join(x for x in (plassering, signatur) if x)


def på_hylla(eksemplar):
    """
    «in» betyr berre at boka er i huset. Ligg ho klar til avhenting for ein
    lånar («rdy»), står ho ikkje på hylla, sjølv om «in» er true.
    """
    return bool(eksemplar.get("in")) and not eksemplar.get("rdy")


def publikumsstatus(eksemplar):
    """Tom tekst når boka står på hylla, elles ein status publikum forstår."""
    if not eksemplar or på_hylla(eksemplar):
        return ""
    bibliofil = (eksemplar.get("sts_expl") or "").strip()
    return STATUS_FOR_PUBLIKUM.get(bibliofil, bibliofil or "Ikkje på hylla")


def finn_eksemplar(eksemplardata, tittelnummer, avdeling):
    """Finn eksemplaret som høyrer til avdelinga. Er det fleire, vel eitt som står på hylla."""
    kopiar = [k for k in eksemplardata.get(str(tittelnummer), {}).get("copies", [])
              if k.get("loc") == avdeling]
    if not kopiar:
        return None
    return next((k for k in kopiar if på_hylla(k)), kopiar[0])


def rydd_post(post, avdeling, eksemplardata):
    d = post.get("sru_recordData", {})
    eksemplar = finn_eksemplar(eksemplardata, post.get("id"), avdeling)
    tittel, undertittel = rydd_tittel(d.get("bsdc_title", ""))
    forfattar = d.get("bsdc_creator", {})
    if isinstance(forfattar, list):
        forfattar = forfattar[0] if forfattar else {}
    alder = d.get("bs_aldersgruppetekst", "")
    if alder and not re.search(r"\d|år", alder):
        alder = ""  # nokre postar har berre kodar som «bu,u,b» — dei viser vi ikkje
    return {
        "id": post.get("id"),
        "avdeling": avdeling,
        "tittel": tittel,
        "undertittel": undertittel,
        "forfattar": snu_namn(forfattar.get("name", "")),
        "omslag": d.get("bs_krydderbildeurl", ""),
        "hylle": lag_hylle(d, eksemplar),
        "inne": på_hylla(eksemplar) if eksemplar else True,
        # Bibliofil sin eigen statustekst, til dømes «Utlånt» eller «Til avhenting»
        "status": publikumsstatus(eksemplar),
        "alder": alder,
        "sjanger": [g for g in dict.fromkeys(d.get("bs_genre", []))
                    if g not in ("Romaner",)
                    and g.lower() != ((eksemplar or {}).get("plc") or "").strip().lower()][:3],
        "omtale": kort_omtale(d.get("bsdc_description", "")),
        "aar": d.get("bsdc_date", ""),
    }


# ---------------------------------------------------------------------------
# Skriving
# ---------------------------------------------------------------------------

def les_gamal_data():
    """Les førre data.js, så vi kan behalde ei avdeling viss hentinga feilar."""
    if not os.path.exists(UTFIL):
        return {}
    try:
        with open(UTFIL, encoding="utf-8") as f:
            innhald = f.read()
        return json.loads(innhald.split("=", 1)[1].rstrip().rstrip(";"))
    except Exception:
        return {}


def skriv_data(data, utfil=None):
    """
    Skriv data.js atomisk: først til ei mellombels fil, så blir ho bytta inn.
    Då ser nettlesaren aldri ei halvskriven fil.

    Vi skriv JavaScript (window.NYTT = {...}) i staden for rein JSON fordi
    Chromium ikkje lèt ei lokal side (file://) lese JSON-filer med fetch().
    Ei <script>-lenkje til ei .js-fil går derimot fint.
    """
    innhald = "window.NYTT = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
    utfil = utfil or UTFIL
    fd, mellombels = tempfile.mkstemp(dir=MAPPE, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(innhald)
    os.replace(mellombels, utfil)


def main():
    parser = argparse.ArgumentParser(description="Hent nytt på hylla frå Bibliofil")
    parser.add_argument("--test", metavar="MAPPE", help="les JSON-filer frå MAPPE i staden for nettet")
    args = parser.parse_args()

    gamal = les_gamal_data()
    gamle_avd = {a["kode"]: a for a in gamal.get("avdelingar", [])}
    resultat = {"oppdatert": datetime.now().strftime("%Y-%m-%d %H:%M"), "avdelingar": []}
    feil = 0

    for kode, namn in AVDELINGAR.items():
        start = time.time()
        try:
            rå = les_testdata(args.test, kode) if args.test else hent_avdeling(kode)
            oppføringar = rå.get("feed", {}).get("entry", [])
            nummer = [str(p.get("id")) for p in oppføringar if p.get("id")]
            try:
                if args.test:
                    sti = os.path.join(args.test, "copies.json")
                    eksemplardata = json.load(open(sti, encoding="utf-8")).get("elements", {}) if os.path.exists(sti) else {}
                else:
                    eksemplardata = hent_eksemplar(nummer)
            except Exception as e:
                # Utan eksemplardata viser vi berre signaturen frå katalogen.
                print(f"{kode}: fekk ikkje eksemplardata ({e}) — viser utan plassering", file=sys.stderr)
                eksemplardata = {}
            postar = [rydd_post(p, kode, eksemplardata) for p in oppføringar]
            postar = [p for p in postar if p["tittel"]]
            if not VIS_UTLÅNTE:
                postar = [p for p in postar if p["inne"]]
            print(f"{kode}: {len(postar)} titlar ({time.time() - start:.1f} s)")
            resultat["avdelingar"].append({"kode": kode, "namn": namn, "titlar": postar})
        except Exception as e:
            feil += 1
            print(f"{kode}: FEIL — {e}", file=sys.stderr)
            if kode in gamle_avd:
                print(f"{kode}: brukar førre liste i staden", file=sys.stderr)
                resultat["avdelingar"].append(gamle_avd[kode])

    if not any(a["titlar"] for a in resultat["avdelingar"]):
        print("Fekk ingen titlar i det heile — rører ikkje data.js.", file=sys.stderr)
        sys.exit(1)

    skriv_data(resultat)
    print(f"Skreiv {UTFIL}")
    sys.exit(1 if feil else 0)


if __name__ == "__main__":
    main()
