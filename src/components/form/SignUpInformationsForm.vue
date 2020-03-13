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
              <img :src="fields.picture.raw" />
              <img :src="fields.picture.cropped" />
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
              <v-select
                v-show="false"
                v-model="fields.gender"
                multiple readonly
                required
                :rules="rules.selectGenderRules"
              />
              <v-chip-group
                v-model="selectedGender"
                column multiple
                class="mb-8"
              >
                <v-chip v-for="gender in genderList" :key="gender" filter outlined>
                  {{ gender }}
                </v-chip>
              </v-chip-group>

              <p class="title mb-2 text-left">Orientation(s)</p>
              <v-select
                v-show="false"
                v-model="fields.orientation"
                multiple readonly
                required
                :rules="rules.selectOrientationRules"
              />
              <v-chip-group
                v-model="selectedOrientation"
                column multiple
                class="mb-8"
              >
                <v-chip v-for="orientation in orientationList" :key="orientation" filter outlined>
                  {{ orientation }}
                </v-chip>
              </v-chip-group>
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
              <v-select
                v-show="false"
                v-model="fields.interestedBy.gender"
                multiple readonly
                required
                :rules="rules.selectGenderRules"
              />
              <v-chip-group
                v-model="selectedInterestGender"
                column multiple
              >
                <v-chip v-for="gender in genderList" :key="gender" filter outlined>
                  {{ gender }}
                </v-chip>
              </v-chip-group>

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
import { SignUpFillProfileMutation } from '../../graphql/User.gql'
import PictureUpload from './SignUp/PictureUpload'
import rules from '../../utils/form/rules'

export default {
  name: 'SignUpInformationsForm',
  components: {
    PictureUpload,
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
    genderList: ['OTHER', 'TRANSWOMAN', 'TRANSMAN', 'NOGENDER', 'WOMAN', 'MAN'],
    orientationList: ['HETEROSEXUAL', 'HOMOSEXUAL', 'BISEXUAL', 'PANSEXUAL', 'ASEXUAL',
      'SAPIOSEXUAL', 'HETEROFLEXIBLE', 'HOMOFLEXIBLE'],
  }),
  computed: {
    account() {
      return this.$store.state.account
    },
    selectedGender: {
      get() {
        return this.fields.gender.map(gender => this.genderList.indexOf(gender))
      },
      set(newValue = []) {
        this.fields.gender = newValue.map(index => this.genderList[index])
      },
    },
    selectedOrientation: {
      get() {
        return this.fields.orientation.map(orientation => this.orientationList.indexOf(orientation))
      },
      set(newValue = []) {
        this.fields.orientation = newValue.map(index => this.orientationList[index])
      },
    },
    selectedInterestGender: {
      get() {
        return this.fields.interestedBy.gender.map(gender => this.genderList.indexOf(gender))
      },
      set(newValue = []) {
        this.fields.interestedBy.gender = newValue.map(index => this.genderList[index])
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
