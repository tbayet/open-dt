<template>
  <v-row class="page" align="center" justify="center">
    <v-col xs="12" sm="10" md="8">
      <v-stepper :value="currentStep" alt-labels>
        <v-stepper-header>
          <v-stepper-step
            step="1"
            :complete="currentStep > 1"
          >
            <span class="text-center">Sign up</span>
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            step="2"
            :complete="currentStep > 2"
          >
            <span class="text-center">Validate your Account</span>
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            step="3"
            :complete="currentStep > 3"
          >
            <span class="text-center">Introduce yourself</span>
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <SignUpForm />
          </v-stepper-content>

          <v-stepper-content step="2">
            <p>We need to verify your account.
            A mail with a confirmation code has been sent.</p>
            <v-text-field
              type="code"
              label="Code"
            ></v-text-field>
            <v-btn
              color="success"
            >
              Let's go
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <SignUpInformationsForm />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import SignUpForm from '../components/form/SignUpForm'
import SignUpInformationsForm from '../components/form/SignUpInformationsForm'

export default {
  name: 'Home',
  components: {
    SignUpForm,
    SignUpInformationsForm,
  },
  computed: {
    account() {
      return this.$store.state.account
    },
    currentStep() {
      if (this.account.role === 'USER') return 4
      if (this.account.role === 'STEP2') return 3
      if (this.account.role === 'STEP1') return 2
      return 1
    },
  },
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
