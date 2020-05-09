<template>
 <ApolloMutation
    :mutation="SignUpFillProfileMutation"
    :variables="{
      picture: fields.picture,
      gender: fields.gender,
      orientation: fields.orientation,
      interestedBy: fields.interestedBy,
    }"
    @done="signIn"
  >
    <template v-slot="{ mutate, loading }">
      <v-form @submit.prevent v-model="isFormValid">
        <v-expansion-panels multiple :value="currentPanels" mandatory accordion>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-icon
                style="flex: 0 1 auto"
                class="mr-2"
                small color="success"
                v-show="isPictureValid"
              >
                mdi-check
              </v-icon>
              Your Picture
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <PictureUpload v-model="fields.picture" />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel :disabled="!isPictureValid">
            <v-expansion-panel-header>
              <v-icon
                style="flex: 0 1 auto"
                class="mr-2"
                small color="success"
                v-show="isGenderOrientationValid"
              >
                mdi-check
              </v-icon>
              More about you
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class="title mb-2 text-left">Gender(s)</p>
              <SelectGender v-model="fields.gender" />

              <p class="title mb-2 text-left">Orientation(s)</p>
              <SelectOrientation v-model="fields.orientation" />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel :disabled="!isGenderOrientationValid">
            <v-expansion-panel-header>
              <v-icon
                style="flex: 0 1 auto"
                class="mr-2"
                small color="success"
                v-show="isFormValid"
              >
                mdi-check
              </v-icon>
              Looking for
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class="title mb-2 text-left">Gender(s)</p>
              <SelectGender v-model="fields.interestedBy.gender" />

              <p class="title mb-2 text-left">Age</p>
              <v-row>
                <v-col cols="12" sm="10" md="8">
                  <v-range-slider
                    v-model="fields.interestedBy.age"
                    min="18" max="99"
                    hide-details
                    required
                    class="align-center"
                    :rules="rules.selectAgeRangeRules"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="fields.interestedBy.age[0]"
                        type="number"
                        class="mt-0 pt-0"
                        hide-details solo
                        style="width: 60px"
                        @change="$set(fields.interestedBy.age, 0, $event)"
                      />
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        type="number"
                        class="mt-0 pt-0"
                        hide-details solo
                        style="width: 60px"
                        :value="fields.interestedBy.age[1]"
                        @change="$set(fields.interestedBy.age, 1, $event)"
                      />
                    </template>
                  </v-range-slider>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-btn
          type="submit"
          block color="success"
          class="mt-4"
          :loading="loading"
          :disabled="!isFormValid || loading"
          @click="mutate"
        >
          Let's go
        </v-btn>
      </v-form>
    </template>
  </ApolloMutation>
</template>

<script>
import { GENDERS_LIST, ORIENTATIONS_LIST } from '../../utils/enums'
import SelectGender from './inputs/SelectGender'
import SelectOrientation from './inputs/SelectOrientation'
import { SignUpFillProfileMutation } from '../../graphql/User.gql'
import PictureUpload from './SignUp/PictureUpload'
import rules from '../../utils/form/rules'

export default {
  name: 'SignUpInformationsForm',
  components: {
    PictureUpload,
    SelectGender,
    SelectOrientation,
  },
  data: () => ({
    SignUpFillProfileMutation,
    isFormValid: false,
    currentPanels: [0],
    rules,
    fields: {
      picture: {
        raw: null,
        cropped: null,
      },
      gender: [],
      orientation: [],
      interestedBy: {
        gender: [],
        age: [18, 99],
      },
    },
    GENDERS_LIST,
    ORIENTATIONS_LIST,
  }),
  computed: {
    account() {
      return this.$store.state.account
    },
    selectedGender: {
      get() {
        return this.fields.gender.map(gender => this.GENDERS_LIST.indexOf(gender))
      },
      set(newValue = []) {
        this.fields.gender = newValue.map(index => this.GENDERS_LIST[index])
      },
    },
    selectedOrientation: {
      get() {
        return this.fields.orientation.map(
          orientation => this.ORIENTATIONS_LIST.indexOf(orientation),
        )
      },
      set(newValue = []) {
        this.fields.orientation = newValue.map(index => this.ORIENTATIONS_LIST[index])
      },
    },
    selectedInterestGender: {
      get() {
        return this.fields.interestedBy.gender.map(gender => this.GENDERS_LIST.indexOf(gender))
      },
      set(newValue = []) {
        this.fields.interestedBy.gender = newValue.map(index => this.GENDERS_LIST[index])
      },
    },
    isPictureValid() {
      return this.fields.picture.raw && this.fields.picture.cropped
    },
    isGenderOrientationValid() {
      return this.fields.gender && this.fields.gender.length
        && this.fields.orientation && this.fields.orientation.length
    },
  },
  methods: {
    signIn({ data: { signUpFillProfile: token } }) {
      this.$store.dispatch('account/signIn', { token })
        .then(() => { this.$router.push('/') })
    },
  },
  watch: {
    isPictureValid(val) {
      this.currentPanels = val ? [1] : [0]
    },
    isGenderOrientationValid(val) {
      if (val && this.isPictureValid) {
        this.currentPanels = [1, 2]
      } else if (this.isPictureValid) {
        this.currentPanels = [1]
      } else {
        this.currentPanels = [0]
      }
    },
  },
}
</script>
