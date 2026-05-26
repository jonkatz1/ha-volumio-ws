"""HTTP view for proxying Volumio album art through HA.

Resolves HTTPS mixed-content blocking: when HA serves the panel over
HTTPS, browsers refuse to load <img src="http://volumio:3000/..."> art.
This view fetches the art server-side via aiohttp and returns it over
the same HTTPS origin as the panel.
"""
from __future__ import annotations

import asyncio
import base64
import binascii
import logging
from typing import TYPE_CHECKING

import aiohttp
from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

_FETCH_TIMEOUT = aiohttp.ClientTimeout(total=10)
_CACHE_MAX_AGE = 86400  # 24 hours


class VolumioArtProxyView(HomeAssistantView):
    """Proxy Volumio album art over the HA origin."""

    url = "/api/volumio_ws/art"
    name = "api:volumio_ws:art"
    # <img> tags cannot send Authorization headers. Path is restricted to
    # /albumart below; Volumio itself is unauthenticated on the LAN; the
    # coordinator lookup constrains forwarding to configured devices only.
    requires_auth = False

    def __init__(self, hass: "HomeAssistant") -> None:
        self.hass = hass

    async def get(self, request: web.Request) -> web.Response:
        entry_id = request.query.get("entry")
        path_b64 = request.query.get("path")

        if not entry_id or not path_b64:
            return web.Response(status=400, text="missing entry or path")

        coordinator = self.hass.data.get(DOMAIN, {}).get(entry_id)
        if coordinator is None:
            return web.Response(status=404, text="unknown entry")

        # Path is base64url-encoded by the frontend. This avoids HA's
        # security_filter middleware, which rejects URLs containing "..",
        # "<", ";", etc. — patterns that legitimately appear in Volumio
        # art paths (artist names like "Fred again..", embedded library
        # paths, etc.). Base64url uses only A-Z, a-z, 0-9, -, _ and is
        # filter-safe.
        try:
            padding = "=" * (-len(path_b64) % 4)
            path = base64.urlsafe_b64decode(path_b64 + padding).decode("utf-8")
        except (binascii.Error, UnicodeDecodeError, ValueError):
            return web.Response(status=400, text="invalid path encoding")

        # Ensure it starts with / so the join is correct.
        if not path.startswith("/"):
            path = "/" + path

        # Allowlist: only proxy /albumart paths. Reject everything else to
        # prevent the proxy from being abused to fetch arbitrary Volumio
        # endpoints (e.g. /api/v1/...).
        path_only = path.split("?", 1)[0]
        if path_only != "/albumart":
            return web.Response(status=403, text="forbidden path")

        url = f"{coordinator.base_url}{path}"
        session = async_get_clientsession(self.hass)

        try:
            async with session.get(url, timeout=_FETCH_TIMEOUT) as resp:
                if resp.status != 200:
                    _LOGGER.debug(
                        "Art proxy upstream %s returned %s", url, resp.status
                    )
                    return web.Response(status=resp.status)

                body = await resp.read()
                content_type = resp.headers.get("Content-Type", "image/jpeg")

                return web.Response(
                    body=body,
                    content_type=content_type,
                    headers={
                        "Cache-Control": f"public, max-age={_CACHE_MAX_AGE}",
                    },
                )
        except asyncio.TimeoutError:
            _LOGGER.debug("Art proxy timeout fetching %s", url)
            return web.Response(status=504)
        except aiohttp.ClientError as err:
            _LOGGER.debug("Art proxy client error fetching %s: %s", url, err)
            return web.Response(status=502)


def async_register_art_proxy(hass: "HomeAssistant") -> None:
    """Register the art proxy view. Safe to call once per HA lifetime."""
    hass.http.register_view(VolumioArtProxyView(hass))
