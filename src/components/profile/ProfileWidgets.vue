<template>
  <draggable class="profileWidgets" v-model="widgets">
    <v-card v-for="(widget, i) in widgets" :key="i" tile
      :elevation="getWidgetElevation(i)"
      @mouseenter="hovered = i"
      @mouseleave="hovered = null"
    >
      <v-responsive class="widget" :aspect-ratio="1">
        <component v-bind:is="widget.component" />
        <EditProfileSectionButton small />
      </v-responsive>
    </v-card>
    <v-card tile>
      <v-responsive class="widget" :aspect-ratio="1">
          Yoweweuhouuuuu
      </v-responsive>
    </v-card>
    <v-card tile>
      <v-responsive class="widget" :aspect-ratio="1">
          Yoweweuhouuuuu
      </v-responsive>
    </v-card>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import PieChart from '../widget/chartjs/PieChart'
import EditProfileSectionButton from './EditProfileSectionButton'

export default {
  components: {
    draggable,
    EditProfileSectionButton,
  },
  data() {
    return {
      hovered: null,
      widgets: [
        {
          component: PieChart,
        },
        {
          component: PieChart,
        },
        {
          component: PieChart,
        },
      ],
    }
  },
  methods: {
    getWidgetElevation(index) {
      if (this.hovered === index) {
        return 8
      }
      return 0
    },
  },
}
</script>

<style lang="scss" scoped>
.profileWidgets {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, 16rem);
  justify-content: center;
  .widget {
    display: flex;
    align-items: center;
    cursor: move;
  }
}
</style>
