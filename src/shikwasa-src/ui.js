import PlayerComp from './templates/Player'
import IconComp from './templates/Icon'
import { secondToTime, numToString, marquee, createElement, toggleAttribute } from './utils'
import applyFocusVisible from './focus-visible'
import { dimColorObject, isTooLight, RGBAobjectToString, RGBAstringToObject } from '../utils/ui'
import { shortenAddress } from 'react-arconnect'

let resize,
  coverUrl = null
let cooldown = true

export default class UI {
  constructor(options) {
    this.mounted = false
    this.icons = createElement({
      className: 'shk-icons',
      innerHTML: IconComp,
    })
    if (options.customTemplate) {
      this.initEl(options.customTemplate)
    } else {
      this.initEl(PlayerComp)
    }
    this.initOptions(options)
  }

  async initEl(template) {
    this.el = createElement({
      className: ['shk', 'shikwasa'],
      attrs: {
        'data-name': 'shikwasa',
      },
      innerHTML: template,
    })
    this.playBtn = this.el.querySelector('.shk-btn_toggle')
    this.fwdBtn = this.el.querySelector('.shk-btn_forward')
    this.bwdBtn = this.el.querySelector('.shk-btn_backward')
    this.speedBtn = this.el.querySelector('.shk-btn_speed')
    this.moreBtn = this.el.querySelector('.shk-btn_more')
    this.muteBtn = this.el.querySelector('.shk-btn_volume')
    this.queueBtn = this.el.querySelector('.shk-btn_queue')
    this.fullscreenBtn = this.el.querySelector('.shk-btn_fullscreen')
    this.extraControls = this.el.querySelector('.shk-controls_extra')
    this.texts = this.el.querySelector('.shk-text')
    this.artist = this.el.querySelector('.shk-artist')
    this.artistWrap = this.el.querySelector('.shk-artist_wrap')
    this.titleWrap = this.el.querySelector('.shk-title_wrap')
    this.titleInner = this.el.querySelector('.shk-title_inner')
    this.title = this.el.querySelector('.shk-title')
    this.currentTime = this.el.querySelector('.shk-time_now')
    this.duration = this.el.querySelector('.shk-time_duration')
    this.bar = this.el.querySelector('.shk-bar')
    this.barWrap = this.el.querySelector('.shk-bar_wrap')
    this.audioPlayed = this.el.querySelector('.shk-bar_played')
    this.audioLoaded = this.el.querySelector('.shk-bar_loaded')
    this.handle = this.el.querySelector('.shk-bar-handle')
    this.cover = this.el.querySelector('.shk-cover')
    this.seekControls = [this.fwdBtn, this.bwdBtn, this.handle]
  }

