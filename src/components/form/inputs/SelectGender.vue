<template>
  <span>
    <v-select
      v-show="false"
      v-model="value"
      multiple readonly
      :rules="rules.selectGenderRules"
      required
    />
    <v-chip-group
      v-model="selected"
      column multiple
      class="mb-8"
      :mandatory="mandatory"
    >
      <v-chip v-for="gender in GENDERS_LIST" :key="gender" filter outlined>
        {{ gender }}
      </v-chip>
    </v-chip-group>
  </span>
</template>

<script>
import { GENDERS_LIST } from '../../../utils/enums'
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
      GENDERS_LIST,
    }
  },
  computed: {
    selected: {
      get() {
        return this.value.map(gender => this.GENDERS_LIST.indexOf(gender))
      },
      set(newValue = []) {
        this.$emit('input', newValue.map(index => this.GENDERS_LIST[index]))
      },
    },
  },
}
</script>
