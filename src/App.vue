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
        <div class="columns is-marginless">
          <div class="column is-full">
            <div class="tabs is-centered is-toggle">
              <ul class="is-paddingless">
                <li :class="{'is-active': currentTab === 'general'}" data-target="general" @click="currentTab = 'general'">
                  <a>General</a>
                </li>
                <li :class="{'is-active': currentTab === 'plex'}" data-target="plex" @click="currentTab = 'plex'">
                  <a>Plex</a>
                </li>
                <li :class="{'is-active': currentTab === 'generic-fallback'}" data-target="generic-fallback" @click="currentTab = 'generic-fallback'">
                  <a>Generic Fallback <Experimental/></a>
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
                  <div class="container">

                    <h3 id="loading-videos" class="title is-size-3">Loading Videos</h3>
                    <div class="content">
                      <div style="margin-bottom: 1em;">
                        <span class="info">These options come into play when you are loading a video into a room from another tab.</span>
                      </div>
                      <CheckboxSwitch v-model="settings[SETTINGS.general.allowCookies]" :label="allowCookiesLabel" :info="allowCookiesInfo"/>
                    </div>

                    <h3 id="extension-opts" class="title is-size-3">Detecting Videos</h3>
                    <div class="content">
                      <span class="info">These options come into play when another user loads a video into a room but the video does not load for you.</span>
                      <div class="field option">
                        <div class="control">
                          <span class="label"># Seconds to find media</span>
                          <input id="general-mediaSearchDurationSec" class="slider inline-slider" step="3" min="10" max="120" type="range" v-model.number="settings[SETTINGS.general.mediaSearchDurationSec]">
                          <output for="general-mediaSearchDurationSec">{{ settings[SETTINGS.general.mediaSearchDurationSec] }}</output>
                          <VueMarkdown class="info">The amount of time to spend searching for videos on third-party websites. If you're running into errors, try moving the slider up to increase the time
                            If increasing this timer does not help, you could also try [showing the frame](#general-showIframeOnWebsites-wrapper) on certain websites to take a look at what is going on.
                          </VueMarkdown>
                        </div>
                      </div>

                      <CheckboxSwitch v-model="settings[SETTINGS.general.hideSearchIframe]" :label="hideSearchIframeLabel" :info="hideSearchIframeInfo"/>

                      <ListBuilder v-if="settings[SETTINGS.general.showIframeOnWebsites]"
                          name="general-showIframeOnWebsites"
                          placeholder="e.g. crunchyroll.com"
                          label="Show frames on specific websites"
                          submit-text="Add Website"
                          :info="showIframeOnWebsitesInfo"
                          :list="settings[SETTINGS.general.showIframeOnWebsites]"
                          :check="checkValidIframeWebsite"
                          @submit="addShowIframeOnWebsite"/>

                    </div>
                  </div>

                  <div v-if="settings[SETTINGS.general.sameSiteDomains]" class="container">
                    <h3 id="sameSite" class="title is-size-3">SameSite Cookies</h3>
                    <div class="content">
                      <!-- <CheckboxSwitch :checked="allowCookieModifications"
                          @change="onAllowCookieModificationsChanged"
                          label="Allow modifying cookies"
                          info="Cookie modifications may be necessary if you find that you're unable to log in, or use certain websites when they're embedded on TwoSeven.
                          **Note**: The extension may request you to grant additional permissions to access your cookies if you haven't already done so."/> -->
                      <div>
                        <ListBuilder
                            name="general-sameSiteDomains"
                            placeholder="e.g. netflix.com"
                            :label="sameSiteLabel"
                            submit-text="Add Domain"
                            :info="sameSiteInfo"
                            :list="settings[SETTINGS.general.sameSiteDomains]"
                            :check="checkValidDomain"
                            @submit="addSameSiteDomain"/>

                        <CheckboxSwitch v-model="settings[SETTINGS.general.sameSiteOverride]"
                            label="Override cookies to SameSite=None"
                            info='Cookies stored by third-party websites with either no `SameSite` attribute, or `SameSite=Lax` are not accessible when the websites are embedded on TwoSeven.
                            This option overrides these cookies to `SameSite=None`, and sets the `Secure` flag, which allows the website to access these cookies even when embedded.
                            <span class="has-text-warning is-size-7">WARNING: Bypassing `SameSite` restrictions with this flag may enable other websites to access cookies of the websites added to this list.'/>
                      </div>
                    </div>
                  </div>

                </section>
              </div>

              <!-- Plex -->
              <div :class="{'is-active': currentTab === 'plex'}" data-content="plex">
                <section class="section">
                  <div class="container">
                    <CheckboxSwitch v-model="settings[SETTINGS.plex.forceWAN]" label="Force Plex to use only WAN address" :info="plexForceWANInfo"/>
                    <CheckboxSwitch v-model="settings[SETTINGS.plex.allowDirectPlay]" label="Allow MP4 files to directPlay" :info="plexAllowDirectPlayInfo"/>
                    <CheckboxSwitch v-model="settings[SETTINGS.plex.enableSessionPing]" :label="plexEnableSessionPingLabel" :info="plexEnableSessionPingInfo"/>
                  </div>
                </section>
              </div>

              <!-- Generic fallback -->
              <div :class="{'is-active': currentTab === 'generic-fallback'}" data-content="generic-fallback">
                <section class="section">
                  <div class="container">
                    <GenericFallback :settings="settings" :keys="SETTINGS" @add-generic-fallback-website="addGenericFallbackWebsite"/>
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
/* global twosevenExtLog */
import VueMarkdown from 'vue-markdown'
import is from 'is_js'

import BulmaMixin from '@/components/bulma-mixin'
import PolyfilledStorage from '@/js/polyfilled-storage'
import defaultSettings from '@/js/default-settings'
import ListBuilder from '@/components/list-builder'
import Checkbox from '@/components/checkbox'
import CheckboxSwitch from '@/components/checkbox-switch'
import Experimental from '@/components/experimental'
import GenericFallback from '@/components/generic-fallback'

import CheckMixin from '@/js/check-mixin'

const browser = window.chrome || window.browser

const { defaults, keys: SETTINGS } = defaultSettings

const tag = '[ext-options]'

export default {
  name: 'app',
  mixins: [BulmaMixin, CheckMixin],
  components: {
    VueMarkdown,
    ListBuilder,
    Checkbox, // eslint-disable-line
    CheckboxSwitch,
    Experimental,
    GenericFallback
  },
  watch: {
  },
  computed: {
    SETTINGS () {
      return SETTINGS
    },
    hideSearchIframeLabel () {
      return 'Hide the frame in which third-party videos are detected'
    },
    hideSearchIframeInfo () {
      return `If you uncheck this box, twoseven will show you a new window every time another participant in a room loads a video from a third-party website.
        Leaving this box checked will instead create a hidden frame and try to perform the video detection silently.
        You probably want to leave this box checked, and instead [show the frame](#general-showIframeOnWebsites-wrapper) on specific websites.`
    },
    showIframeOnWebsitesInfo () {
      return `Some websites require you to interact with them before they begin to load or play the video. Add such websites to this list so that you get a chance to manually engage with the website
      and do whatever is necessary to help the TwoSeven extension detect the video file.`
    },
    sameSiteLabel () {
      return 'Bypass "SameSite" restrictions <span class="experimental has-text-danger is-size-7">experimental</span>'
    },
    sameSiteInfo () {
      return `Some websites use a <a target="_blank" href="https://web.dev/samesite-cookies-explained/">new standard</a> for securing cookies. Websites that use the new standard may not work with TwoSeven.
      If you're unable to login on any website on TwoSeven, add it to this list to try and bypass the cookie restrictions.
      **Note**: When you add a website to the list, you may see a '.' appear before the website. This is expected.`
    },
    plexForceWANInfo () {
      return `Sometimes, Plex may connect to your Plex Media Server (PMS) using a LAN IP. If this occurs, everyone outside of your LAN will not be able
        to connect or watch the video together on TwoSeven.
        Check this box to ensure that all connections to your Plex Media Server happen using its WAN (internet) IP address.`
    },
    plexAllowDirectPlayInfo () {
      return `By default, TwoSeven forces Plex to transcode all files; even the ones that can be played directly (since they're in MP4 format).
      This is done to ensure that your Plex Token is not leaked to the other participants in the room.
      <span class="has-text-danger">Check this box if you fully trust everyone you're watching the video with and want high-quality rather than high-security. </span>
      Uncheck this box if you want to ensure full security of your token.`
    },
    plexEnableSessionPingLabel () {
      return 'Keep the Plex transcoder-session alive even after the Plex tab is closed <span class="experimental has-text-danger is-size-7">experimental</span>'
    },
    plexEnableSessionPingInfo () {
      return `The Plex website periodically pokes and prods (pings) your Plex Media Server to keep the current video transcoding session alive.
        If the session terminates, then the video will stop playing. The session normally closes within ~10 minutes of closing the Plex website. By checking this box, you're asking TwoSeven to try and keep the session alive.
        If you're having issues where the Plex video is buffering for long periods, disable this option and instead keep the Plex tab open while watching the video on twoseven.`
    },
    allowCookiesLabel () {
      return 'Share cookies with other participants when loading videos from the Web'
    },
    allowCookiesInfo () {
      return `Consider using this option if videos from some websites are not loading for other participants.
      <span class="has-text-danger">Only enable this if you trust everyone in your rooms.</span>`
    },
    is () {
      return is
    }
  },
  data () {
    return {
      currentTab: 'general',
      bgWindow: undefined,
      isValidIframeWebsite: true,
      isValidDomain: true,
      targets: new Set([
        '#general-showIframeOnWebsites-wrapper'
      ]),
      showIframeOnWebsiteInput: '',
      settings: {},
      cookiesPermission: false,
      allowCookieModifications: JSON.parse(window.localStorage.getItem('allowCookieModifications') || 'false')
    }
  },
  methods: {
    async onAllowCookieModificationsChanged (value) {
      window.localStorage.setItem('allowCookieModifications', value)
      if (!value) {
        if (is.chrome()) {
          // TODO: Firefox does not yet support listeners
          return this.removeCookiesPermission()
        }
        return
      }
      // Check if cookiesPermission is available. If not, request it
      const hasPermission = await this.hasCookiesPermission()
      if (!hasPermission) {
        this.requestCookiesPermission()
      }
    },
    async hasCookiesPermission (domain = '<all_urls>') {
      return new Promise(resolve => {
        browser.permissions.contains({
          permissions: ['cookies'],
          origins: [domain]
        }, resolve)
      })
    },
    async requestCookiesPermission (domain = '<all_urls>') {
      return new Promise(resolve => browser.permissions.request({
        permissions: ['cookies'],
        origins: [domain]
      }, resolve))
    },
    async removeCookiesPermission (domain = '<all_urls>') {
      return new Promise(resolve => browser.permissions.remove({
        permissions: ['cookies'],
        origins: [domain]
      }, resolve))
    },
    async getOpts (key, defaults) {
      let storedOpts = {}
      try {
        storedOpts = (await PolyfilledStorage.local.get([key]))[key]
      } catch (e) {
        storedOpts = defaults
        console.error(e) // eslint-disable-line no-console
      }
      const finalOpts = storedOpts
      // if (Array.isArray(defaults)) {
      //   const result = new Set()
      //   ;[...defaults, ...(storedOpts || [])].forEach(result.add, result)
      //   finalOpts = [...result]
      // } else if (typeof defaults === 'object') {
      //   finalOpts = deepmerge(defaults, storedOpts)
      // }
      return finalOpts
    },
    async commonUpdate (key, newVal, oldVal) {
      twosevenExtLog(tag, `Attempting to update setting key=${key} value=${newVal}`)
      await PolyfilledStorage.local.set({ [key]: newVal })
    },
    setupWatcher (watchKey, key) {
      this.$watch(watchKey, async (newVal, oldVal) => {
        twosevenExtLog(tag, `Triggering watch for watchKey=${watchKey} key=${key} new=${newVal} old=${oldVal}`)
        this.commonUpdate(key, newVal, oldVal)
      }, { deep: true })
    },
    addToList (value, list) {
      if (list.includes(value)) {
        return
      }
      list.push(value)
    },
    addShowIframeOnWebsite (website) {
      this.addToList(website, this.settings[SETTINGS.general.showIframeOnWebsites])
    },
    addSameSiteDomain (domain) {
      if (domain[0] !== '.') {
        domain = `.${domain}`
      }
      this.addToList(domain, this.settings[SETTINGS.general.sameSiteDomains])
    },
    addGenericFallbackWebsite (website) {
      this.addToList(website, this.settings[SETTINGS.general.genericFallbackWebsites])
    },
    onHashChange (e) {
      const { location: { hash } } = window
      const shouldHighlight = this.targets.has(hash)
      const el = document.querySelector(hash)
      if (shouldHighlight && el) {
        el.addEventListener('animationend', function once () {
          el.removeEventListener('animationend', once)
          el.classList.remove('target-animate')
          location.hash = ''
        })
        el.classList.add('target-animate')
      }
    }
  },
  async created () {
    window.PolyfilledStorage = PolyfilledStorage

    this.bgWindow = await browser.extension.getBackgroundPage()

    const allKeys = SETTINGS.getAllKeys()
    for (const key of allKeys) {
      const value = await this.getOpts(key, defaults[key])
      await this.$set(this.settings, key, value)
      twosevenExtLog(tag, `Set options settings[${key}]=${value}`)
    }

    for (const key of SETTINGS.getAllKeys()) {
      const watchKey = `settings.${key}`
      this.setupWatcher(watchKey, key)
      twosevenExtLog(tag, `Set up watcher for key=${watchKey}`)
    }
  },
  async mounted () {
    window.settings = this.settings
    window.SETTINGS = SETTINGS

    window.addEventListener('hashchange', this.onHashChange)

    if (is.chrome()) {
      browser.permissions.onAdded.addListener(({ permissions }) => {
        if (permissions.includes('cookies')) {
          this.cookiesPermission = true
        }
      })
      browser.permissions.onRemoved.addListener(({ permissions }) => {
        if (permissions.includes('cookies')) {
          this.cookiesPermission = false
        }
      })
    }
    this.cookiesPermission = await this.hasCookiesPermission()
  },
  beforeDestroy () {
    window.removeEventListener('hashchange', this.onHashChange)
  }
}
</script>

<style lang="scss">
@import '~@/style/bulma-imports.scss';
@import url('https://fonts.googleapis.com/css?family=Roboto');

.scroll {
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 50%;
    margin: 0;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
  }
  &::-webkit-scrollbar-track-piece {
    background: darken(#fff, 10);
    border-radius: 10px;
  }
}

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
    transition: opacity 0.3s linear;
  }
  > div.is-active {
    display: block;
    visibility: visible;
    opacity: 1;
  }
}

.content:not(last-child) {
  margin-bottom: 0.5em;
}

.info {
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 14px;
  color: #6a6a6a;
  p {
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
    flex-grow: 1.7;
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
  .checkbox .label {
    margin-left: 4px;
  }
}

.is-active .experimental {
  color: white !important;
}

.has-text-warning {
  color: #a26a14 !important;
}
.website-list {
  .list-item:not(:last-child) {
    margin-bottom: 12px;
  }
  .list-item:last-child {
    padding-bottom: 12px;
  }
}

@keyframes focus {
  0% { border: 4px solid transparent; border-radius: 6px; padding: 4px 0; }
  10% { border: 4px solid lighten(blue, 30); border-radius: 6px; padding: 4px 0; }
  100% { border: 4px solid transparent; border-radius: 6px; padding: 4px 0; }
}

.target-animate {
  animation: focus 3s normal forwards;
  animation-iteration-count: 1;
}
</style>
