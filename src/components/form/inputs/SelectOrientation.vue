<template>
  <span>
    <v-select
      v-show="false"
      v-model="value"
      multiple readonly
      :rules="rules.selectOrientationRules"
      required
    />
    <v-chip-group
      v-model="selected"
      column multiple
      class="mb-8"
      :mandatory="mandatory"
    >
      <v-chip v-for="orientation in ORIENTATIONS_LIST" :key="orientation" filter outlined>
        {{ orientation }}
      </v-chip>
    </v-chip-group>
  </span>
</template>

<script>
import { ORIENTATIONS_LIST } from '../../../utils/enums'
import rules from '../../../utils/form/rules'

export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
    mandatory: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules,
      ORIENTATIONS_LIST,
    }
  },
  computed: {
    selected: {
      get() {
        return this.value.map(orientation => this.ORIENTATIONS_LIST.indexOf(orientation))
      },
      set(newValue = []) {
        this.$emit('input', newValue.map(index => this.ORIENTATIONS_LIST[index]))
      },
    },
  },
}
</script>
