<template>
  <ApolloMutation
    :mutation="SignInMutation"
    :variables="{ email: fields.email, password: fields.password }"
    @done="signIn" @error="signOut"
  >
    <template v-slot="{ mutate, loading, error }">
      <v-form @submit.prevent ref="signInForm" v-model="isSignInFormValid">
        <v-text-field
          v-model="fields.email"
          type="email" label="Email"
          full-width required
          :rules="rules.createEmailRules"
        />
        <v-text-field
          v-model="fields.password"
          type="password" label="Password"
          class="mt-3" full-width required
          :loading="loading"
          :rules="rules.enterPasswordRules"
        />
        <v-alert
          v-if="Boolean(error)"
          type="error" outlined
          transition="scale-transition"
        >{{ error.gqlError.message }}</v-alert>

        <v-btn
          type="submit"
          class="mt-5" color="success" block
          :loading="loading"
          :disabled="!isSignInFormValid"
          @click="mutate"
        >
          Sign in
        </v-btn>
      </v-form>
    </template>
  </ApolloMutation>
</template>

<script>
import { SignInMutation } from '@/graphql/User.gql'
import rules from '../../utils/form/rules'

export default {
  name: 'SignInForm',

  data: () => ({
    SignInMutation,
    isSignInFormValid: false,
    fields: {
      email: '',
      password: '',
    },
    rules,
  }),

  methods: {
    signIn({ data: { signIn: token } }) {
      this.$store.dispatch('account/signIn', { token })
        .then(() => { this.$router.push('/') })
    },
    signOut() {
      this.$store.dispatch('account/signOut')
    },
  },
}
</script>
