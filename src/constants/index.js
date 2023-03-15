// Upload Podcast Constants
export const PODCAST_NAME_MIN_LEN = 2;
export const PODCAST_NAME_MAX_LEN = 500;

export const PODCAST_DESC_MIN_LEN = 10;
export const PODCAST_DESC_MAX_LEN = 15000;

export const PODCAST_AUTHOR_MIN_LEN = 2;
export const PODCAST_AUTHOR_MAX_LEN = 150;

export const PODCAST_LANG_MIN_LEN = 2;
export const PODCAST_LANG_MAX_LEN = 2;

export const PODCAST_CAT_MIN_LEN = 1;
export const PODCAST_CAT_MAX_LEN = 300;

export const EPISODE_NAME_MIN_LEN = 3;
export const EPISODE_NAME_MAX_LEN = 500;

export const EPISODE_DESC_MIN_LEN = 1;
export const EPISODE_DESC_MAX_LEN = 5000;

export const PODCAST_COVER_MIN_LEN = 43;
export const PODCAST_COVER_MAX_LEN = 43;

export const PODCAST_MINIFIED_COVER_MIN_SIZE = 1;
export const PODCAST_MINIFIED_COVER_MAX_SIZE = 65535;

export const IS_EXPLICIT_VALUES = ["yes", "no"];
export const CONTENT_TYPE_VALUES = ["v", "a"];

export const SPINNER_COLOR = "#e4e4e7" //zinc-200

/**
 * FADE_IN_STYLE Instructions
 * 1. Call in parent most div or commonly changing components
 * 2. const [isVis, setIsVis] 
 * 3. Call setIsVis in useEffect, set to true
 * 4. call isVis && opacity-100 in component classname
 */
export const FADE_IN_STYLE = "opacity-0 transition-opacity duration-500 ease-in-out"

// TEXT TRUNCATE
export const STR_LEN_EPISODE_BOX = 100
export const STR_LEN_EPISODE_DESC = 400

// API
export const EXM_READ_LINK = "https://api.exm.dev/read/"
export const ARWEAVE_READ_LINK = "https://arweave.net/"

// ERRORS
export const NO_PODCAST_FOUND = "No Podcast Found."
export const NO_EPISODE_FOUND = "No Episode Found."

// SUCCESS
export const PAYLOAD_RECEIVED = "Received"
