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
                          <input id="general-mediaSearchDurationSec" class="slider inline-slider" step="1" min="30" max="300" type="range" v-model="general.mediaSearchDurationSec">
                          <output for="general-mediaSearchDurationSec">{{ general.mediaSearchDurationSec }}</output>
                          <VueMarkdown class="info">The amount of time to spend searching for videos on third-party websites. If you're running into errors, Try moving the slider up to increase the time
                            that the extension will spend trying to wait for the website to load the video. If increasing this timer does not help, you could also try [showing the frame](#general-showIframeOnWebsites) on certain websites to take a look at what is going on.
                          </VueMarkdown>
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

                      <div class="field is-horizontal option is-marginless">
                        <div id="general-showIframeOnWebsites" class="field-label">Show frames on specific websites</div>
                        <div class="field-body">
                          <div class="field has-addons">
                            <div class="control">
                              <input class="input is-small" :class="[isValidIframeWebsite ? 'is-primary' : 'is-danger']" ref="showIframeOnWebsiteInput" ype="text" placeholder="e.g. crunchyroll.com" style="width: fit-content;" @keyup.enter.stop.cancel="addShowIframeOnWebsite($event.target.value)" @keyup="checkValidIframeWebsite">
                            </div>
                            <div class="control">
                              <a class="button is-primary is-small" @click="addShowIframeOnWebsite($refs.showIframeOnWebsiteInput.value)" :disabled="!isValidIframeWebsite"> Add Website </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="columns is-marginless option-info">
                        <div class="column" style="padding: 0 0 8px 0;">
                          <p class="info">
                            Some websites require you to interact with them before they begin to load or play the video. Add such websites to this list so that you get a chance to manually engage with the website
                            and do whatever is necessary to help the TwoSeven extension detect the video file.
                          </p>
                        </div>
                      </div>
                      <div class="columns website-list">
                        <div class="column is-one-third">
                          <div class="list is-hoverable">
                            <div class="list-item" v-for="(entry, $index) in general.showIframeOnWebsites" :key="$index">
                              <ListEntry :value="entry" @remove="general.showIframeOnWebsites.splice($index, 1)"/>
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
                          <p class="info">Check this box if you want to stop showing YouTube captions when watching YouTube videos on twoseven.xyz</p>
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
                          This is done to ensure that your Plex Token is not leaked to the other participants in the room. <br>
                          <span class="has-text-danger">Check this box if you fully trust everyone you're watching the video with and want high-quality rather than high-security. </span> <br>
                          Uncheck this box if you want to ensure full security of your token.
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
import URI from 'urijs'
import { throttle } from 'lodash'

import BulmaMixin from '@/components/bulma-mixin'
import PolyfilledStorage from '@/js/polyfilled-storage'
import defaultSettings from '@/js/default-settings'
import ListEntry from '@/components/list-entry'

const browser = window.chrome || window.browser

const { defaultGeneralOpts, defaultYouTubeOpts, defaultPlexOpts } = defaultSettings

export default {
  name: 'app',
  mixins: [BulmaMixin],
  components: {
    VueMarkdown,
    ListEntry
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
      plex: undefined,
      isValidIframeWebsite: true
    }
  },
  methods: {
    commonUpdate: throttle(async function (key, value) {
      await PolyfilledStorage.local.set({ [key]: value })
      const evt = new CustomEvent('update-vars', { detail: { data: { key } } })
      this.bgWindow.dispatchEvent(evt)
    }, 300),
    async getOpts (key, defaults) {
      let storedOpts = '{}'
      try {
        const obj = (await PolyfilledStorage.local.get(key))
        storedOpts = obj[key] || '{}'
      } catch (e) {
        console.error(e)
      }
      storedOpts = JSON.parse(storedOpts)
      const finalOpts = deepmerge(defaults, storedOpts)
      return finalOpts
    },
    addShowIframeOnWebsite (website) {
      this.general.showIframeOnWebsites.push(website)
    },
    checkValidIframeWebsite ({ target }) {
      const { value } = target
      if (value === '') {
        this.isValidIframeWebsite = true
        return
      }
      try {
        let url = value
        if (!url.startsWith('http')) {
          url = `http://${url}`
        }
        if (!url.includes('.')) {
          this.isValidIframeWebsite = false
          return
        }
        const uri = new URI(url)
        if (!uri.tld()) {
          this.isValidIframeWebsite = false
          return
        }
        const host = uri.host()
        const tld = uri.tld()
        url = uri.toString()
        const path = url.substring(uri.origin().length)
        this.isValidIframeWebsite = (host && tld && ['', '/'].includes(path))
      } catch (e) {
        this.isValidIframeWebsite = false
      }
    }
  },
  async created () {
    window.PolyfilledStorage = PolyfilledStorage

    this.bgWindow = await browser.extension.getBackgroundPage()

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

  input {
    font-family: 'Roboto', sans-serif !important;
  }
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
  font-size: 14px;
  color: #6a6a6a;
  > /deep/ p {
    font-size: 14px;
    margin: 0;
  }
}

.option:not(:last-of-type) {
  margin-bottom: 1.5em;
}

.field {
  .field-label {
    text-align: left;
    flex-grow: 1.5;
    margin-right: 1em;
  }
  input[type='range'].inline-slider {
    width: 180px;
    margin-bottom: 8px;
    vertical-align: bottom;
  }
  span.label {
    display: inline-flex;
   & + input {
     margin-left: 12px;
    }
  }
  input[type='range'] + output {
    margin-left: 12px;
  }
  input.is-small {
    @if variable-exists(VUE_APP_MODE) == false {
      font-size: unset;
    }
  }
}

.website-list {
  .list-item:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>
