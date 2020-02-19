const defaultGeneralOpts = {
  mediaSearchDurationSec: 15,
  hideSearchIframe: true,
  showIframeOnWebsites: [
  ],
  loadTopFrameOnWebsites: [
    'prettyfast.to',
    'rapidvideo.com'
  ]
}

const defaultYouTubeOpts = {
  disableCaptions: false
}

const defaultPlexOpts = {
  forceWAN: true,
  allowDirectPlay: false,
  enableSessionPing: false
}

const defaultCrunchyrollOpts = {
  forceHardSub: false
}

export default {
  defaultGeneralOpts,
  defaultYouTubeOpts,
  defaultPlexOpts,
  defaultCrunchyrollOpts
}
