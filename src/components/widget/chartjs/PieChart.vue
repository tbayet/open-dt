<script>
import { Pie } from 'vue-chartjs'
import { getPatterns } from '../../../utils/canvas/canvasPatterns'

export default {
  extends: Pie,
  data() {
    return {
      ready: false,
      options: {
        legend: {
          display: false,
        },
      },
      chartdata: {
        datasets: [{
          data: [10, 20, 30],
          backgroundColor: [
            'red',
            'orange',
            'yellow',
          ],
        }],
        labels: [
          'Red',
          'Yellow',
          'Blue',
        ],
      },
    }
  },
  async beforeMount() {
    try {
      const patterns = await getPatterns()
      this.chartdata.datasets[0].backgroundColor = [
        patterns.sport, patterns.videogame, patterns.dicegame,
      ]
    } finally {
      this.ready = true
    }
  },
  watch: {
    ready(val) {
      if (val) {
        this.renderChart(this.chartdata, this.options)
      }
    },
  },
}
</script>
