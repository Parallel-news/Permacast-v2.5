import { atom } from 'recoil';

import { EPISODE_TEMPLATE, PODCAST_TEMPLATE, DEFAULT_BACKGROUND_COLOR, DEFAULT_PODCAST_COLOR, DEFAULT_THEME_COLOR } from '@/constants/ui';

import { ANSMapped, Ans, Episode, FullEpisodeInfo, Podcast, availableProviders } from '@/interfaces/index';
import { RGBorRGBAstring } from '@/interfaces/ui';
import { PASoMProfile } from '@/interfaces/pasom';

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

export const allPodcastsAtom = atom<Podcast[]>({
    key: "allPodcastsAtom",
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
    default: PODCAST_TEMPLATE
});

export const currentEpisodeAtom = atom<Episode>({
    key: "currentEpisodeAtom",
    default: EPISODE_TEMPLATE,
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


export const PASoMProfileAtom = atom<PASoMProfile>({
    key: 'PASoMProfileAtom',
    default: {
        address: "",
        nickname: "",
        bio: "",
        avatar: "",
        banner: "",
        socials: [],
        websites: []
    }
});

export const userBannerImageAtom = atom<string>({
    key: 'userBannerImageAtom',
    default: ""
});

// *** Filters ***

export const chronStatusAtom = atom<number>({
    key: 'chronStatus',
    default: 0
});

export const hide0EpisodesAtom = atom<boolean>({
    key: 'hide0EpisodesAtom',
    default: true    
});
// *** ------- ***

export const selectedProviderAtom = atom<availableProviders>({
    key: 'selectedProviderAtom',
    default: 'arconnect'
});

export const selectWalletModalVisibilityAtom = atom<boolean>({
    key: 'selectWalletModalVisibilityAtom',
    default: false
});

export const walletNotDetectedModalVisibilityAtom = atom<boolean>({
    key: 'walletNotDetectedModalVisibilityAtom',
    default: false
});

export const firstRender = atom<boolean>({
    key: 'firstRender',
    default: false
})

export const loadingPage = atom<boolean>({
    key: 'loadingPage',
    default: false
})
