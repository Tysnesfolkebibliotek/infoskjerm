#!/bin/bash
# Hentar rotasjon.html (og lokalhistorie-sida, Beta) frå greina «stabil» på
# GitHub og legg dei inn på skjermen. Til slutt hentar han dagens bilete frå
# den lokalhistoriske bildesamlinga (hent-lokalhistorie.sh).
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

BASE="https://raw.githubusercontent.com/Tysnesfolkebibliotek/infoskjerm/stabil/skjerm"
MAPPE="/home/tysnes-folkebibliotek/nytt-paa-hylla"
LOGG="$MAPPE/oppdatering.log"

logg() {
  echo "$(date '+%F %T') $*" >> "$LOGG"
}

# hent <filnamn> <tekst fila må slutte med>
hent() {
  local NAMN="$1" SLUTT="$2"
  local FIL="$MAPPE/$NAMN" NY="$MAPPE/$NAMN.ny"

  # 1. Hent fila til ei mellombels fil
  if ! curl -fsS --max-time 60 -o "$NY" "$BASE/$NAMN?t=$(date +%s)"; then
    logg "Fekk ikkje henta $NAMN (nettet nede?). Endra ingenting."
    rm -f "$NY"; return
  fi

  # 2. Kontroller at fila ikkje er tom og sluttar slik ho skal
  if [ ! -s "$NY" ] || ! tail -c 100 "$NY" | grep -q -- "$SLUTT"; then
    logg "Den henta $NAMN ser øydelagd ut. Endra ingenting."
    rm -f "$NY"; return
  fi

  # 3. Er fila lik den vi har? Då er det ingenting å gjere.
  if cmp -s "$NY" "$FIL"; then
    rm -f "$NY"; return
  fi

  # 4. Ta vare på den gamle og legg inn den nye
  cp -p "$FIL" "$FIL.gammal" 2>/dev/null
  mv "$NY" "$FIL"
  case "$NAMN" in *.sh) chmod +x "$FIL" ;; esac
  logg "La inn ny $NAMN ($(wc -c < "$FIL") byte). Gamal fil: $NAMN.gammal"
}

hent rotasjon.html          '</html>'
hent lokalhistorie.html     '</html>'
hent hent-lokalhistorie.sh  '# --- slutt ---'

# Bilete frå den lokalhistoriske samlinga (berre éin gong per dag)
[ -x "$MAPPE/hent-lokalhistorie.sh" ] && "$MAPPE/hent-lokalhistorie.sh" "$MAPPE"
exit 0
