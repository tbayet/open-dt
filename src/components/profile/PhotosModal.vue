<template>
  <v-overlay
    opacity="1"
    :value="overlay"
  >
    <v-carousel
      cycle
      class="carousel"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item
        v-for="(photo, i) in photos"
        :key="i"
      >
        <v-img contain class="imagee" :src="photo.raw" />
      </v-carousel-item>
    </v-carousel>
    <v-btn @click="overlay = false" color="white" class="top-right" icon large>
      <v-icon large>mdi-close</v-icon>
    </v-btn>
  </v-overlay>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    photos: {
      type: Array,
      required: true,
    },
  },
  computed: {
    overlay: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.top-right {
  position: fixed;
  top: 2em;
  right: 2em;
}
.carousel {
  height: 100vh;
  width: 100vw;
}
.imagee {
  width: 100%;
  height: 100%;
}
</style>
