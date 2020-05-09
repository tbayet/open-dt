<template>
  <v-autocomplete
    v-model="selection"
    :items="tags"
    :loading="loading"
    flat solo
    hide-selected
    dense multiple
    placeholder="Your tags..."
    item-text="label"
  >
    <template v-slot:selection="{ item, parent }">
      <v-chip
        class="mx-2"
        label outlined
        :close="isEditable" close-icon="mdi-close"
        @click:close="$emit('remove', item) && parent.selectItem(item)"
        :style="{ borderColor: item.color, color: item.color }"
      >
        <v-icon small left>{{ item.icon }}</v-icon>
        {{ item.label }}
      </v-chip>
    </template>
    <template slot="append">
      <v-chip
        small label link
        class="mx-2"
        color="primary"
      >
      <v-icon small>mdi-plus</v-icon>
        ADD
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
import { TagsQuery } from '@/graphql/Tag.gql'
import { graphqlToObject } from '../../utils/graphql'

export default {
  props: {
    isEditable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    loading() {
      return this.$store.state.profile.loading.sectionTags
    },
    selection: {
      get() {
        return this.$store.state.profile.user.tags
      },
      set(tagLabels) {
        this.$store.dispatch('profile/updateSection', {
          section: 'sectionTags',
          values: { tags: tagLabels },
        })
      },
    },
  },
  apollo: {
    tags: {
      query: TagsQuery,
      update: data => data.tags.map(tag => graphqlToObject(tag)),
    },
  },
}
</script>
