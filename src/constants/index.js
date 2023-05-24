import { FaDiscord, FaTwitter, FaTelegram } from "react-icons/fa";

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

export const PODCAST_LABEL_MIN_LEN = 1;
export const PODCAST_LABEL_MAX_LEN = 35;

export const PODCAST_COVER_MIN_LEN = 43;
export const PODCAST_COVER_MAX_LEN = 43;

export const PODCAST_MINIFIED_COVER_MIN_SIZE = 1;
export const PODCAST_MINIFIED_COVER_MAX_SIZE = 65535;

export const IS_EXPLICIT_VALUES = ["yes", "no"];
export const CONTENT_TYPE_VALUES = ["v", "a"];

export const SPINNER_COLOR = "#e4e4e7" //zinc-200

export const AR_DECIMALS = 1000000000000

/**
 * FADE_IN_STYLE Instructions
 * 1. Call in parent most div or commonly changing components
 * 2. const [isVis, setIsVis] 
 * 3. Call setIsVis in useEffect, set to true
 * 4. call between FADE_OUT_STYLE and FADE_IN_STYLE
 * 5. Works for Modals and Components w Set Areas regardless of load status e.g. Account Balance
 */
export const FADE_OUT_STYLE = "opacity-0 transition-opacity duration-500 ease-in-out"
export const FADE_IN_STYLE = "opacity-100 transition-opacity duration-5git00 ease-in-out"

// TEXT TRUNCATE
export const STR_LEN_EPISODE_BOX = 100
export const STR_LEN_EPISODE_DESC = 400

// API
export const EXM_READ_LINK = "https://api.exm.dev/read/";
// !Please use ARSEED_URL insead of ARWEAVE_READ_LINK for instant retrieval on user-uploaded content
export const ARWEAVE_READ_LINK = "https://arweave.net/";
export const PERMACAST_HELPER_URL = "https://permacast-bloodstone-helper.herokuapp.com/";
export const ANS_MAPPED_STATE_URL = "https://ans-metrics.herokuapp.com/mapped-state/";
export const RSS_FEED_URL = PERMACAST_HELPER_URL + "feeds/rss/"; // requires PID at the end
export const EXM_ANS_CONTRACT_ADDRESS = "VGWeJLDLJ9ify3ezl9tW-9fhB0G-GIUd60FE-5Q-_VI";
export const MESON_ENDPOINT = "https://pz-znmpfs.meson.network/"
export const NFT_CONTRACT = "Pagb13mULiD4GJpPW0kwiSlh7eL58dL1bzdoJzeyczw"
export const NFT_ENDPOINT = EXM_READ_LINK+NFT_CONTRACT
export const RSS_IMPORT_LINK = PERMACAST_HELPER_URL + "import-rss/"
export const RSS_META_LINK = PERMACAST_HELPER_URL+"rss-podcast-metadata/"

// SOCIALS
export const PERMACAST_DISCORD_URL = "https://discord.gg/cQanQVCs7G"
export const PERMACAST_TWITTER_URL = "https://twitter.com/permacastapp"
export const PERMACAST_TELEGRAM_URL = "https://t.me/permacast"

const iconStyling = "w-4 h-4 text-zinc-300"

export const discordObject = {
    "name": "Discord",
    "url": PERMACAST_DISCORD_URL,
    "icon": <FaDiscord className={iconStyling} />
}

export const twitterObject = {
    "name": "Twitter",
    "url": PERMACAST_TWITTER_URL,
    "icon": <FaTwitter className={iconStyling} />
}

export const telegramObject = {
    "name": "Telegram",
    "url": PERMACAST_TELEGRAM_URL,
    "icon": <FaTelegram className={iconStyling} />
}

export const HELP_LINKS = [ discordObject, twitterObject, telegramObject ]


// ERRORS
export const NO_PODCAST_FOUND = "No Podcast Found."
export const NO_EPISODE_FOUND = "No Episode Found."
export const CONNECT_WALLET = "Must connect wallet to continue."
export const LABEL_CHAR_LIMIT = "Label Length must be between 1 and 35 characters."
export const LABEL_IN_USE = "Label already being used."

// SUCCESS
export const PAYLOAD_RECEIVED = "Received"

// ARSEEDING
export const ARSEED_CURRENCY = "ar"
export const ARSEED_URL = "https://arseed.web3infra.dev/"
export const TEXTMARKDOWN = {
    tags: [{name: "Content-Type", value:'text/markdown'}]
}

// PK
export const USER_SIG_MESSAGES = ["my Arweave PK for Permacast is ", "hello world"]
//export const USER_SIG_MESSAGES = ["hello world"]

// PASOM
export const PASOM_SIG_MESSAGES = ["so-ans-profile-metadata"]

// EVERPAY
export const EVERPAY_EOA = '0x6c05FdF443A5c9520af46976A24546191068afbe';
export const EVERPAY_EOA_UPLOADS = `0x026b7A1Fb83e8c3439a65142D54fD4E0d2b36A30`;
export const EVERPAY_FEATURE_TREASURY = "0x6c05FdF443A5c9520af46976A24546191068afbe";
export const EVERPAY_AR_TAG = 'arweave,ethereum-ar-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,0x4fadc7a98f2dc96510e42dd1a74141eeae0c1543';
export const MIN_UPLOAD_PAYMENT = .25 // 250000000000 winston
export const EPISODE_UPLOAD_FEE = .01 // 10000000000 winston
export const EPISODE_SLIPPAGE = 0.001 // 1000000000 winston
export const FEATURE_COST_BASE = 0.3 //  300000000000 winston
export const FEATURE_COST_PER_DAY = 0.1 //100000000000 winston

// MEASUREMENTS
export const GIGABYTE = 1024 ** 3;

// TOAST
export const TOAST_POSITION = "top-center"
export const MINT_DURATION = 5000
export const TOAST_DARK = {
    borderRadius: '10px',
    background: '#333',
    color: '#fff',
}
export const TOAST_MARGIN = "ml-0 md:ml-[100px] lg:ml-[136px]"

// API ERRORS
export const NO_SHOW = "Unable to fetch shows. Refresh and try again."

// ID
export const startId = "#start"

// Initial Load
export const TITLE_WAIT = 100
export const LOGO_WAIT = 700
export const FADE_WAIT = 2500

// Contract Input Names
export const CLAIM_FACTORY = "claimFactory"
export const MINT_NFT = "submitRequest"

// React Query Keys
export const NFT_INFO = "nftInfo"

