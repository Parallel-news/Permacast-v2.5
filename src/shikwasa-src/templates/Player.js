const bar = `
  <div class="shk-bar_wrap w-[25vw] rounded-lg">
    <div class="shk-bar" aria-label="progress bar">
      <div class="shk-bar_loaded"
        role="progressbar"
        aria-label="loaded progress"
        aria-valuenow="0"
        aria-valuemin="0"
        aria-valuemax="1"></div>
      <div class="shk-bar_played"
        role="progressbar"
        aria-label="played progress"
        aria-valuenow="0"
        aria-valuemin="0"
        aria-valuemax="1"
      >
        <button class="shk-bar-handle"
          role="slider"
          aria-label="seek progress"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-orientation="horizontal"
          aria-valuemax="1"
        ></button>
      </div>
    </div>
  </div>
`

const time = `
  <div class="shk-display min-w-[150px] flex justify-center items-center">
    <span class="shk-loader" aria-live="polite">
      <span class="shk-visuallyhidden" tabindex="-1">loading</span>
      <svg aria-hidden="true" aria-label="loading" aria-live="polite" viewbox="0 0 66 66">
        <circle cx="33" cy="33" r="30" fill="transparent" stroke="url(#shk-gradient)" stroke-dasharray="170"
          stroke-dashoffset="20" stroke-width="6" />
        <lineargradient id="shk-gradient">
          <stop offset="50%" stop-color="currentColor" />
          <stop offset="65%" stop-color="currentColor" stop-opacity=".5" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </lineargradient>
      </svg>
    </span>
    <span class="shk-time">
      <span class="shk-time_now">00:00</span><span class="shk-time_duration">00:00</span>
    </span>
    <div class="shk-live">live</div>
  </div>
`


// import { Play, Pause } from @heroicons/react/24/outline
const PlayPause = `
  <button class="shk-btn shk-btn_toggle" aria-label="toggle play and pause">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="shk-btn_play w-8 h-8 p-1.5 rounded-full bg-yellow-300/20" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
    <use xlink:href="#shk-icon_play" />

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="shk-btn_pause w-8 h-8 p-1.5 rounded-full bg-yellow-300/20" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
    <use xlink:href="#shk-icon_pause" />
  </button>
`

const PlaybackSpeed = `
  <button
    class="shk-btn shk-btn_speed"
    aria-label="toggle playback rate"
    title="change playback rate"
    aria-live="polite"
  >1.0x</button>
`

const Backwards = `
  <button 
    class="shk-btn shk-btn_backward"
    aria-label="rewind 10 seconds"
    title="rewind 10 seconds"
  >
    <svg aria-hidden="true">
      <use xlink:href="#shk-icon_backward" />
    </svg>
  </button>
`

const Forwards = `
  <button class="shk-btn shk-btn_forward" aria-label="forward 10 seconds" title="forward 10 seconds">
    <svg aria-hidden="true">
      <use xlink:href="#shk-icon_forward" />
    </svg>
  </button>
`

const More = `
  <button class="shk-btn shk-btn_more" aria-label="more controls" title="more controls">
    <svg aria-hidden="true">
      <use xlink:href="#shk-icon_more" />
    </svg>
  </button>
`

const Volume = `
  <button class="shk-btn shk-btn_volume" aria-label="toggle volume" title="volume">
    <svg class="shk-btn_unmute" aria-hidden="true">
      <use xlink:href="#shk-icon_unmute" />
    </svg>
    <svg class="shk-btn_mute" aria-hidden="true">
      <use xlink:href="#shk-icon_mute" />
    </svg>
  </button>
`

const ShareButton = `
  <button class="shk-btn shk-btn_share" aria-label="share" title="share">
    <svg aria-hidden="true">
      <use xlink:href="#shk-icon_share" />
    </svg>
  </button>
`

const Fullscreen = `
  <button class="shk-btn shk-btn_fullscreen" aria-label="toggle fullscreen" title="fullscreen">
    <svg class="shk-btn_fullscreen" aria-hidden="true">
      <use xlink:href="#shk-icon_fullscreen" />
    </svg>
    <svg class="shk-btn_exitfullscreen" aria-hidden="true">
      <use xlink:href="#shk-icon_exitfullscreen" />
    </svg>
  </button>
`

const Queue = `
  <button class="shk-btn shk-btn_queue" aria-label="toggle queue" title="queue">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="text-[rgb(255,255,0]">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
    </svg>
    <use xlink:href="#shk-icon_queue" />
  </button>
`


// ${ShareButton}
// ${Fullscreen}

const extrabuttons = `
  <div class="shk-controls">
    <div class="shk-controls_basic">
      ${PlaybackSpeed}
      ${Volume}
      ${Queue}
      <div class="hidden">
        ${More}
      </div>
    </div>
    <div class="shk-controls_extra hidden">
    </div>
  </div>
`

const info = `
  <div class="col-span-2 flex items-center">
    <div class="shk-cover m-4">
      <div class="shk-img"></div>
    </div>
    <div class="ml-2 flex flex-col mr-8">
      <div class="shk-title_wrap max-w-[320px]">
        <div class="shk-title_inner">
          <span class="shk-title"></span>
        </div>
      </div>
      <div class="shk-artist_wrap max-w-max mt-0.5">
        <span class="shk-artist text-[rgb(0,255,255]"></span>
      </div>
    </div>
  </div>
`


const PlayerTemplate = /* template */ `
  <div class="h-[92px] max-w-full bg-zinc-900">
    <div class="grid grid-cols-6 items-center">
      ${info}
      <div class="flex items-center col-span-3">
        <div class="shk-controls_basic flex items-center pb-1">
          ${Backwards}
          ${PlayPause}
          ${Forwards}
        </div>
        ${time}
        ${bar}
      </div>
      <div>
        ${extrabuttons}
      </div>
    </div>
  </div>
`
export default PlayerTemplate
