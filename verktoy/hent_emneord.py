#!/usr/bin/env python3
"""
hent_emneord.py — lagar emneord.json: alle emneord og sjangrar som er i bruk
på bøkene i Tysnes folkebibliotek, med kor mange titlar som har dei.

Karusellbyggjaren brukar fila til forslag i emne- og sjangerfelta.
GitHub køyrer skriptet éin gong i månaden (sjå .github/workflows/emneord.yml),
men det kan òg køyrast for hand:

    python3 verktoy/hent_emneord.py

Brukar berre Python sitt standardbibliotek.
"""

import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from datetime import datetime, timezone

SERVER = "https://strdbib.bib.no/cgi-bin/sru"
AVDELINGAR = ["tyfv", "tyfb"]          # vaksen, born og unge
BUNK = 100                              # titlar per førespurnad (Bibliofil sitt maksimum)
PAUSE = 0.5                             # sekund mellom førespurnadene, for å skåne Bibliofil
MIN_TITLAR = 2                          # emneord på berre éin tittel blir ikkje med
MAKS_EMNE = 5000
MAKS_SJANGER = 300
UTFIL = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "emneord.json")

# Same samanslåing av nynorsk og bokmål som i karusellbyggjaren:
# ord som berre skil seg i vokalane («Romanar/Romaner») blir eitt.
MÅLFORM = [
    (r"teikn", "tegn"), (r"eljing", "elling"), (r"bilet", "bilde"), (r"skodespel", "skuespill"),
    (r"heim", "hjem"), (r"kjærleik", "kjærlighet"), (r"røynd", "virkelighet"), (r"spel", "spill"),
    (r"^kriminal$", "krim"), (r"^humoristisk(e)?$", "humor"),
]


def vokalfri(ord):
    o = ord.lower()
    for frå, til in MÅLFORM:
        o = re.sub(frå, til, o)
    o = "".join(c for c in o if c.isalnum())
    o = re.sub(r"[aeiouyæøåéèêüö]", "", o)
    return re.sub(r"^(.{2,}?)r+$", r"\1", o)


def søk(avdeling, start):
    parametrar = {
        "operation": "searchRetrieve",
        "recordSchema": "bsdc",
        "query": f'bibliofil.ccl="avd={avdeling}" and norzig.materialType=l',
        "startRecord": str(start),
        "maximumRecords": str(BUNK),
        "responseType": "application/json",
    }
    url = SERVER + "?" + urllib.parse.urlencode(parametrar)
    førespurnad = urllib.request.Request(url, headers={
        "User-Agent": "Tysnes folkebibliotek infoskjerm (biblioteket@tysnes.kommune.no)"})
    for forsøk in range(3):
        try:
            with urllib.request.urlopen(førespurnad, timeout=90) as svar:
                return json.loads(svar.read().decode("utf-8"))
        except Exception as feil:
            if forsøk == 2:
                raise
            print(f"  feil ({feil}), prøver igjen …", file=sys.stderr)
            time.sleep(10)


def main():
    # nøkkel → {"namn", "nno", "former", "tal": {avd: n}}
    emne, sjanger = {}, {}
    titlar = {}
    for avd in AVDELINGAR:
        første = søk(avd, 1)
        totalt = int(første.get("feed", {}).get("sru_numberOfRecords") or 0)
        titlar[avd] = totalt
        print(f"{avd}: {totalt} titlar", file=sys.stderr)
        start = 1
        while start <= totalt:
            d = første if start == 1 else søk(avd, start)
            for post in d.get("feed", {}).get("entry", []) or []:
                tel_opp(post, avd, emne, sjanger)
            start += BUNK
            time.sleep(PAUSE)

    def ferdig(tabell, maks):
        rader = []
        for m in tabell.values():
            n = [m["tal"].get(a, 0) for a in AVDELINGAR]
            if sum(n) < MIN_TITLAR:
                continue
            former = [m["namn"]] + sorted(f for f in m["former"] if f != m["namn"])
            rader.append([m["namn"], *n, ", ".join(former)])
        rader.sort(key=lambda r: -sum(r[1:1 + len(AVDELINGAR)]))
        return rader[:maks]

    ut = {
        "laga": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "avdelingar": AVDELINGAR,
        "titlar": titlar,
        "forklaring": "Kvar rad: [namn, titlar per avdeling …, alle formene skilde med komma]",
        "emne": ferdig(emne, MAKS_EMNE),
        "sjanger": ferdig(sjanger, MAKS_SJANGER),
    }
    with open(UTFIL, "w", encoding="utf-8") as f:
        json.dump(ut, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print(f"Skreiv {len(ut['emne'])} emne og {len(ut['sjanger'])} sjangrar til {UTFIL}", file=sys.stderr)


def tel_opp(post, avd, emne, sjanger):
    alle = (post.get("sru_recordData") or {}).get("bsdc_subject") or []
    if isinstance(alle, dict):
        alle = [alle]
    for er_sjanger, tabell in ((True, sjanger), (False, emne)):
        # Same ord på nynorsk og bokmål i same bok skal berre teljast éin gong
        i_boka = {}
        for e in alle:
            if not isinstance(e, dict) or (e.get("id") == "genre") != er_sjanger:
                continue
            namn = unicodedata.normalize("NFC", (e.get("name") or "").strip())
            if not namn:
                continue
            k = vokalfri(namn)
            if not k:
                continue
            før = i_boka.get(k)
            if før is None:
                i_boka[k] = {"namn": namn, "nno": e.get("lang") == "nno", "former": {namn}}
            else:
                før["former"].add(namn)
                if e.get("lang") == "nno" and not før["nno"]:
                    før["namn"], før["nno"] = namn, True
        for k, b in i_boka.items():
            m = tabell.setdefault(k, {"namn": b["namn"], "nno": b["nno"], "former": set(), "tal": {}})
            m["tal"][avd] = m["tal"].get(avd, 0) + 1
            m["former"] |= b["former"]
            if b["nno"] and not m["nno"]:
                m["namn"], m["nno"] = b["namn"], True


if __name__ == "__main__":
    main()
