<template>
  <v-row class="page" align="center" justify="center">
    <v-col xs="12" sm="8" md="6">
      <v-card class="pa-3">
        <v-card-title class="justify-center">Sign in</v-card-title>
        <v-card-text>
          <SignInForm />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SignInForm from '@/components/form/SignInForm'

export default {
  name: 'SignIn',
  components: {
    SignInForm,
  },
}
</script>
