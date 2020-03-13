 <template>
  <v-app-bar fixed dark dense elevate-on-scroll>
    <v-app-bar-nav-icon />

    <v-toolbar-title>
      <v-btn title="Home" to="/" text>
        <v-icon small left>mdi-home</v-icon>
        OpenDt
      </v-btn>
    </v-toolbar-title>
    <v-spacer />

    <v-btn v-if="account.isAuthenticated" title="Profile" to="/profile" icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-menu v-if="account.isAuthenticated" offset-x offset-y min-width="20rem">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img :src="account.avatar" :alt="account.username">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ account.username }}</v-list-item-title>
              <v-list-item-subtitle>{{ account.role }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item>
            <v-icon>mdi-account-cog</v-icon>
            <v-list-item-title>Account settings</v-list-item-title>
          </v-list-item>
          <v-list-item @click="signOut">
            <v-icon>mdi-power</v-icon>
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
  computed: {
    account() {
      return this.$store.state.account
    },
  },
  methods: {
    signOut() {
      this.$store.dispatch('account/signOut')
        .then(() => { this.$router.go() })
    },
  },
}
</script>
