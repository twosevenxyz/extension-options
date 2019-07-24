<script>
import BulmaVars from '@/style/bulma-vars.scss'

export default {
  computed: {
    isMobile () {
      const $tablet = this.__getBulmaSize('tablet')
      return this.__isWidthWithin(0, $tablet)
    },
    isTablet () {
      const $tablet = this.__getBulmaSize('tablet')
      return this.__isWidthWithin($tablet)
    },
    isDesktop () {
      const $desktop = this.__getBulmaSize('desktop')
      return this.__isWidthWithin($desktop)
    },
    isWidescreen () {
      const $widescreen = this.__getBulmaSize('widescreen')
      return this.__isWidthWithin($widescreen)
    },
    isFullhd () {
      const $fullhd = this.__getBulmaSize('fullhd')
      return this.__isWidthWithin($fullhd)
    },
    isTabletOnly () {
      const $tablet = this.__getBulmaSize('tablet')
      const $desktop = this.__getBulmaSize('desktop')
      return this.__isWidthWithin($tablet, $desktop)
    },
    isDesktopOnly () {
      const $desktop = this.__getBulmaSize('desktop')
      const $widescreen = this.__getBulmaSize('widescreen')
      return this.__isWidthWithin($desktop, $widescreen)
    },
    isWidescreenOnly () {
      const $widescreen = this.__getBulmaSize('widescreen')
      const $fullhd = this.__getBulmaSize('fullhd')
      return this.__isWidthWithin($widescreen, $fullhd)
    },
    isTouch () {
      const $desktop = this.__getBulmaSize('desktop')
      return this.__isWidthWithin(0, $desktop)
    },
    isUntilWidescreen () {
      const $widescreen = this.__getBulmaSize('widescreen')
      return this.__isWidthWithin(0, $widescreen)
    },
    isUntilFullhd () {
      const $fullhd = this.__getBulmaSize('fullhd')
      return this.__isWidthWithin(0, $fullhd)
    }
  },
  methods: {
    __getBulmaSize (name) {
      const v = BulmaVars[name]
      return Number(v)
    },
    __isWidthWithin (min, max) {
      const { width } = this
      if (!max) {
        return width >= min
      }
      return width >= min && width < max
    }
  }
}
</script>
