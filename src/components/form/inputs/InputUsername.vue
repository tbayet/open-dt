<template>
  <v-text-field
    v-model="username"
    type="text"
    label="Username"
    required
    :rules="rules.createUsernameRules"
  />
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
    }
  },
  computed: {
    username: {
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
