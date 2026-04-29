#!/usr/bin/env python3
"""Diagnose Volumio Socket.IO connection failure.

Tests each layer independently:
1. Raw HTTP to Volumio (is the device reachable?)
2. Volumio REST API (is Volumio running?)
3. Engine.IO handshake with EIO=4 (python-socketio v5 default)
4. Engine.IO handshake with EIO=3 (Socket.IO v2 / older Volumio)
5. Reports installed library versions

Usage: python ws_diagnose.py [host] [port]
"""

import asyncio
import sys

HOST = sys.argv[1] if len(sys.argv) > 1 else "192.168.0.24"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
BASE = f"http://{HOST}:{PORT}"


async def main():
    import aiohttp

    # --- Library versions ---
    print("=" * 60)
    print("LIBRARY VERSIONS")
    print("=" * 60)
    try:
        import socketio
        print(f"  python-socketio: {socketio.__version__}")
    except Exception as e:
        print(f"  python-socketio: IMPORT FAILED — {e}")
    try:
        import engineio
        print(f"  python-engineio: {engineio.__version__}")
    except Exception as e:
        print(f"  python-engineio: IMPORT FAILED — {e}")
    try:
        print(f"  aiohttp: {aiohttp.__version__}")
    except Exception:
        pass
    print(f"  Python: {sys.version}")
    print()

    async with aiohttp.ClientSession() as session:

        # --- Test 1: Raw HTTP ---
        print("=" * 60)
        print(f"TEST 1: HTTP GET {BASE}/")
        print("=" * 60)
        try:
            async with session.get(f"{BASE}/", timeout=aiohttp.ClientTimeout(total=5)) as resp:
                print(f"  Status: {resp.status}")
                print(f"  Content-Type: {resp.headers.get('Content-Type', 'n/a')}")
                body = await resp.text()
                print(f"  Body length: {len(body)} chars")
                print(f"  First 200 chars: {body[:200]}")
                print("  [OK] Volumio is reachable via HTTP")
        except Exception as e:
            print(f"  [FAIL] {e}")
            print("  >> Device may be offline, wrong IP, or wrong port.")
            return
        print()

        # --- Test 2: Volumio REST API ---
        print("=" * 60)
        print(f"TEST 2: Volumio REST API — GET {BASE}/api/v1/getState")
        print("=" * 60)
        try:
            async with session.get(f"{BASE}/api/v1/getState", timeout=aiohttp.ClientTimeout(total=5)) as resp:
                print(f"  Status: {resp.status}")
                if resp.status == 200:
                    import json
                    data = await resp.json()
                    print(f"  Volumio status: {data.get('status', '?')}")
                    print(f"  Volumio title: {data.get('title', '?')}")
                    # Check for system version info
                    print("  [OK] Volumio REST API is responding")
                else:
                    body = await resp.text()
                    print(f"  Body: {body[:300]}")
        except Exception as e:
            print(f"  [FAIL] {e}")
        print()

        # --- Test 2b: Volumio system version ---
        print("=" * 60)
        print(f"TEST 2b: Volumio version — GET {BASE}/api/v1/getSystemVersion")
        print("=" * 60)
        try:
            async with session.get(f"{BASE}/api/v1/getSystemVersion", timeout=aiohttp.ClientTimeout(total=5)) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"  Response: {data}")
                else:
                    print(f"  Status: {resp.status}")
        except Exception as e:
            print(f"  [FAIL] {e}")
        print()

        # --- Test 3: Engine.IO v4 handshake (python-socketio v5 default) ---
        print("=" * 60)
        print(f"TEST 3: Engine.IO v4 handshake (EIO=4)")
        print("=" * 60)
        eio4_url = f"{BASE}/socket.io/?EIO=4&transport=polling"
        try:
            async with session.get(eio4_url, timeout=aiohttp.ClientTimeout(total=5)) as resp:
                print(f"  Status: {resp.status}")
                body = await resp.text()
                print(f"  Body: {body[:300]}")
                if resp.status == 200 and body:
                    print("  [OK] EIO=4 handshake succeeded")
                else:
                    print("  [FAIL] EIO=4 handshake failed or empty response")
        except Exception as e:
            print(f"  [FAIL] {e}")
        print()

        # --- Test 4: Engine.IO v3 handshake (Socket.IO v2) ---
        print("=" * 60)
        print(f"TEST 4: Engine.IO v3 handshake (EIO=3)")
        print("=" * 60)
        eio3_url = f"{BASE}/socket.io/?EIO=3&transport=polling"
        try:
            async with session.get(eio3_url, timeout=aiohttp.ClientTimeout(total=5)) as resp:
                print(f"  Status: {resp.status}")
                body = await resp.text()
                print(f"  Body: {body[:300]}")
                if resp.status == 200 and body:
                    print("  [OK] EIO=3 handshake succeeded")
                else:
                    print("  [FAIL] EIO=3 handshake failed or empty response")
        except Exception as e:
            print(f"  [FAIL] {e}")
        print()

    # --- Summary ---
    print("=" * 60)
    print("NEXT STEPS")
    print("=" * 60)
    print("  If Test 1 failed: check IP, port, device power.")
    print("  If Test 3 failed but Test 4 succeeded: Volumio uses EIO=3 (Socket.IO v2).")
    print("    Fix: pip install 'python-socketio>=5' should handle both,")
    print("    but the client may need to be created differently.")
    print("  If both Test 3 and 4 failed but Test 1 passed: Socket.IO")
    print("    may be at a different path or disabled.")
    print()


if __name__ == "__main__":
    asyncio.run(main())
