<template>
  <div>
    <CheckboxSwitch v-model="isEnabled" label="Enable generic-fallback" :info="generalInfo"/>
    <ListBuilder v-if="isEnabled && websites"
        name="general-genericFallbackWebsites"
        placeholder="e.g. criterionchannel.com"
        label="Enable generic-fallback on specific websites"
        submit-text="Add Website"
        :info="addWebsiteInfo"
        :list="websites"
        :check="checkValidIframeWebsite"
        @submit="onSubmit"/>
  </div>
</template>

<script>
import CheckMixin from '@/js/check-mixin'
import CheckboxSwitch from '@/components/checkbox-switch'
import ListBuilder from '@/components/list-builder'

export default {
  name: 'generic-fallback',
  mixins: [CheckMixin],
  components: {
    CheckboxSwitch,
    ListBuilder
  },
  props: {
    settings: {
      type: Object,
      required: true
    },
    keys: {
      type: Object,
      required: true
    }
  },
  computed: {
    generalInfo () {
      return `This is an experimental, alternate mechanism for watching videos from arbitrary websites. Enable this if the extension fails to detect videos on a website, or the detected videos refuse to play when
      you try to watch them on TwoSeven.`
    },
    addWebsiteInfo () {
      return `Since this is still an experimental feature, if you wish to use generic-fallback on a particular website, add the website to the list.
      You will need to refresh your tabs for the changes to take effect.`
    },
    isEnabled: {
      get () {
        const { settings, keys } = this
        return settings[keys.general.enableGenericFallback]
      },
      set (v) {
        const { settings, keys } = this
        settings[keys.general.enableGenericFallback] = v
      }
    },
    websites () {
      const { settings, keys } = this
      return settings[keys.general.genericFallbackWebsites]
    }
  },
  methods: {
    onSubmit (...args) {
      this.$emit('add-generic-fallback-website', ...args)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
