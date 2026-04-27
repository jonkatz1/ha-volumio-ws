"""Constants for the Volumio WebSocket integration."""

DOMAIN = "volumio_ws"

# Config
CONF_NAME = "name"

# Defaults
DEFAULT_PORT = 3000
DEFAULT_NAME = "Volumio"

# WebSocket events - Emit
WS_GET_STATE = "getState"
WS_PLAY = "play"
WS_PAUSE = "pause"
WS_STOP = "stop"
WS_NEXT = "next"
WS_PREV = "prev"
WS_SEEK = "seek"
WS_VOLUME = "volume"
WS_MUTE = "mute"
WS_UNMUTE = "unmute"
WS_SET_RANDOM = "setRandom"
WS_SET_REPEAT = "setRepeat"
WS_GET_QUEUE = "getQueue"
WS_ADD_TO_QUEUE = "addToQueue"
WS_REMOVE_FROM_QUEUE = "removeFromQueue"
WS_CLEAR_QUEUE = "clearQueue"
WS_MOVE_QUEUE = "moveQueue"
WS_BROWSE_LIBRARY = "browseLibrary"
WS_SEARCH = "search"
WS_GET_BROWSE_SOURCES = "getBrowseSources"
WS_GET_BROWSE_FILTERS = "getBrowseFilters"
WS_ADD_TO_FAVOURITES = "addToFavourites"
WS_REMOVE_FROM_FAVOURITES = "removeFromFavourites"
WS_CREATE_PLAYLIST = "createPlaylist"
WS_DELETE_PLAYLIST = "deletePlaylist"
WS_LIST_PLAYLIST = "listPlaylist"
WS_ADD_TO_PLAYLIST = "addToPlaylist"
WS_REMOVE_FROM_PLAYLIST = "removeFromPlaylist"
WS_PLAY_PLAYLIST = "playPlaylist"
WS_ENQUEUE = "enqueue"
WS_GET_MULTI_ROOM = "getMultiRoomDevices"
WS_CALL_METHOD = "callMethod"
WS_SET_SLEEP = "setSleep"
WS_GET_SLEEP = "getSleep"
WS_ADD_ALARM = "addAlarm"
WS_SET_ALARM = "setAlarm"
WS_REMOVE_ALARM = "removeAlarm"
WS_GET_ALARMS = "getAlarms"

# WebSocket events - Receive (push)
WS_PUSH_STATE = "pushState"
WS_PUSH_QUEUE = "pushQueue"
WS_PUSH_BROWSE_LIBRARY = "pushBrowseLibrary"
WS_PUSH_BROWSE_SOURCES = "pushBrowseSources"
WS_PUSH_LIST_PLAYLIST = "pushListPlaylist"
WS_PUSH_MULTI_ROOM = "pushMultiRoomDevices"

# State mapping: Volumio status -> HA MediaPlayerState
VOLUMIO_STATE_MAPPING = {
    "play": "playing",
    "pause": "paused",
    "stop": "idle",
}

# Supported features flags (computed dynamically, but these are the baseline)
SUPPORT_VOLUMIO = (
    "turn_on",
    "turn_off",
    "play",
    "pause",
    "stop",
    "next_track",
    "previous_track",
    "volume_set",
    "volume_mute",
    "seek",
    "shuffle_set",
    "repeat_set",
    "select_source",
    "play_media",
    "browse_media",
)

# Audio metadata sensor keys
AUDIO_SENSORS = {
    "samplerate": {
        "name": "Sample Rate",
        "icon": "mdi:sine-wave",
        "unit": None,  # value already includes "kHz"
    },
    "bitdepth": {
        "name": "Bit Depth",
        "icon": "mdi:quality-high",
        "unit": None,  # value already includes "bit"
    },
    "trackType": {
        "name": "Track Type",
        "icon": "mdi:file-music",
        "unit": None,
    },
    "channels": {
        "name": "Channels",
        "icon": "mdi:surround-sound",
        "unit": None,
    },
}
