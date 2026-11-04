#!/bin/bash
# Hentar tilfeldige bilete frå den lokalhistoriske bildesamlinga i Bibliofil
# og skriv dei til lokalhistorie.js, som lokalhistorie.html les.  (BETA)
#
# - Hentar berre éin gong per dag, så «Dagens bilete» er det same heile dagen.
# - Endrar ingenting om nettet er nede eller svaret ser øydelagt ut.
# - Skriv kva som skjer i oppdatering.log.
#
# Bruk:  hent-lokalhistorie.sh [mappe] [--no]
#   mappe  der lokalhistorie.js skal liggje (standard: mappa skriptet ligg i)
#   --no   hent sjølv om det alt er henta i dag (for testing)
#
# Bibliofil-tenesta (r/web_sok) har ikkje CORS, så nettsida kan ikkje hente
# bileta sjølv. Difor gjer dette skriptet det med curl.

set -u

MAPPE="${1:-$(dirname "$(readlink -f "$0")")}"
FIL="$MAPPE/lokalhistorie.js"
NY="$MAPPE/lokalhistorie.json.ny"
LOGG="$MAPPE/oppdatering.log"
I_DAG="$(date +%F)"

logg() { echo "$(date '+%F %T') [lokalhistorie] $*" >> "$LOGG"; }

# 1. Alt henta i dag? Då står vi over (med mindre --no er gitt).
if [ "${2:-}" != "--no" ] && [ -f "$FIL" ] && grep -q "\"$I_DAG\"" <(head -c 200 "$FIL"); then
  exit 0
fi

# 2. Spør Bibliofil etter 40 tilfeldige, ferdige postar
SPURNAD='{"mode":"vt","instans":"tysneslokalsamling","marcjson":"1","antall":40,"offset":0,"pubsok_txt_0":"randomize","ccl":"ikke uuuferdig"}'
if ! curl -fsS --max-time 60 -X POST -H 'Content-Type: application/json' \
     -d "$SPURNAD" -o "$NY" "https://strdbib.bib.no/r/web_sok"; then
  logg "Fekk ikkje kontakt med Bibliofil. Endra ingenting."
  rm -f "$NY"; exit 0
fi

# 3. Er svaret gyldig JSON med bilete i? (python3 finst på Ubuntu)
if ! python3 -c 'import json,sys; d=open(sys.argv[1]).read(); json.loads(d); sys.exit(0 if "stit_bilde" in d else 1)' "$NY" 2>/dev/null; then
  logg "Svaret frå Bibliofil ser øydelagt ut eller har ingen bilete. Endra ingenting."
  rm -f "$NY"; exit 0
fi

# 4. Pakk svaret inn som JavaScript (file://-sider kan ikkje fetch-e lokale filer)
{
  printf 'window.LOKALHISTORIE_DATO = "%s";\nwindow.LOKALHISTORIE = ' "$I_DAG"
  cat "$NY"
  printf ';\n'
} > "$FIL.tmp" && mv "$FIL.tmp" "$FIL"
rm -f "$NY"
logg "Henta nye bilete ($(wc -c < "$FIL") byte)."
# --- slutt ---
