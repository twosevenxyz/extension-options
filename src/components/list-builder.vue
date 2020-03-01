<template>
  <div style="margin-bottom: 1em;">
    <div :id="`${name}-wrapper`" class="field is-horizontal option is-marginless" style="padding: 8px 0;">
      <div :id="name" class="field-label label" style="margin-top: auto; margin-bottom: auto;" v-html="label"></div>
      <div class="field-body">
        <div class="field has-addons">
          <div class="control">
            <input v-model="input" class="input is-small" :class="[inputClasses, isValidInput ? 'is-primary' : 'is-danger']" ref="input" type="text" :placeholder="placeholder" style="width: fit-content;" @keyup.enter.stop.cancel="$event => checkAndSubmit(input)" v-on="listeners">
          </div>
          <div class="control">
            <a class="button is-primary is-small" @click="checkAndSubmit(input)" :disabled="!canSubmit"> {{submitText}} </a>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-marginless option-info">
      <div class="column" style="padding: 0 0 8px 0;">
        <VueMarkdown class="info" :source="info"/>
      </div>
    </div>
    <div class="columns website-list scroll">
      <div class="column is-one-third">
        <div class="list is-hoverable">
          <div class="list-item" v-for="(entry, $index) in list" :key="$index">
            <ListEntry :value="entry" @remove="list.splice($index, 1)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import ListEntry from './list-entry'

export default {
  name: 'list-builder',
  components: {
    ListEntry,
    VueMarkdown
  },
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    inputClasses: {
      type: [String, Object, Array],
      default: ''
    },
    placeholder: {
      type: String
    },
    submitDisabled: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      required: true
    },
    info: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
    check: {
      type: Function,
      required: true
    }
  },
  computed: {
    isValidInput () {
      try {
        return this.check(this.input)
      } catch (e) {
        return true
      }
    },
    canSubmit () {
      return this.input.length > 0 && this.isValidInput
    },
    listeners () {
      const { $listeners: { submit, ...listeners } } = this
      return listeners
    }
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    checkAndSubmit (value) {
      this.canSubmit && this.$emit('submit', value)
    }
  }
}
</script>

<style lang="scss">
.website-list {
  max-height: 15em;
  overflow-y: auto;
}
</style>
