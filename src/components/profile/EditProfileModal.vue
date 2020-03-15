<template>
  <v-dialog v-model="isOpen" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
        <v-spacer />
        <v-btn icon large @click="$emit('cancel')">
          <v-icon large>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="$emit('cancel')">Cancel</v-btn>
        <v-btn color="success" min-width="140" @click="$emit('save')">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    isOpen: {
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
