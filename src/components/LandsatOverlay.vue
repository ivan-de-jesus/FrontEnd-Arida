<template>
  <div v-if="err" class="alert alert-danger mt-2">{{ err }}</div>
</template>

<script>
import { searchLandsat } from '@/api/landsat'

export default {
  props: { map: Object, coords: Object },
  async mounted () {
    try {
      const ls8 = await searchLandsat({
        lat: this.coords.latitude,
        lng: this.coords.longitude
      })
      const overlay = new google.maps.GroundOverlay(
        ls8.assets.quicklook,
        { north: ls8.bbox[3], south: ls8.bbox[1],
          east: ls8.bbox[2], west:  ls8.bbox[0] },
        { opacity: 0.6 }
      )
      overlay.setMap(this.map)
    } catch (e) { this.err = e.message }
  },
  data: () => ({ err: null })
}
</script>