  initOptions(options) {
    // dark mode
    this.el.style = `--color-primary: ${options.themeColor}`
    this.el.setAttribute('data-theme', options.theme)

    // download
    if (options.download && options.audio && options.audio.src) {
      this.downloadBtn = createElement({
        tag: 'a',
        className: ['shk-btn', 'shk-btn_download'],
        attrs: {
          title: 'download',
          'aria-label': 'download',
          href: typeof options.download === 'string' ? options.download : options.audio.src,
          download: '',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        innerHTML: /* html */ `
          <svg aria-hidden="true">
            <use xlink:href="#shk-icon_download" />
          </svg>
        `,
      })
      this.extraControls.append(this.downloadBtn)
    }

    // player position
    this.el.setAttribute('data-fixed-type', options.fixed.type)
    if (options.fixed.type !== 'static' && options.fixed.position === 'top') {
      this.el.setAttribute('data-fixed-pos', options.fixed.position)
    }

    // player status display
    const playStatus = options.autoPlay ? 'playing' : 'paused'
    this.el.setAttribute('data-play', playStatus)

    // mute status display
    if (options.muted) {
      this.el.setAttribute('data-mute', '')
    }
    if (options.fullscreen) {
      this.el.setAttribute('data-fullscreen', '')
    }
  }

  initEvents(supportsPassive) {
    this.moreBtn.addEventListener('click', () => {
      toggleAttribute(this.el, 'data-extra')
    })
    Array.from(this.extraControls.children).forEach((el) => {
      this.hideExtraControl(el)
    })

    // add keyboard focus style
    applyFocusVisible(this.el, supportsPassive)

    resize = () => {
      if (!cooldown) return
      cooldown = false
      setTimeout(() => (cooldown = true), 100)
      marquee.call(this, this.titleWrap, this.title)
    }
    window.addEventListener('resize', resize)
  }

  setAudioInfo(audio = {}) {
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl)
      coverUrl = null
    }
    if (/blob/.test(audio.cover)) {
      coverUrl = audio.cover
    }
    if (audio.cover) {
      this.cover.style.backgroundImage = `url(${audio.cover})`
    } else {
      this.cover.style.backgroundImage = 'none'
    }
    this.title.innerHTML = audio.title
    this.titleInner.setAttribute('data-title', audio.title)
    this.artist.innerHTML = shortenAddress(audio.artist)
    let artistColor = audio.color;
    let artistTextColor;
    if (artistColor) {
      let { r, g, b, a } = RGBAstringToObject(audio.color)
      artistColor = RGBAobjectToString(dimColorObject({ r, g, b }, 0.4));
      artistTextColor = isTooLight({r, g, b, a}, 0.8) ? 'black' : 'white';
    }
    this.artist.style = (artistColor && 'background-color:' + artistColor + ';color:' + artistTextColor)
    this.artist.className = 'rounded-full px-3 py-1 ' + (!artistColor && 'bg-yellow-300/20 text-[rgb(255,255,0)]')
    if (audio.duration) {
      this.duration.innerHTML = secondToTime(audio.duration)
    }
    if (this.downloadBtn) {
      this.downloadBtn.href = audio.src
    }
    this.setBar('loaded', 0)
    this.setLive(audio.live)
    marquee(this.titleWrap, this.title)
  }

  setPlaying() {
    this.el.setAttribute('data-play', 'playing')
  }

  setPaused() {
    this.el.setAttribute('data-play', 'paused')
    this.el.removeAttribute('data-loading')
  }

  setTime(type, time) {
    this[type].innerHTML = secondToTime(time)
  }

  setBar(type, percentage) {
    const typeName = 'audio' + type.charAt(0).toUpperCase() + type.substr(1)
    percentage = Math.min(percentage, 1)
    percentage = Math.max(percentage, 0)
    this[typeName].style.width = percentage * 100 + '%'
    const ariaNow = percentage.toFixed(2)
    this[typeName].setAttribute('aria-valuenow', ariaNow)
    this.handle.setAttribute('aria-valuenow', ariaNow)
  }

  setProgress(time = 0, percentage = 0, duration = 0) {
    if (time && !percentage) {
      percentage = duration ? time / duration : 0
    } else {
      time = percentage * (duration || 0)
    }
    this.setTime('currentTime', time)
    this.setBar('played', percentage)
  }

  setSpeed(speed) {
    this.speedBtn.innerHTML = numToString(speed) + 'x'
  }

  setLive(live = false) {
    live ? this.el.setAttribute('data-live', '') : this.el.removeAttribute('data-live')
  }

  getPercentByPos(e) {
    const handlePos = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0
    const initPos = this.barWrap.getBoundingClientRect().left
    const barLength = this.barWrap.clientWidth
    let percentage = (handlePos - initPos) / barLength
    percentage = Math.min(percentage, 1)
    percentage = Math.max(0, percentage)
    return percentage
  }

  hideExtraControl(el) {
    el.addEventListener('click', () => {
      setTimeout(() => {
        this.el.removeAttribute('data-extra')
      }, 800)
    })
  }

  mount(container, supportsPassive) {
    container.innerHTML = ''
    container.append(this.el)
    if (this.icons) {
      container.append(this.icons)
    }
    this.mounted = true
    this.initEvents(supportsPassive)
    marquee(this.titleWrap, this.title)
  }

  destroy() {
    window.removeEventListener('resize', resize)
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl)
    }
  }
}
