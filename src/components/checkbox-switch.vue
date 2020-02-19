<template>
  <div class="field">
    <input :id="uuid" type="checkbox" :disabled="disabled" class="switch is-rounded is-outlined is-primary" :checked="checked" @input="$event => $emit('change', $event.target.checked)">
    <label :for="uuid">{{ label }}</label>
    <p class="info" v-if="extraInfo">
      {{ extraInfo }}
    </p>
    <slot name="extra"></slot>
  </div>
</template>

<script>
import uuidv4 from 'uuid/v4'

export default {
  name: 'checkbox-switch',
  model: {
    prop: 'checked',
    event: 'change'
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
    extraInfo: {
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
.switch + label {
  &:before, &:after {
    outline: none !important;
  }
}
</style>
