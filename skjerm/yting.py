#!/usr/bin/env python3
"""
yting.py — måler kor godt infoskjermen klarer å teikne det han viser.

Spør Chromium gjennom feilsøkingsporten (same som skjermbilete.py) om:
  1. grafikken: brukar Chromium grafikkprosessoren, eller teiknar han alt
     med prosessoren («software»), som er mykje tregare?
  2. bilete i sekundet (fps) i kvar side som er open no (rotasjonen,
     plakatkarusellen, plakatane, bokkarusellane), målt i 5 sekund.
  3. kor travel maskina er (load average).

Bruk frå Fedora, utan å leggje skriptet på skjermen:
    curl -fsS https://raw.githubusercontent.com/Tysnesfolkebibliotek/infoskjerm/main/skjerm/yting.py | ssh skjerm1 python3 -

Brukar berre Python sitt standardbibliotek, så ingenting treng installerast.
Endrar ingenting på skjermen.
"""

import base64
import json
import os
import socket
import struct
import urllib.request

PORT = 9222
MÅLETID_MS = 5000


class WebSocket:
    """Ein minimal WebSocket-klient, nok til å snakke med Chromium."""

    def __init__(self, url):
        vert, sti = url.removeprefix("ws://").split("/", 1)
        namn, port = vert.split(":")
        self.s = socket.create_connection((namn, int(port)), timeout=30)
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
        self.neste_id = 0

    def _les(self, n):
        while len(self.rest) < n:
            bit = self.s.recv(65536)
            if not bit:
                raise SystemExit("Tilkoplinga vart broten.")
            self.rest += bit
        data, self.rest = self.rest[:n], self.rest[n:]
        return data

    def _send(self, tekst):
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

    def _motta(self):
        melding = b""
        while True:
            b1, b2 = self._les(2)
            n = b2 & 0x7F
            if n == 126:
                n = struct.unpack(">H", self._les(2))[0]
            elif n == 127:
                n = struct.unpack(">Q", self._les(8))[0]
            melding += self._les(n)
            if b1 & 0x80:
                return json.loads(melding.decode())

    def kall(self, metode, param=None, økt=None):
        """Sender éin kommando og ventar på svaret (hendingar imellom blir hoppa over)."""
        self.neste_id += 1
        m = {"id": self.neste_id, "method": metode, "params": param or {}}
        if økt:
            m["sessionId"] = økt
        self._send(json.dumps(m))
        while True:
            svar = self._motta()
            if svar.get("id") == self.neste_id:
                if "error" in svar:
                    raise RuntimeError(svar["error"].get("message", ""))
                return svar["result"]


# Køyrer inne i kvar side: tel bilete (requestAnimationFrame) i 5 sekund, både i
# sida sjølv og i rammene inne i ho som kjem frå same stad (t.d. plakatane i
# plakatkarusellen). Rammer frå andre stader er eigne mål og blir målte for seg.
MÅLING = """
(() => {
  const vindauge = [[location.href, window, true]];
  for (const f of document.querySelectorAll("iframe")) {
    try { f.contentWindow.document; vindauge.push([f.contentWindow.location.href, f.contentWindow,
          getComputedStyle(f).opacity !== "0" && getComputedStyle(f).visibility !== "hidden"]); } catch (e) {}
  }
  return Promise.all(vindauge.map(([url, w, synleg]) => new Promise(ok => {
    let n = 0, førre = w.performance.now(), verst = 0, ferdig = false;
    const t0 = førre;
    const slutt = (t) => { if (ferdig) return; ferdig = true;
      ok({ url, synleg, fps: n / (Math.max(1, t - t0) / 1000), verst: n ? verst : null }); };
    const steg = t => {
      n++; verst = Math.max(verst, t - førre); førre = t;
      if (t - t0 < %d) w.requestAnimationFrame(steg); else slutt(t);
    };
    w.requestAnimationFrame(steg);
    setTimeout(() => slutt(w.performance.now()), %d + 2000);
  }))).then(r => JSON.stringify(r));
})()
""" % (MÅLETID_MS, MÅLETID_MS)


def kortnamn(url):
    namn = url.split("?")[0].split("#")[0].rsplit("/", 1)[-1] or url
    if "#" in url and "mal=" in url:
        namn += " (" + url.split("mal=")[1].split("&")[0] + ")"
    return namn


def main():
    with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=5) as svar:
        ws = WebSocket(json.load(svar)["webSocketDebuggerUrl"])

    # 1. Grafikken
    print("== Grafikk ==")
    try:
        info = ws.kall("SystemInfo.getInfo")["gpu"]
        for d in info.get("devices", [])[:1]:
            print(f"  Grafikkort: {d.get('vendorString') or d.get('vendorId')} {d.get('deviceString') or d.get('deviceId')}")
        status = info.get("featureStatus", {})
        for k in ("gpu_compositing", "rasterization", "canvas_2d", "webgl"):
            if k in status:
                print(f"  {k:16} {status[k]}")
        if "software" in str(status.get("gpu_compositing", "")) or "disabled" in str(status.get("gpu_compositing", "")):
            print("  -> Chromium teiknar alt med prosessoren (ikkje grafikkortet). Det forklarer hakking.")
    except Exception as e:
        print("  Fekk ikkje grafikkinfo:", e)

    # 2. Bilete i sekundet i kvar side
    print(f"\n== Bilete i sekundet (målt i {MÅLETID_MS // 1000} sekund, 60 er perfekt) ==")
    mål = [m for m in ws.kall("Target.getTargets")["targetInfos"]
           if m["type"] in ("page", "iframe") and m["url"].startswith(("http", "file"))]
    økter = []
    for m in mål:
        try:
            økt = ws.kall("Target.attachToTarget", {"targetId": m["targetId"], "flatten": True})["sessionId"]
            økter.append((m, økt))
        except Exception:
            pass
    # Mål kvar side etter tur (5 sekund kvar)
    for m, økt in økter:
        try:
            r = ws.kall("Runtime.evaluate", {"expression": MÅLING, "awaitPromise": True, "returnByValue": True}, økt)
            for v in json.loads(r["result"]["value"]):
                verst = f"{v['verst']:.0f} ms" if v["verst"] is not None else "–"
                kva = "VIST   " if v["synleg"] else "skjult "
                print(f"  {v['fps']:5.1f} fps  (lengste pause {verst:>7})  {kva} {kortnamn(v['url'])}")
        except Exception as e:
            print(f"    –  {kortnamn(m['url'])}: {e}")
        finally:
            try:
                ws.kall("Target.detachFromTarget", {"sessionId": økt})
            except Exception:
                pass
    print("  «VIST» er det som er på skjermen no. Skjulte sider kan ha 0 fps – det er som det skal.")

    # 3. Kor travel maskina er
    l1, l5, _ = os.getloadavg()
    print(f"\n== Last ==\n  load average: {l1:.2f} (siste minutt), {l5:.2f} (siste 5 min), "
          f"{os.cpu_count()} kjerner")


if __name__ == "__main__":
    main()
