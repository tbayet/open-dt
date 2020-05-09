<template>
  <v-container class="profileHeader" fluid>
    <v-row justify="space-around">
      <v-col cols="12" md="5" lg="4" xl="3">
        <v-card class="bg-transparent" flat tile >
          <div class="d-flex flex-no-wrap justify-start">

            <v-hover>
              <template v-slot:default="{ hover }">
                <div class="position-relative">
                  <PhotosModal v-model="photoModal" :photos="user.pictures" />
                  <v-avatar @click="photoModal = true" size="200">
                    <v-img
                      class="avatar--grey"
                      :src="user.avatar"
                      :alt="`${user.username} avatar`"
                    >
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out
                            darken-2 v-card--reveal white--text headline"
                          style="height: 100%;"
                        >
                          <span>Photos</span>
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-avatar>
                  <EditProfilePhotos v-model="dialogPictures" />
                  <EditProfileSectionButton @click.native="dialogPictures = true" offsetX dark />
                </div>
              </template>
            </v-hover>
            <div class="profileHeader__mainInfos">
              <div class="position-relative">
                <v-card-title class="headline">{{ user.username }}</v-card-title>
                <v-card-subtitle>
                  <strong>{{ user.age }}</strong> __ {{ user.city.name }}
                </v-card-subtitle>
                <EditProfileModal
                  v-model="dialogName"
                  title="Name - Age - City"
                  @cancel="resetSectionName"
                  @save="saveSectionName"
                >
                  <p class="title mb-2 text-left">Username</p>
                  <InputUsername v-model="sectionName.username" />
                  <p class="title mb-2 text-left">Birhtdate</p>
                  <SelectBirthdate v-model="sectionName.birthdate" />
                  <p class="title mb-2 text-left">City</p>
                  <SelectCity v-model="sectionName.city" />
                </EditProfileModal>
                <EditProfileSectionButton
                  @click.native="dialogName = true" offsetX middle dark small />
              </div>

              <div class="position-relative">
                <v-chip v-for="gender in user.gender" :key="gender" small>{{ gender }}</v-chip>
                <v-chip v-for="orientation in user.orientation" :key="orientation" small>
                  {{ orientation }}
                </v-chip>
                <EditProfileModal
                  v-model="dialogGender"
                  title="Gender - Orientation"
                  @cancel="resetSectionGender"
                  @save="saveSectionGender"
                >
                  <p class="title mb-2 text-left">Gender(s)</p>
                  <v-divider class="mb-2" />
                  <SelectGender mandatory v-model="sectionGender.gender" />
                  <p class="title mb-2 text-left">Orientation(s)</p>
                  <v-divider class="mb-2" />
                  <SelectOrientation mandatory v-model="sectionGender.orientation" />
                </EditProfileModal>
                <EditProfileSectionButton
                  @click.native="dialogGender = true" offsetX middle small />
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="7" xl="7">
        <div v-if="!dialogPunchline" class="profileHeader__introduce position-relative">
         {{ user.punchline }}
          <EditProfileSectionButton @click.native="dialogPunchline = true" />
        </div>
        <div v-else
          class="profileHeader__introduce profileHeader__introduce--edit position-relative">
          <v-textarea hide-details outlined v-model="sectionPunchline.punchline"
            height="100%" rows="4" maxlength="96" no-resize class="punchline__textarea">
          </v-textarea>
          <v-btn text @click="resetSectionPunchline">Cancel</v-btn>
          <v-btn color="success" @click="saveSectionPunchline">Save</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EditProfileSectionButton from './EditProfileSectionButton'
import SelectGender from '../form/inputs/SelectGender'
import SelectOrientation from '../form/inputs/SelectOrientation'
import SelectCity from '../form/inputs/SelectCity'
import EditProfileModal from './EditProfileModal'
import SelectBirthdate from '../form/inputs/SelectBirthdate'
import InputUsername from '../form/inputs/InputUsername'
import PhotosModal from './PhotosModal'
import EditProfilePhotos from './EditProfilePhotos'

export default {
  components: {
    EditProfileSectionButton,
    SelectGender,
    SelectOrientation,
    SelectBirthdate,
    SelectCity,
    InputUsername,
    EditProfileModal,
    EditProfilePhotos,
    PhotosModal,
  },
  data() {
    return {
      photoModal: false,
      sectionGender: {},
      sectionPictures: {},
      sectionPunchline: {},
      sectionName: {},
      dialogPictures: false,
      dialogGender: false,
      dialogName: false,
      dialogPunchline: false,
    }
  },
  methods: {
    saveSectionGender() {
      this.$store.dispatch('profile/updateSection', {
        section: 'sectionGender',
        values: this.sectionGender,
      }).finally(this.resetSectionGender)
    },
    resetSectionGender() {
      this.dialogGender = false
      this.sectionGender.gender = [...this.user.gender]
      this.sectionGender.orientation = [...this.user.orientation]
    },
    saveSectionName() {
      this.$store.dispatch('profile/updateSection', {
        section: 'sectionName',
        values: this.sectionName,
      }).finally(this.resetSectionName)
    },
    resetSectionName() {
      this.dialogName = false
      this.sectionName.username = this.user.username
      this.sectionName.birthdate = this.user.birthdate
      this.sectionName.city = { ...this.user.city }
    },
    saveSectionPunchline() {
      this.$store.dispatch('profile/updateSection', {
        section: 'sectionPunchline',
        values: this.sectionPunchline,
      }).finally(this.resetSectionPunchline)
    },
    resetSectionPunchline() {
      this.dialogPunchline = false
      this.sectionPunchline.punchline = this.user.punchline
    },
  },
  beforeMount() {
    this.resetSectionGender()
    this.resetSectionName()
    this.resetSectionPunchline()
  },
  computed: {
    user() {
      return this.$store.state.profile.user
    },
    loading() {
      return this.$store.state.profile.loading
    },
  },
}
</script>

<style lang="scss" scoped>
.profileHeader {
  background: linear-gradient(180deg, #272727 8em, transparent 8em);

  &__mainInfos {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    & > div {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      padding-top: 1em;
      align-items: center;
      flex-wrap: wrap;
      &:first-of-type {
        padding-top: 0;
        justify-content: center;
        flex-direction: column;
        & * {
          color: white;
        }
      }
    }
  }

  &__introduce {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 180%;
    padding: 1.5em;
    height: 100%;
    background-color: white;
    border-radius: 10px;
    border: dashed 2px transparentize(#272727, 0.8);

    &--edit {
      flex-wrap: wrap;
      padding: 0;
      & .punchline__textarea {
        width: 100%;
        text-align: center;
        padding: 0.5em;
      }
    }
  }
}
.avatar--grey {
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
}
.bg-transparent {
  background-color: transparent;
}
.v-card--reveal {
  align-items: flex-start;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  & > span {
    width: 100%;
    background: transparentize(#000000, 0.4);
    padding: .4em;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    padding-top: 1em;
  }
}
.position-relative {
  position: relative;
}
</style>
