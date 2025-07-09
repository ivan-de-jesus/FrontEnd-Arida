<template>
  <div
    id="map"
    class="w-100 rounded shadow"
    style="height: 350px; position: relative"
  ></div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";
import { searchLandsat } from "@/api/landsat";
import { sampleNdwi } from "@/utils/ndwi-client";

export default {
  name: "MapView",
  props: {
    coords: { type: Object, required: true }, // { latitude, longitude }
    params: { type: Object, required: true },
  },
  data() {
    return { map: null };
  },
  async mounted() {
    console.log("Entro aqui");
    const { latitude: lat, longitude: lng } = this.coords;
    /* 1 · Google Maps */
    try {
      const google = await new Loader({
        apiKey: process.env.VUE_APP_GOOGLE_KEY,
        version: "weekly",
      }).load();

      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 15,
        disableDefaultUI: true,
      });
      new google.maps.Marker({ position: { lat, lng }, map: this.map });
    } catch (err) {
      console.warn("Google Maps no se pudo cargar:", err);
    }

    /* 2-6 · NDWI */
    let meanNdwi = null;
    let status = "Sin datos";

    try {
      console.log("Entro aqui");
      const { radiusKm, daysBack, cloudMax } = this.params;

      const ls8 = await searchLandsat({
        lat,
        lng,
        radiusKm,
        daysBack,
        cloudMax,
      });
      console.log('Escena datetime:', ls8.meta.datetime)

      const blobNir = ls8.assets.nir08.split("?")[0];
      const blobSwir = ls8.assets.swir16.split("?")[0];

      const token = (
        await fetch(
          "https://planetarycomputer.microsoft.com/api/sas/v1/token/landsateuwest/landsat-c2"
        ).then((r) => r.json())
      ).token;

      const nirUrl = `${blobNir}?${token}`;
      const swirUrl = `${blobSwir}?${token}`;

      meanNdwi = await sampleNdwi(nirUrl, swirUrl, lat, lng);

      if (meanNdwi !== null) {
        if (meanNdwi < 0.1) status = "Seco";
        else if (meanNdwi < 0.25) status = "Medio";
        else status = "Húmedo";
      }
    } catch (e) {
      console.error("Error NDWI:", e);
    }

    this.$emit("ndwi-status", { ndwi: meanNdwi, status });
  },
};
</script>

<style scoped>
#map {
  position: relative;
}
</style>
