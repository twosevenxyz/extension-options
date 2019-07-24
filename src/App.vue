<template>
  <div id="app">
    <div class="container is-fluid is-marginless">
      <nav class="navbar">
        <div class="container is-fluid">
          <div class="navbar-brand">
            <div class="navbar-item brand-logo">
              twoseven
            </div>
          </div>
        </div>
      </nav>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-full">
            <div class="tabs is-centered is-toggle">
              <ul class="is-paddingless">
                <li :class="{'is-active': currentTab === 'general'}" data-target="general" @click="currentTab = 'general'">
                  <a>General</a>
                </li>
                <li :class="{'is-active': currentTab === 'plex'}" data-target="plex" @click="currentTab = 'plex'">
                  <a>Plex</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-full">
            <div id="tab-content" class="section">

              <!-- General -->
              <div :class="{'is-active': currentTab === 'general'}" data-content="general">
                <section class="section">
                  <div v-if="general" class="container">
                    <h3 id="extension-opts" class="title is-3">Detecting Videos</h3>
                    <div class="content">
                      <div class="field option">
                        <div class="control">
                          <span class="label">Time to spend trying to find media</span>
                          <input id="general-mediaSearchDurationSec" class="slider" step="1" min="30" max="300" type="range" v-model="general.mediaSearchDurationSec">
                          <output for="general-mediaSearchDurationSec">{{ general.mediaSearchDurationSec }}</output>
                          <p class="info">
                            The amount of time to spend searching for videos on third-party websites. If you're running into errors, Try moving the slider up to increase the time
                            that the extension will spend trying to wait for the website to load the video.
                          </p>
                          <VueMarkdown class="info">If increasing this timer does not help, you could also try [showing the frame](#general-showIframeOnWebsites) on certain websites to take a look at what is going on.</VueMarkdown>
                        </div>
                      </div>

                      <div class="field option">
                        <label class="checkbox">
                          <input type="checkbox" v-model="general.hideSearchIframe">
                          Hide the frame in which third-party videos are detected
                        </label>
                        <VueMarkdown class="info">If you uncheck this box, twoseven will show you a new window every time another participant in a room loads a video from a third-party website.
                          Leaving this box checked will instead create a hidden frame and try to perform the video detection silently.
                          You probably want to leave this box checked, and instead [show the frame](#general-showIframeOnWebsites) on specific websites.</VueMarkdown>
                      </div>

                      <div class="field is-horizontal option">
                        <div id="general-showIframeOnWebsites" class="field-label">Show frames on specific websites</div>
                        <div class="field-body">
                          <div class="field has-addons">
                            <div class="control">
                              <input class="input is-primary is-small" type="text" placeholder="e.g. crunchyroll.com">
                            </div>
                            <div class="control">
                              <a class="button is-primary is-small">
                                Add Website
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div v-if="youtube" class="container">
                    <h3 id="youtube" class="title is-3">YouTube</h3>
                    <div class="content">
                      <div class="field option">
                        <label class="checkbox">
                          <input type="checkbox" v-model="youtube.disableCaptions">
                          Try to disable captions
                          <p class="info">Check this box if you want TwoSeven to try and stop showing captions on twoseven.xyz </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Plex -->
              <div v-if="plex" :class="{'is-active': currentTab === 'plex'}" data-content="plex">
                <section class="section">
                  <div class="container">
                    <div class="field option">
                      <label class="checkbox">
                        <input type="checkbox" v-model="plex.forceWAN">
                        Force Plex to use only WAN address
                        <p class="info">Sometimes, Plex may connect to your Plex Media Server (PMS) using a LAN IP. If this occurs, everyone outside of your LAN will not be able
                          to connect or watch the video together on TwoSeven. <br>
                          Check this box to ensure that all connections to your Plex Media Server happen using its WAN (internet) IP address.
                        </p>
                      </label>
                    </div>
                    <div class="field option">
                      <label class="checkbox">
                        <input type="checkbox" v-model="plex.allowDirectPlay">
                        Allow MP4 files to directPlay
                        <p class="info">
                          By default, TwoSeven forces Plex to transcode all files; even the ones that can be played directly (since they're in MP4 format).
                          This is done to ensure that your Plex Token is not leaked to the other participants in the room.
                          <span v-if="plex.allowDirectPlay">Uncheck this box if you want to ensure full security of your token</span>
                          <span v-else>Check this box if you fully trust everyone you're watching the video with and want high-quality rather than high-security</span>
                        </p>
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import deepmerge from 'deepmerge'

import BulmaMixin from '@/components/bulma-mixin'
import Storage from '@/js/polyfilled-storage'

const browser = window.chrome || window.browser

const defaultGeneralOpts = {
  mediaSearchDurationSec: 30,
  hideSearchIframe: true,
  showIframeOnWebsites: []
}

const defaultPlexOpts = {
  forceWAN: true,
  allowDirectPlay: false
}

const defaultYouTubeOpts = {
  disableCaptions: false
}

export default {
  name: 'app',
  mixins: [BulmaMixin],
  components: {
    VueMarkdown
  },
  watch: {
    youtube: {
      handler: function (newVal) {
        this.commonUpdate('youtube', JSON.stringify(newVal))
      },
      deep: true
    },
    plex: {
      handler: function (newVal) {
        this.commonUpdate('plex', JSON.stringify(newVal))
      },
      deep: true
    },
    general: {
      handler: function (newVal) {
        this.commonUpdate('general', JSON.stringify(newVal))
      },
      deep: true
    }
  },
  data () {
    return {
      currentTab: 'general',
      bgWindow: undefined,
      general: undefined,
      youtube: undefined,
      plex: undefined
    }
  },
  methods: {
    async commonUpdate (key, value) {
      await Storage.sync.set({ [key]: value })
      const evt = new CustomEvent('update-vars', { detail: { data: { key } } })
      this.bgWindow.dispatchEvent(evt)
    },
    async getOpts (key, defaults) {
      let storedOpts = '{}'
      try {
        storedOpts = (await Storage.sync.get(key))[key] || '{}'
      } catch (e) {
        console.error(e)
      }
      storedOpts = JSON.parse(storedOpts)
      const finalOpts = deepmerge(defaults, storedOpts)
      return finalOpts
    }
  },
  async created () {
    window.PolyfilledStorage = Storage

    this.bgWindow = browser.extension.getBackgroundPage()

    const generalOpts = await this.getOpts('general', defaultGeneralOpts)
    this.$set(this, 'general', generalOpts)

    const ytOpts = await this.getOpts('youtube', defaultYouTubeOpts)
    this.$set(this, 'youtube', ytOpts)

    const plexOpts = await this.getOpts('plex', defaultPlexOpts)
    this.$set(this, 'plex', plexOpts)
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/bulma-imports.scss';
@import url('https://fonts.googleapis.com/css?family=Roboto');

#app {
  font-family: 'Roboto', sans-serif;
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.navbar {
  background-color: #009688;
  .brand-logo {
    color: #fff;
    font-size: 2.1em;
  }
}

.tabs.is-toggle {
  li.is-active a {
    background-color: #009688 !important;
    color: #fff !important;
  }
}
#tab-content {
  > div {
    display: none;
    visibility: hidden;
    opacity: 0;
    transition: visibility 3s, opacity 1s linear;
  }
  > div.is-active {
    display: block;
    visibility: visible;
    opacity: 1;
  }
}

.info {
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 0.9em;
  color: #6a6a6a;
  > /deep/ p {
    margin: 0;
  }
}

.option:not(:last-of-type) {
  margin-bottom: 1.5em;
}

.field {
  .field-label {
    flex-grow: 1.5;
  }
  input[type='range'] {
    width: 180px;
  }
  span.label + input {
    margin-left: 12px;
  }
  input[type='range'] + output {
    margin-left: 12px;
  }

}
</style>
