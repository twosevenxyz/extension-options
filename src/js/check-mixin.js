import URI from 'urijs'

export default {
  methods: {
    checkValidIframeWebsite (value) {
      if (value === '') {
        return true
      }
      try {
        let url = value
        if (!url.startsWith('http')) {
          url = `http://${url}`
        }
        if (!url.includes('.')) {
          return false
        }
        const uri = new URI(url)
        if (!uri.tld()) {
          return false
        }
        const host = uri.host()
        const tld = uri.tld()
        url = uri.toString()
        const path = url.substring(uri.origin().length)
        return (host && tld && ['', '/'].includes(path))
      } catch (e) {
      }
      return false
    },
    checkValidDomain (value) {
      if (value === '') {
        return true
      }
      try {
        let url = value
        // Technically cookies use domains and not URLs. These start with .
        if (url.startsWith('.')) {
          url = url.slice(1)
        }

        // Add in a https so that URIjs can parse it
        if (!url.startsWith('http')) {
          url = `http://${url}`
        }

        const uri = new URI(url)
        if (!uri.tld()) {
          return false
        }
        const domain = uri.domain()
        return !!domain
      } catch (e) {
      }
      return false
    }
  }
}
