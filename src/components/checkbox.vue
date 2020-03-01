<template>
  <div class="field option">
    <label class="checkbox">
      <input type="checkbox" :checked="checked" @input="$event => $emit('change', $event.target.checked)">
      <span class="label" v-html="label"></span>
      <VueMarkdown class="info" :source="info"></VueMarkdown>
    </label>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'checkbox',
  model: {
    prop: 'checked',
    event: 'change'
  },
  components: {
    VueMarkdown
  },
  props: {
    checked: Boolean,
    label: {
      type: String,
      required: true
    },
    info: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
</style>
