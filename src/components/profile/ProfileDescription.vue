<template>
  <v-container fluid class="profileDescription">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>About me</v-card-title>
          <v-divider class="mb-2" />
          <v-chip class="mx-2" label outlined color="green">
            <v-icon small left>mdi-leaf</v-icon>
            Vegan
          </v-chip>
          <v-chip class="mx-2" label outlined color="purple">
            <v-icon small left>mdi-heart-multiple</v-icon>
            Polyamourous
          </v-chip>
          <v-chip class="mx-2" label outlined
            style="border-color: DarkSlateBlue; color: DarkSlateBlue" color="DarkSlateBlue">
            <v-icon small left>mdi-heart-multiple</v-icon>
            Anarel
          </v-chip>
          <v-chip class="mx-2" label outlined
            color="pink">
            <v-icon small left>mdi-flag</v-icon>
            Ally
          </v-chip>
           <v-chip class="mx-2" label outlined
            color="blue">
            <v-icon small left>mdi-gender-female</v-icon>
            Feminist
          </v-chip>
          <v-divider class="mt-2" />
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
          <v-card-title>What i'm looking for</v-card-title>
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
export default {
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
