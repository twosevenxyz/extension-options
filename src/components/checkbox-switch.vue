<template>
  <div class="field">
    <input :id="uuid" type="checkbox" :disabled="disabled" class="switch is-rounded is-outlined is-primary" :checked="checked" @input="$event => $emit('change', $event.target.checked)">
    <label :for="uuid" v-html="label"></label>
    <VueMarkdown class="info" v-if="info" :source="info"/>
    <slot name="extra"></slot>
  </div>
</template>

<script>
import uuidv4 from 'uuid/v4'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'checkbox-switch',
  model: {
    prop: 'checked',
    event: 'change'
  },
  components: {
    VueMarkdown
  },
  props: {
    uuid: {
      type: String,
      default () {
        return uuidv4()
      }
    },
    checked: Boolean,
    value: {
      type: String
    },
    label: {
      type: String,
      required: true
    },
    info: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.field {
  margin: 8px 0;
}
.switch + label {
  &:before, &:after {
    outline: none !important;
  }
}
</style>
