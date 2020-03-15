<template>
  <v-select
    v-if="cities"
    v-model="city"
    return-object
    prepend-inner-icon="mdi-map-marker"
    item-text="name" outlined
    :items="cities"
  />
  <v-progress-circular v-else indeterminate />
</template>

<script>
import { CitiesQuery } from '@/graphql/City.gql'
import { graphqlToObject } from '../../../utils/graphql'

export default {
  apollo: {
    cities: {
      query: CitiesQuery,
      update: data => data.cities.map(city => graphqlToObject(city)),
    },
  },
  props: {
    value: {
      type: Object,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  methods: {
    cityIsValid(val) {
      return this.cities && this.cities.find(c => c === val)
    },
  },
  computed: {
    city: {
      get() {
        return this.value
      },
      set(newValue) {
        if (this.cityIsValid(newValue)) {
          this.$emit('input', newValue)
        }
      },
    },
  },
}
</script>
