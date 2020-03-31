
const keys = {
  general: {
    mediaSearchDurationSec: 'GENERAL_MEDIA_SEARCH_DURATION_SEC',
    hideSearchIframe: 'GENERAL_HIDE_SEARCH_IFRAME',
    showIframeOnWebsites: 'GENERAL_SHOW_IFRAME_ON_WEBSITES',
    loadTopFrameOnWebsites: 'GENERAL_LOAD_TOP_FRAME_ON_WEBSITES',
    sameSiteDomains: 'GENERAL_SAME_SITE_DOMAINS',
    sameSiteOverride: 'GENERAL_SAME_SITE_OVERRIDE'
  },
  plex: {
    forceWAN: 'PLEX_FORCE_WAN',
    allowDirectPlay: 'PLEX_ALLOW_DIRECT_PLAY',
    enableSessionPing: 'PLEX_ENABLE_SESSION_PING'
  },
  crunchyroll: {
    forceHardSub: 'CR_FORCE_HARD_SUB'
  },
  getAllKeys () {
    const result = []
    const keys = Object.keys(this).filter(x => typeof this[x] === 'object')
    for (const key of keys) {
      const values = Object.values(this[key])
      result.push(...values)
    }
    return result
  }
}

const { general, plex, crunchyroll } = keys

const defaults = {
  [general.mediaSearchDurationSec]: 15,
  [general.hideSearchIframe]: true,
  [general.showIframeOnWebsites]: [],
  [general.loadTopFrameOnWebsites]: [
    'prettyfast.to',
    'rapidvideo.com'
  ],
  [general.sameSiteDomains]: [
    '.netflix.com',
    '.disneyplus.com',
    '.hulu.com',
    '.primevideo.com',
    '.amazon.com'
  ],
  [general.sameSiteOverride]: false,

  // Plex
  [plex.forceWAN]: true,
  [plex.allowDirectPlay]: false,
  [plex.enableSessionPing]: false,

  // Crunchyroll
  [crunchyroll.forceHardSub]: false
}

export default {
  defaults,
  keys
}
