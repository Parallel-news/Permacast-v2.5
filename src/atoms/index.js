import { atom } from 'recoil';

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

export const primaryData = atom({
    key: 'primaryData',
    default: {},
});

export const secondaryData = atom({
    key: 'secondaryData',
    default: {},
});

export const ContentType = atom({
    key: 'ContentType',
    default: 'a',
});

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

export const selection = atom({
    key: "selection",
    default: 0
});

export const creators = atom({
    key: "creators",
    default: []
});

export const queue = atom({
    key: "queue",
    default: []
});

export const currentEpisode = atom({
    key: "currentEpisode",
    default: { contentTx: 'null', pid: 'null', eid: 'null', number: '1' }
});

export const player = atom({
    key: "player",
    default: {}
});

export const isPaused = atom({
    key: "isPaused",
    default: ""
});