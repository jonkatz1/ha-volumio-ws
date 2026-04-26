"""Media player entity for Volumio WebSocket integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.media_player import (
    MediaPlayerEntity,
    MediaPlayerEntityFeature,
    MediaPlayerState,
    MediaType,
    RepeatMode,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    VOLUMIO_STATE_MAPPING,
    WS_PLAY,
    WS_PAUSE,
    WS_STOP,
    WS_NEXT,
    WS_PREV,
    WS_SEEK,
    WS_VOLUME,
    WS_MUTE,
    WS_UNMUTE,
    WS_SET_RANDOM,
    WS_SET_REPEAT,
    WS_GET_STATE,
    WS_ADD_TO_QUEUE,
    WS_CLEAR_QUEUE,
)
from .coordinator import VolumioWebSocketCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Volumio media player from config entry."""
    coordinator: VolumioWebSocketCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([VolumioMediaPlayer(coordinator, entry)])


class VolumioMediaPlayer(MediaPlayerEntity):
    """Representation of a Volumio media player."""

    _attr_has_entity_name = True
    _attr_name = None  # Uses device name

    def __init__(
        self,
        coordinator: VolumioWebSocketCoordinator,
        entry: ConfigEntry,
    ) -> None:
        """Initialize the media player."""
        self.coordinator = coordinator
        self._entry = entry
        self._attr_unique_id = f"{DOMAIN}_{entry.entry_id}"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry.entry_id)},
            "name": coordinator.name,
            "manufacturer": "Volumio",
            "model": "Volumio Player",
            "sw_version": None,  # TODO: get from device info
        }
        self._unregister_listener: callable | None = None

    @property
    def supported_features(self) -> MediaPlayerEntityFeature:
        """Return supported features."""
        return (
            MediaPlayerEntityFeature.PLAY
            | MediaPlayerEntityFeature.PAUSE
            | MediaPlayerEntityFeature.STOP
            | MediaPlayerEntityFeature.NEXT_TRACK
            | MediaPlayerEntityFeature.PREVIOUS_TRACK
            | MediaPlayerEntityFeature.VOLUME_SET
            | MediaPlayerEntityFeature.VOLUME_MUTE
            | MediaPlayerEntityFeature.VOLUME_STEP
            | MediaPlayerEntityFeature.SEEK
            | MediaPlayerEntityFeature.SHUFFLE_SET
            | MediaPlayerEntityFeature.REPEAT_SET
            | MediaPlayerEntityFeature.PLAY_MEDIA
            | MediaPlayerEntityFeature.BROWSE_MEDIA
            | MediaPlayerEntityFeature.SELECT_SOURCE
            | MediaPlayerEntityFeature.TURN_ON
            | MediaPlayerEntityFeature.TURN_OFF
        )

    @property
    def available(self) -> bool:
        """Return True if the player is available."""
        return self.coordinator.connected

    @property
    def state(self) -> MediaPlayerState | None:
        """Return the current state."""
        if not self.coordinator.connected:
            return MediaPlayerState.OFF
        volumio_status = self.coordinator.state.get("status", "stop")
        ha_state = VOLUMIO_STATE_MAPPING.get(volumio_status)
        if ha_state == "playing":
            return MediaPlayerState.PLAYING
        elif ha_state == "paused":
            return MediaPlayerState.PAUSED
        return MediaPlayerState.IDLE

    @property
    def volume_level(self) -> float | None:
        """Return volume level (0..1)."""
        vol = self.coordinator.state.get("volume")
        if vol is not None:
            return vol / 100.0
        return None

    @property
    def is_volume_muted(self) -> bool | None:
        """Return True if volume is muted."""
        return self.coordinator.state.get("mute")

    @property
    def media_title(self) -> str | None:
        """Return the current media title."""
        return self.coordinator.state.get("title")

    @property
    def media_artist(self) -> str | None:
        """Return the current media artist."""
        return self.coordinator.state.get("artist")

    @property
    def media_album_name(self) -> str | None:
        """Return the current media album."""
        return self.coordinator.state.get("album")

    @property
    def media_image_url(self) -> str | None:
        """Return the current media image URL."""
        return self.coordinator.resolve_albumart(
            self.coordinator.state.get("albumart")
        )

    @property
    def media_content_type(self) -> MediaType | None:
        """Return the content type."""
        if self.coordinator.state.get("stream"):
            return MediaType.CHANNEL
        return MediaType.MUSIC

    @property
    def media_duration(self) -> int | None:
        """Return the duration in seconds."""
        return self.coordinator.state.get("duration")

    @property
    def media_position(self) -> int | None:
        """Return the current position in seconds."""
        seek = self.coordinator.state.get("seek")
        if seek is not None:
            return seek // 1000  # Volumio reports in milliseconds
        return None

    @property
    def shuffle(self) -> bool | None:
        """Return True if shuffle is enabled."""
        return self.coordinator.state.get("random")

    @property
    def repeat(self) -> RepeatMode | None:
        """Return the current repeat mode."""
        if self.coordinator.state.get("repeatSingle"):
            return RepeatMode.ONE
        if self.coordinator.state.get("repeat"):
            return RepeatMode.ALL
        return RepeatMode.OFF

    @property
    def source(self) -> str | None:
        """Return the current source/service."""
        return self.coordinator.state.get("service")

    @property
    def source_list(self) -> list[str] | None:
        """Return available sources."""
        # TODO: Populate from getBrowseSources
        return None

    # --- Playback commands ---

    async def async_media_play(self) -> None:
        """Send play command."""
        await self.coordinator.async_emit(WS_PLAY)

    async def async_media_pause(self) -> None:
        """Send pause command."""
        await self.coordinator.async_emit(WS_PAUSE)

    async def async_media_stop(self) -> None:
        """Send stop command."""
        await self.coordinator.async_emit(WS_STOP)

    async def async_media_next_track(self) -> None:
        """Send next track command."""
        await self.coordinator.async_emit(WS_NEXT)

    async def async_media_previous_track(self) -> None:
        """Send previous track command."""
        await self.coordinator.async_emit(WS_PREV)

    async def async_media_seek(self, position: float) -> None:
        """Seek to position (seconds)."""
        await self.coordinator.async_emit(WS_SEEK, int(position))

    # --- Volume commands ---

    async def async_set_volume_level(self, volume: float) -> None:
        """Set volume level (0..1)."""
        await self.coordinator.async_emit(WS_VOLUME, int(volume * 100))

    async def async_mute_volume(self, mute: bool) -> None:
        """Mute or unmute."""
        if mute:
            await self.coordinator.async_emit(WS_MUTE, "")
        else:
            await self.coordinator.async_emit(WS_UNMUTE, "")

    async def async_volume_up(self) -> None:
        """Volume up."""
        await self.coordinator.async_emit(WS_VOLUME, "+")

    async def async_volume_down(self) -> None:
        """Volume down."""
        await self.coordinator.async_emit(WS_VOLUME, "-")

    # --- Shuffle / Repeat ---

    async def async_set_shuffle(self, shuffle: bool) -> None:
        """Set shuffle mode."""
        await self.coordinator.async_emit(WS_SET_RANDOM, {"value": shuffle})

    async def async_set_repeat(self, repeat: RepeatMode) -> None:
        """Set repeat mode."""
        if repeat == RepeatMode.OFF:
            await self.coordinator.async_emit(WS_SET_REPEAT, {"value": False})
        elif repeat == RepeatMode.ALL:
            await self.coordinator.async_emit(WS_SET_REPEAT, {"value": True})
        elif repeat == RepeatMode.ONE:
            # Volumio has repeatSingle but no direct WS command documented
            # Set repeat true first, then toggle single via REST fallback
            await self.coordinator.async_emit(WS_SET_REPEAT, {"value": True})

    # --- Play media ---

    async def async_play_media(
        self, media_type: MediaType | str, media_id: str, **kwargs: Any
    ) -> None:
        """Play media by URI."""
        # Add to queue and play
        await self.coordinator.async_emit(WS_CLEAR_QUEUE)
        await self.coordinator.async_emit(WS_ADD_TO_QUEUE, {"uri": media_id})
        await self.coordinator.async_emit(WS_PLAY, {"value": 0})

    # --- Browse media ---

    async def async_browse_media(
        self,
        media_content_type: MediaType | str | None = None,
        media_content_id: str | None = None,
    ):
        """Browse media on Volumio."""
        from .browse_media import async_browse_media

        return await async_browse_media(
            self.coordinator, media_content_type, media_content_id
        )

    # --- Power ---

    async def async_turn_on(self) -> None:
        """Turn on (play)."""
        await self.coordinator.async_emit(WS_PLAY)

    async def async_turn_off(self) -> None:
        """Turn off (stop)."""
        await self.coordinator.async_emit(WS_STOP)

    # --- Entity lifecycle ---

    async def async_added_to_hass(self) -> None:
        """Register state listener when added to hass."""
        self._unregister_listener = self.coordinator.register_state_listener(
            self._handle_state_update
        )
        # Request fresh state
        await self.coordinator.async_emit(WS_GET_STATE)

    async def async_will_remove_from_hass(self) -> None:
        """Unregister listener when removed."""
        if self._unregister_listener:
            self._unregister_listener()

    @callback
    def _handle_state_update(self) -> None:
        """Handle a state update from Volumio."""
        self.async_write_ha_state()
