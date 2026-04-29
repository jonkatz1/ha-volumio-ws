#!/usr/bin/env python3
"""Check what socketio package is actually installed."""
import sys
print(f"Python: {sys.version}")
print(f"Python path: {sys.executable}")
print()

# Check what's installed via pip
import subprocess
result = subprocess.run([sys.executable, "-m", "pip", "list"], capture_output=True, text=True)
for line in result.stdout.splitlines():
    low = line.lower()
    if "socket" in low or "engine" in low or "aiohttp" in low:
        print(f"  {line}")
print()

# Check the actual module
try:
    import socketio
    print(f"socketio module file: {socketio.__file__}")
    print(f"socketio dir: {[x for x in dir(socketio) if not x.startswith('_')]}")
    # Check for AsyncClient
    if hasattr(socketio, "AsyncClient"):
        print("socketio.AsyncClient: EXISTS")
        client = socketio.AsyncClient()
        print(f"  Client type: {type(client)}")
    else:
        print("socketio.AsyncClient: MISSING — wrong package!")
except Exception as e:
    print(f"socketio import error: {e}")
print()

try:
    import engineio
    print(f"engineio module file: {engineio.__file__}")
except Exception as e:
    print(f"engineio import error: {e}")
