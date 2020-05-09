<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Photos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <draggable
          v-show="!$store.state.profile.loading.sectionPictures"
          v-model="pictures"
          draggable=".draggable-item"
          class="photos__container"
        >
          <v-card slot="header" flat>
            <v-responsive class="photos__add" :aspect-ratio="1">
              <PictureUpload v-model="newPicture" />
              <v-btn :disabled="!isPictureValid" @click="addNewPicture">Add</v-btn>
            </v-responsive>
          </v-card>
          <v-card v-for="(photo, i) in pictures" :key="photo.cropped" tile class="draggable-item"
            :elevation="getElevation(i)"
            @mouseenter="hovered = i"
            @mouseleave="hovered = null"
          >
            <v-responsive
              :class="['photos__item', { 'photos__item--avatar': i === 0}]"
              :aspect-ratio="1"
            >
              <v-img :src="`${photo.cropped}`" />
              <v-btn @click="deletePicture(i)" title="delete" absolute top right>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-responsive>
          </v-card>
        </draggable>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import PictureUpload from '../form/SignUp/PictureUpload'

export default {
  components: {
    draggable,
    PictureUpload,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      hovered: null,
      newPicture: {},
    }
  },
  computed: {
    isPictureValid() {
      return this.newPicture.raw && this.newPicture.cropped
    },
    user() {
      return this.$store.state.profile.user
    },
    pictures: {
      get() {
        return this.user.pictures
      },
      set(pictures) {
        this.$store.dispatch('profile/updateSection', {
          section: 'sectionPictures',
          values: {
            pictures,
          },
        })
      },
    },
    dialog: {
      get() {
        return this.value
      },
      set(newValue) {
        if (newValue !== this.value) this.$emit('input', newValue)
      },
    },
  },
  methods: {
    addNewPicture() {
      if (this.isPictureValid) {
        this.$store.dispatch('profile/addPicture', this.newPicture)
      }
    },
    deletePicture(index) {
      if (this.user.pictures.length) {
        const pictures = this.user.pictures.slice(0, index)
          .concat(this.user.pictures.slice(index + 1))
        this.$store.dispatch('profile/updateSection', {
          section: 'sectionPictures',
          values: {
            pictures,
          },
        })
      }
    },
    getElevation(index) {
      return this.hovered === index ? 8 : 0
    },
  },
}
</script>

<style lang="scss" scoped>
.photos__container {
  display: flex;
  flex-wrap: wrap;
  & .photos__add {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em;
  }
  & > * {
    width: calc(15vh + 15vw);
    min-width: 20em;
    margin: 1em;
  }
  & .photos__item {
    cursor: move;
    &--avatar {
      position: relative;
      border: solid 6px gold;
      &::after {
        content: 'avatar';
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: solid 6px gold;
        border-right: solid 6px gold;
        padding: 0.5em;
        background-color: white
      }
    }
  }
}
</style>
