import { atom } from 'recoil';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_PODCAST_COLOR, DEFAULT_THEME_COLOR } from '../constants/ui';
import { Ans, Episode, FullEpisodeInfo, Podcast } from '../interfaces';
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

export const allPodcasts = atom<FullEpisodeInfo[]>({
    key: "allPodcasts",
    default: [],
});

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

export const queueAtom = atom<Episode[]>({
    key: "queueAtom",
    default: []
});

export const currentPodcastAtom = atom<Podcast>({
    key: 'currentPodcastAtom',
    default: {
        pid: '',
        label: '',
        contentType: '',
        createdAt: 0,
        index: 0,
        owner: '',
        podcastName: '',
        author: '',
        email: '',
        description: '',
        language: '',
        explicit: '',
        categories: [],
        maintainers: [],
        cover: '',
        isVisible: false,
        episodes: [],
        minifiedCover: '',
    },
});

export const currentEpisodeAtom = atom<Episode>({
    key: "currentEpisodeAtom",
    default: {
        eid: '',
        episodeName: '',
        description: '',
        contentTx: '',
        size: 0,
        type: '',
        uploader: '',
        uploadedAt: 0,
        isVisible: false,
    }
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
// *** ------- ***
