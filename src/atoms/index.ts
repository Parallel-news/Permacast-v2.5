import { atom } from 'recoil';
import { Podcast } from '../interfaces';

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

export const isFullscreen = atom({
    key: 'isFullscreen',
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

export const queue = atom({
    key: "queue",
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

export const currentEpisode = atom({
    key: "currentEpisode",
    default: { contentTx: 'null', pid: 'null', eid: 'null', number: '1' }
});

export const queueHistory = atom({
    key: "queueHistory",
    default: []
})

export const isPlaying = atom({
    key: "isPlaying",
    default: false
});

export const isQueueVisibleAtom = atom({
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

export const currentThemeColor = atom ({
    key: "currentThemeColor",
    default: ''
})

export const backgroundColor = atom ({
    key: "backgroundColor",
    default: 'rgb(0, 0, 0)'
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
