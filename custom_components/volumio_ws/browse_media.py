"""Browse media support for Volumio WebSocket integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.media_player import BrowseMedia, MediaClass, MediaType

from .coordinator import VolumioWebSocketCoordinator

_LOGGER = logging.getLogger(__name__)

# Map Volumio item types to HA media classes
TYPE_TO_MEDIA_CLASS = {
    "song": MediaClass.TRACK,
    "track": MediaClass.TRACK,
    "folder": MediaClass.DIRECTORY,
    "category": MediaClass.DIRECTORY,
    "playlist": MediaClass.PLAYLIST,
    "album": MediaClass.ALBUM,
    "artist": MediaClass.ARTIST,
    "genre": MediaClass.GENRE,
    "webradio": MediaClass.CHANNEL,
    "radio-favourites": MediaClass.CHANNEL,
    "radio-category": MediaClass.DIRECTORY,
}

# Volumio types that can be played directly
PLAYABLE_TYPES = {"song", "track", "webradio", "mywebradio", "cuesong"}


async def async_browse_media(
    coordinator: VolumioWebSocketCoordinator,
    media_content_type: MediaType | str | None = None,
    media_content_id: str | None = None,
) -> BrowseMedia:
    """Browse media on Volumio."""
    if media_content_id is None or media_content_id == "":
        # Root level — get browse sources
        return await _async_browse_root(coordinator)

    # Browse into a specific URI
    response = await coordinator.async_browse(media_content_id)
    if response is None:
        raise BrowseError(f"No response from Volumio for URI: {media_content_id}")

    return _parse_browse_response(coordinator, response, media_content_id)


async def _async_browse_root(coordinator: VolumioWebSocketCoordinator) -> BrowseMedia:
    """Build the root browse tree from Volumio's browse sources."""
    sources = await coordinator.async_get_browse_sources()

    children: list[BrowseMedia] = []
    for source in sources:
        source_name = source.get("name", "Unknown")
        source_uri = source.get("uri", "")

        if not source_uri:
            _LOGGER.debug("Skipping browse source with no URI: %s", source_name)
            continue

        # Resolve album art — sources use "albumart" or "icon"
        thumbnail = coordinator.resolve_albumart(
            source.get("albumart", source.get("icon"))
        )

        child = BrowseMedia(
            media_class=MediaClass.DIRECTORY,
            media_content_id=source_uri,
            media_content_type="library",
            title=source_name,
            can_play=False,
            can_expand=True,
            thumbnail=thumbnail,
        )
        children.append(child)

    if not children:
        _LOGGER.warning("getBrowseSources returned no usable sources")

    return BrowseMedia(
        media_class=MediaClass.DIRECTORY,
        media_content_id="",
        media_content_type="library",
        title="Volumio",
        can_play=False,
        can_expand=True,
        children=children,
    )


def _parse_browse_response(
    coordinator: VolumioWebSocketCoordinator,
    response: dict[str, Any],
    parent_uri: str,
) -> BrowseMedia:
    """Parse a Volumio browseLibrary response into BrowseMedia."""
    navigation = response.get("navigation", {})
    lists = navigation.get("lists", [])

    children: list[BrowseMedia] = []

    for browse_list in lists:
        items = browse_list.get("items", [])
        for item in items:
            item_type = item.get("type", "folder")
            item_uri = item.get("uri", "")
            item_title = item.get("title", item.get("name", "Unknown"))
            item_artist = item.get("artist", "")
            item_album = item.get("album", "")

            media_class = TYPE_TO_MEDIA_CLASS.get(item_type, MediaClass.DIRECTORY)
            can_play = item_type in PLAYABLE_TYPES
            can_expand = item_type not in PLAYABLE_TYPES

            # Resolve album art
            thumbnail = coordinator.resolve_albumart(
                item.get("albumart", item.get("icon"))
            )

            child = BrowseMedia(
                media_class=media_class,
                media_content_id=item_uri,
                media_content_type=_type_to_content_type(item_type),
                title=item_title,
                can_play=can_play,
                can_expand=can_expand,
                thumbnail=thumbnail,
            )
            children.append(child)

    # Build parent node
    return BrowseMedia(
        media_class=MediaClass.DIRECTORY,
        media_content_id=parent_uri,
        media_content_type="library",
        title=_title_from_uri(parent_uri),
        can_play=False,
        can_expand=True,
        children=children,
    )


def _type_to_content_type(volumio_type: str) -> str:
    """Map Volumio item type to HA media content type."""
    mapping = {
        "song": MediaType.TRACK,
        "track": MediaType.TRACK,
        "playlist": MediaType.PLAYLIST,
        "album": MediaType.ALBUM,
        "artist": MediaType.ARTIST,
        "genre": MediaType.GENRE,
        "webradio": MediaType.CHANNEL,
    }
    return mapping.get(volumio_type, "library")


def _title_from_uri(uri: str) -> str:
    """Generate a display title from a browse URI."""
    if not uri or uri == "":
        return "Volumio"
    # Use the last path segment
    parts = uri.rstrip("/").split("/")
    return parts[-1].replace("-", " ").replace("_", " ").title()


class BrowseError(Exception):
    """Error during media browsing."""
