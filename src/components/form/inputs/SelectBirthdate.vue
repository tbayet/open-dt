<template>
  <v-menu
    v-model="birthdateMenu"
    top
    ref="birthdateMenu"
    transition="scale-transition"
    min-width="290px"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="birthdate"
        v-on="on"
        label="Birthday date"
        append-icon="mdi-calendar"
        readonly outlined required
      />
    </template>
    <v-date-picker
      v-model="birthdate"
      ref="birthdatePicker"
      min="1950-01-01"
      :max="new Date().toISOString().substr(0, 10)"
      @change="saveBirthdate"
    />
  </v-menu>
</template>

<script>
import rules from '../../../utils/form/rules'

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rules,
      birthdateMenu: false,
    }
  },
  methods: {
    saveBirthdate(date) {
      this.$refs.birthdateMenu.save(date)
    },
  },
  computed: {
    birthdate: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
  },
  watch: {
    birthdateMenu(val) {
      if (val) {
        setTimeout(() => { this.$refs.birthdatePicker.activePicker = 'YEAR' })
      }
    },
  },
}
</script>

<style>

</style>
