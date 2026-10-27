#!/usr/bin/env python3
"""
skjermbilete.py — tek eit bilete av det infoskjermen viser akkurat no.

Bed Chromium om biletet gjennom feilsøkingsporten (berre open inne på
maskina). Krev at kiosken er starta med
    --remote-debugging-port=9222 --user-data-dir=<eiga profilmappe>

Bruk frå Fedora (biletet hamnar i fila skjerm2.png der du står):
    ssh tysnes-folkebibliotek@tysnes-infoskjerm-2 "python3 ~/nytt-paa-hylla/skjermbilete.py" > skjerm2.png

Eller på skjermen sjølv:
    python3 skjermbilete.py bilete.png

Brukar berre Python sitt standardbibliotek, så ingenting treng installerast.
"""

import base64
import json
import os
import socket
import struct
import sys
import urllib.request

PORT = 9222


def finn_side():
    """Finn hovudsida (rotasjon.html) blant det Chromium har ope."""
    with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=5) as svar:
        mål = json.load(svar)
    sider = [m for m in mål if m.get("type") == "page"]
    for m in sider:
        if "rotasjon.html" in m.get("url", ""):
            return m["webSocketDebuggerUrl"]
    if sider:
        return sider[0]["webSocketDebuggerUrl"]
    raise SystemExit("Fann inga open side i Chromium.")


class WebSocket:
    """Ein minimal WebSocket-klient, nok til å snakke med Chromium."""

    def __init__(self, url):
        vert, sti = url.removeprefix("ws://").split("/", 1)
        namn, port = vert.split(":")
        self.s = socket.create_connection((namn, int(port)), timeout=20)
        nøkkel = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((f"GET /{sti} HTTP/1.1\r\nHost: {vert}\r\nUpgrade: websocket\r\n"
                        f"Connection: Upgrade\r\nSec-WebSocket-Key: {nøkkel}\r\n"
                        f"Sec-WebSocket-Version: 13\r\n\r\n").encode())
        svar = b""
        while b"\r\n\r\n" not in svar:
            bit = self.s.recv(1024)
            if not bit:
                raise SystemExit("Chromium svarte ikkje på tilkoplinga.")
            svar += bit
        if b" 101 " not in svar.split(b"\r\n")[0]:
            raise SystemExit("Chromium nekta tilkoplinga: " + svar.split(b"\r\n")[0].decode())
        self.rest = svar.split(b"\r\n\r\n", 1)[1]

    def _les(self, n):
        while len(self.rest) < n:
            bit = self.s.recv(65536)
            if not bit:
                raise SystemExit("Tilkoplinga vart broten.")
            self.rest += bit
        data, self.rest = self.rest[:n], self.rest[n:]
        return data

    def send(self, tekst):
        data = tekst.encode()
        maske = os.urandom(4)
        hovud = bytes([0x81])
        n = len(data)
        if n < 126:
            hovud += bytes([0x80 | n])
        elif n < 65536:
            hovud += bytes([0x80 | 126]) + struct.pack(">H", n)
        else:
            hovud += bytes([0x80 | 127]) + struct.pack(">Q", n)
        self.s.sendall(hovud + maske + bytes(b ^ maske[i % 4] for i, b in enumerate(data)))

    def motta(self):
        melding = b""
        while True:
            b1, b2 = self._les(2)
            n = b2 & 0x7F
            if n == 126:
                n = struct.unpack(">H", self._les(2))[0]
            elif n == 127:
                n = struct.unpack(">Q", self._les(8))[0]
            melding += self._les(n)
            if b1 & 0x80:                      # siste del av meldinga
                return melding.decode()


def main():
    ws = WebSocket(finn_side())
    ws.send(json.dumps({"id": 1, "method": "Page.captureScreenshot", "params": {"format": "png"}}))
    while True:
        svar = json.loads(ws.motta())
        if svar.get("id") == 1:
            break
    if "error" in svar:
        raise SystemExit("Chromium gav feil: " + svar["error"].get("message", ""))
    png = base64.b64decode(svar["result"]["data"])
    if len(sys.argv) > 1:
        with open(sys.argv[1], "wb") as f:
            f.write(png)
        print(f"Lagra {sys.argv[1]} ({len(png) // 1024} kB)", file=sys.stderr)
    else:
        sys.stdout.buffer.write(png)       # til terminalen, for å sende vidare med ssh … > fil.png


if __name__ == "__main__":
    main()
