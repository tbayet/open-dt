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
  created() {
    this.profileID = this.id || this.$store.state.account.id
    this.$apollo.queries.user.start()
  },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  apollo: {
    user: {
      skip: true,
      query: UserProfileQuery,
      variables() {
        return { id: this.profileID }
      },
      result({ data }) {
        this.$store.dispatch('profile/assign', data.user)
      },
      error() {
        return this.$router.redirect('/')
      },
    },
  },
  data() {
    return {
      profileID: null,
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
