<template>
  <ApolloMutation
    :mutation="SignUpMutation"
    :variables="{
      birthdate: fields.birthdate,
      city: fields.city,
      username: fields.username,
      email: fields.email,
      password: fields.password,
      passwordConfirm: fields.passwordConfirm,
    }"
    @done="signIn" @error="signOut"
  >
    <template v-slot="{ mutate, loading, error }">
      <v-form @submit.prevent ref="signUpForm" v-model="isFormValid">
        <v-container>
          <v-expansion-panels :value="currentPanel" mandatory accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>Birthdate</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row justify="center">
                  <v-col cols="10" sm="6" md="6">
                    <SelectBirthdate v-model="fields.birthdate" />
                  </v-col>
                  <v-col cols="10">
                    <v-alert
                      v-if="fields.birthdate.length && !birthdateIsValid"
                      type="error"
                      outlined transition="scale-transition"
                    >
                      Sorry. Minimum legal age to register is 18yo.
                    </v-alert>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :disabled="!birthdateIsValid">
              <v-expansion-panel-header>City</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row justify="center">
                  <v-col cols="10" sm="8" md="6" lg="4">
                    <SelectCity v-model="fields.city" />
                  </v-col>
                  <v-col cols="10">
                    <v-alert type="info" transition="scale-transition">
                      For now, we are only available on thoses cities
                    </v-alert>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :disabled="!birthdateIsValid || !fields.city">
              <v-expansion-panel-header>Account</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row justify="center">
                  <v-col cols="12" sm="10" md="6">
                    <InputUsername v-model="fields.username" />
                  </v-col>
                  <v-col cols="12" sm="10" md="6">
                    <v-text-field
                      v-model="fields.email"
                      type="email" label="Email"
                      placeholder="email@domaine.com"
                      required
                      :rules="rules.createEmailRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="10" md="6">
                    <v-text-field
                      v-model="fields.password"
                      type="password" label="Your password"
                      required
                      :rules="rules.createPasswordRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="10" md="6">
                    <v-text-field
                      v-model="fields.passwordConfirm"
                      type="password" label="Confirm your password"
                      required
                      :rules="confirmPasswordRules"
                    />
                  </v-col>

                  <v-alert
                    v-if="Boolean(error)"
                    type="error" outlined
                    transition="scale-transition"
                  >
                    {{ (error.gqlError && error.gqlError.message) || error }}
                  </v-alert>

                  <v-btn
                    color="success" block
                    :loading="loading"
                    :disabled="!isFormValid"
                    @click="mutate"
                  >Sign up</v-btn>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-form>
    </template>
  </ApolloMutation>
</template>

<script>
import moment from 'moment'
import { SignUpMutation } from '@/graphql/User.gql'
import rules from '../../utils/form/rules'
import SelectBirthdate from './inputs/SelectBirthdate'
import SelectCity from './inputs/SelectCity'
import InputUsername from './inputs/InputUsername'

export default {
  name: 'SignUpForm',
  components: {
    SelectBirthdate,
    SelectCity,
    InputUsername,
  },
  data: () => ({
    SignUpMutation,
    isFormValid: false,
    fields: {
      birthdate: '',
      city: null,
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },
    rules,
    currentPanel: 0,
  }),

  computed: {
    isCityFilled() {
      return !!this.fields.city
    },
    confirmPasswordRules() {
      return rules.confirmInputWrapper('password', this.fields.password)
    },
    birthdateIsValid() {
      return this.fields.birthdate
        && moment().diff(moment(this.fields.birthdate), 'years') >= 18
    },
  },

  methods: {
    signIn({ data: { signUp: token } }) {
      this.$store.dispatch('account/signIn', { token })
        .then(() => { this.$router.push('/') })
    },
    signOut() {
      this.$store.dispatch('account/signOut')
    },
  },

  watch: {
    birthdateIsValid(val) {
      if (val) {
        this.currentPanel = 1
      }
    },
    isCityFilled(val) {
      if (val && this.birthdateIsValid) {
        this.currentPanel = 2
      }
    },
  },
}
</script>
