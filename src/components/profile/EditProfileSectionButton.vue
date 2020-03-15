<template>
  <v-btn :color="dark ? 'white' : 'black'" v-if="isMyProfile" icon
    :class="{
      'profile__editSection': true,
      'profile__editSection--offsetX': offsetX,
      'profile__editSection--middle': middle,
    }"
    :small="small" title="Edit" alt="Edit"
  >
    <v-icon :small="small">mdi-pencil</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    offsetX: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    middle: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isMyProfile() {
      return this.$store.state.profile.user.id === this.$store.state.account.id
    },
  },
}
</script>

<style lang="scss" scoped>
.profile__editSection {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;

  &--offsetX {
    right: -2rem;
  }

  &--middle {
    top: auto;
    bottom: auto;
  }
}
</style>
