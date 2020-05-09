<template>
  <v-container fluid class="profileDescription">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            About me
            <EditProfileSectionButton middle @click.native="true" />
          </v-card-title>
          <v-divider class="mb-4" />
          <ProfileTags />
          <v-divider />
          <v-card-text>
            <P>Hello</p>
            <P>Hello</p>
            <P>Hello</p>
            <P>Hello</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card tile>
          <v-card-title>
            What i'm looking for
            <EditProfileSectionButton middle @click.native="true" />
          </v-card-title>
          <v-divider />
          <v-card-text>
            <P>Hello</p>
            <P>Hello</p>
            <P>Hello</p>
            <P>Hello</p>
            <P>Hello</p>
            <P>Hello</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProfileTags from './ProfileTags'
import EditProfileSectionButton from './EditProfileSectionButton'

export default {
  components: {
    ProfileTags,
    EditProfileSectionButton,
  },
  data() {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
.profileDescription {
}
</style>
