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
                    <v-menu
                      v-model="birthdateMenu"
                      top
                      ref="birthdateMenu"
                      transition="scale-transition"
                      min-width="290px"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="fields.birthdate"
                          v-on="on"
                          label="Birthday date"
                          append-icon="mdi-calendar"
                          readonly outlined required
                        />
                      </template>
                      <v-date-picker
                        v-model="fields.birthdate"
                        ref="birthdatePicker"
                        min="1950-01-01"
                        :max="new Date().toISOString().substr(0, 10)"
                        @change="saveBirthdate"
                      />
                    </v-menu>
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
                    <v-select
                      v-if="cities"
                      v-model="fields.city"
                      return-object
                      prepend-inner-icon="mdi-map-marker"
                      item-text="name" outlined
                      :items="cities"
                    />
                    <v-progress-circular v-else indeterminate />
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
                    <v-text-field
                      v-model="fields.username"
                      type="text"
                      label="Username"
                      required
                      :rules="rules.createUsernameRules"
                    />
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
import { CitiesQuery } from '@/graphql/City.gql'
import rules from '../../utils/form/rules'

export default {
  name: 'SignUpForm',
  apollo: {
    cities: {
      query: CitiesQuery,
      update: data => data.cities.map(city => Object.keys(city)
        .reduce((acc, k) => ({
          ...acc,
          ...(k.startsWith('__') ? null : { [k]: city[k] }),
        }), {})),
    },
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
    birthdateMenu: false,
    currentPanel: 0,
  }),

  computed: {
    cityIsValid() {
      return this.cities && this.cities.find(c => c === this.fields.city)
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
    saveBirthdate(date) {
      this.$refs.birthdateMenu.save(date)
    },
  },

  watch: {
    birthdateMenu(val) {
      if (val) {
        setTimeout(() => { this.$refs.birthdatePicker.activePicker = 'YEAR' })
      }
    },
    birthdateIsValid(val) {
      if (val) {
        this.currentPanel = 1
      }
    },
    cityIsValid(val) {
      if (val && this.birthdateIsValid) {
        this.currentPanel = 2
      }
    },
  },
}
</script>
