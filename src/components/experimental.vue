<template>
  <span class="experimental has-text-danger is-size-7">{{ text }}</span>
</template>

<script>
export default {
  name: 'experimental',
  props: {
    text: {
      type: String,
      default: 'Experimental'
    }
  }
}
</script>

<style lang="scss" scoped>
.experimental {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 6px;
}
</style>
