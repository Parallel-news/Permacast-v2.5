import { atom } from 'recoil';
import { CURRENT_EPISODE_TEMPLATE, CURRENT_PODCAST_TEMPLATE, DEFAULT_BACKGROUND_COLOR, DEFAULT_PODCAST_COLOR, DEFAULT_THEME_COLOR } from '../constants/ui';
import { ANSMapped, Ans, Episode, FullEpisodeInfo, Podcast } from '../interfaces';
import { RGBorRGBAstring } from '../interfaces/ui';

export const uploadPercent = atom({
    key: 'uploadPercent',
    default: 0,
});

export const videoSelection = atom({
    key: 'videoSelection',
    default: ['', {}],
});

export const switchFocus = atom({
    key: 'switchFocus',
    default: true,
});

export const isFullscreenAtom = atom<boolean>({
    key: 'isFullscreenAtom',
    default: false,
});



// *** DATA-FETCHING ***
export const podcastsAtom = atom<Podcast[]>({
    key: "podcastsAtom",
    default: [],
});

export const featuredEpisode = atom({
    key: "featuredEpisode",
    default: {},
});

export const featuredCreators = atom({
    key: "featuredCreators",
    default: [],
});

export const featuredPodcasts = atom({
    key: "featuredPodcasts",
    default: [],
});

export const latestEpisodesAtom = atom<FullEpisodeInfo[]>({
    key: "latestEpisodesAtom",
    default: [],
});

// *** ------------- ***



export const titles = atom({
    key: "titles",
    default: [],
});

export const allPodcasts = atom<Podcast[]>({
    key: "allPodcasts",
    default: [],
});

export const allANSUsersAtom = atom<ANSMapped[]>({
    key: "allANSUsersAtom",
    default: [],
})

export const searchInputAtom = atom<string>({
    key: "searchInputAtom",
    default: ""
});

export const ContentType = atom({
    key: "ContentType",
    default: "a"
})

export const selection = atom({
    key: "selection",
    default: 0
});

export const creatorsAtom = atom<Ans[]>({
    key: "creatorsAtom",
    default: []
});

export const loadTipModal = atom({
    key: "loadTipModal",
    default: false
});


// *** PLAYBACK ***

export const queueAtom = atom<FullEpisodeInfo[]>({
    key: "queueAtom",
    default: []
});

export const currentPodcastAtom = atom<Podcast>({
    key: 'currentPodcastAtom',
    default: CURRENT_PODCAST_TEMPLATE
});

export const currentEpisodeAtom = atom<Episode>({
    key: "currentEpisodeAtom",
    default: CURRENT_EPISODE_TEMPLATE,
});

export const queueHistory = atom({
    key: "queueHistory",
    default: []
})

export const isPlayingAtom = atom<boolean>({
    key: "isPlayingAtom",
    default: false
});

export const isQueueVisibleAtom = atom<boolean>({
    key: "isQueueVisibleAtom",
    default: false
})

export const globalModalOpen = atom({
    key: "globalModalOpen",
    default: false
});



// *** THEMING ***


export const currentThemeColorAtom = atom<RGBorRGBAstring>({
    key: "currentThemeColorAtom",
    default: DEFAULT_THEME_COLOR
})

export const backgroundColorAtom = atom ({
    key: "backgroundColorAtom",
    default: DEFAULT_BACKGROUND_COLOR
})

export const podcastColorAtom = atom ({
    key: "podcastColorAtom",
    default: DEFAULT_PODCAST_COLOR
})

// Everpay
export const everPayBalance = atom({
    key: 'everpayBalance',
    default: 0
  })
  
  export const calculateEverPayBalance = atom({
    key: 'calculateEverpayBalance',
    default: 0
  })

// ARWEAVE
export const arweaveAddress = atom({
  key: 'arweaveAddress',
  default: ""
});

export const userBannerImageAtom = atom<string>({
    key: 'userBannerImageAtom',
    default: ""
});
// *** ------- ***
