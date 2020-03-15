<template>
  <div>
    <ProfileHeader v-if="user" />
    <div class="profilePage__container">
      <div class="profilePage__widgets"><ProfileWidgets /></div>
      <div class="profilePage__description"><ProfileDescription /></div>
    </div>
  </div>
</template>

<script>
import { UserProfileQuery } from '../graphql/User.gql'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileDescription from '../components/profile/ProfileDescription'
import ProfileWidgets from '../components/profile/ProfileWidgets'

export default {
  components: {
    ProfileHeader,
    ProfileDescription,
    ProfileWidgets,
  },
  props: {
    id: {
      type: String,
      default: 'dphcqZAj',
    },
  },
  apollo: {
    user: {
      query: UserProfileQuery,
      variables() {
        return { id: this.id }
      },
      result({ data }) {
        this.$store.dispatch('profile/assign', data.user)
      },
    },
  },
  data() {
    return {

    }
  },
}
</script>

<style lang="scss" scoped>

.profilePage {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
  }
  &__widgets {
      flex: 1 1 30rem;
  }
  &__description {
      flex: 1 1 35rem;
  }
}
</style>
