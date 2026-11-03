#!/bin/bash
# Hentar rotasjon.html frå greina «stabil» på GitHub og legg ho inn på skjermen.
#
# - Endrar ingenting om nettet er nede eller fila ser øydelagd ut.
# - Byter berre ut fila når ho faktisk er endra.
# - Tek vare på den gamle fila som rotasjon.html.gammal.
# - Skriv kva som skjer i oppdatering.log (i same mappe).
#
# Den nye fila blir teken i bruk neste gong Chromium startar
# (omstarten kl. 15 eller neste oppstart om morgonen).
#
# Køyrt av systemd-timeren infoskjerm-oppdater.timer.

set -u

URL="https://raw.githubusercontent.com/Tysnesfolkebibliotek/infoskjerm/stabil/skjerm/rotasjon.html"
MAPPE="/home/tysnes-folkebibliotek/nytt-paa-hylla"
FIL="$MAPPE/rotasjon.html"
NY="$MAPPE/rotasjon.html.ny"
LOGG="$MAPPE/oppdatering.log"

logg() {
  echo "$(date '+%F %T') $*" >> "$LOGG"
}

# 1. Hent fila til ei mellombels fil
if ! curl -fsS --max-time 60 -o "$NY" "$URL?t=$(date +%s)"; then
  logg "Fekk ikkje henta fila (nettet nede?). Endra ingenting."
  rm -f "$NY"
  exit 0
fi

# 2. Kontroller at fila ikkje er tom og sluttar med </html>
if [ ! -s "$NY" ] || ! tail -c 100 "$NY" | grep -q '</html>'; then
  logg "Den henta fila ser øydelagd ut. Endra ingenting."
  rm -f "$NY"
  exit 0
fi

# 3. Er fila lik den vi har? Då er det ingenting å gjere.
if cmp -s "$NY" "$FIL"; then
  rm -f "$NY"
  exit 0
fi

# 4. Ta vare på den gamle og legg inn den nye
cp -p "$FIL" "$FIL.gammal" 2>/dev/null
mv "$NY" "$FIL"
logg "La inn ny rotasjon.html ($(wc -c < "$FIL") byte). Gamal fil: rotasjon.html.gammal"
