import { atom } from 'recoil';
import { BACKGROUND_COLOR, THEME_COLOR } from '../constants/ui';
import { Episode, Podcast } from '../interfaces';
import { RGBAstring, RGBorRGBAstring } from '../interfaces/ui';

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
export const podcasts = atom({
    key: "podcasts",
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

export const latestEpisodes = atom({
    key: "latestEpisodes",
    default: [],
});

// *** ------------- ***



export const titles = atom({
    key: "titles",
    default: [],
});

export const allPodcasts = atom({
    key: "allPodcasts",
    default: [],
});

export const input = atom({
    key: "input",
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

export const creators = atom({
    key: "creators",
    default: []
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

export const themeColor = atom ({
    key: "themeColor",
    default: 'rgb(255, 255, 0)'
})

export const currentThemeColorAtom = atom<RGBorRGBAstring>({
    key: "currentThemeColor",
    default: THEME_COLOR
})

export const backgroundColor = atom ({
    key: "backgroundColor",
    default: BACKGROUND_COLOR
})

export const podcastColor = atom ({
    key: "podcastColor",
    default: 'rgb(0, 0, 0)'
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
