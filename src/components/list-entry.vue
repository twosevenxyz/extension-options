<template>
  <div class="list-entry box is-hoverable">
    <div class="is-inline-flex">
      {{ value }}
    </div>
    <a class="close-btn is-pulled-right" @click="$emit('remove')">
      <MdClose :title="'Remove ' + value" :size="22"/>
    </a>
  </div>
</template>

<script>
import MdClose from 'vue-material-design-icons/Close.vue'

export default {
  name: 'list-entry',
  components: {
    MdClose
  },
  props: ['value']
}
</script>

<style lang="scss">
@import '~@/style/bulma-imports.scss';

.list-entry {
  display: inline-flex;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  font-size: 0.9em;
  border: thin solid lighten(lightgray, 10);
  div {
    vertical-align: middle;
  }
  .close-btn {
    cursor: pointer;
    margin: 4px 0;
    // margin-left: -30px;
    z-index: 2;
    vertical-align: middle;
    &:hover {
      color: darken(red, 10);
    }
  }
}

.list-entry:hover {
  box-shadow: 0 0 11px rgba(33,33,33,.2);
}
</style>
