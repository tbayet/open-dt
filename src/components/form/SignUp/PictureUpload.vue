<template>
  <div @submit.prevent class="pictureUpload">
    <v-file-input
      v-model="raw"
      outlined
      accept="image/png, image/jpeg, image/bmp"
      prepend-icon="mdi-camera"
      label="Browse files..."
      :rules="rules.addPictureRules"
      required
    ></v-file-input>
    <v-dialog v-model="pictureModal" persistent>
      <v-card>
        <v-card-title class="headline justify-center">Crop your picture</v-card-title>
        <v-divider />
        <v-card-text>
          <div v-if="pictureCanvas.isReady" class="pictureUpload__canvas">
            <canvas
              ref="pictureCanvas"
              :width="canvasSize.w"
              :height="canvasSize.h "
            >
              Your Browser does not support canvas
            </canvas>
          </div>
          <v-progress-circular class="mt-6" indeterminate v-else />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="cancelModal">Cancel</v-btn>
          <v-btn color="success" @click="validateModal">Validate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import rules from '../../../utils/form/rules'

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      rules,
      pictureModal: false,
      pictureCanvas: {
        imageFile: null,
        fileReader: null,
        isReady: false,
        cropper: null,
        type: null,
      },
      canvasSize: {
        h: 400,
        w: 400,
        def: 400,
      },

      // results :
      raw: null,
      result: {
        raw: null,
        cropped: null,
      },
    }
  },
  created() {
  },
  methods: {
    cancelModal() {
      this.pictureModal = false
      this.pictureCanvas.cropper.destroy()
      this.pictureCanvas = {
        imageFile: null,
        fileReader: null,
        isReady: false,
        cropper: null,
        type: null,
      }
      this.raw = null
    },
    validateModal() {
      this.result.raw = this.pictureCanvas.imageFile.src
      this.result.cropped = this.pictureCanvas.cropper.getCroppedCanvas()
        .toDataURL(this.pictureCanvas.type)
      this.$emit('input', this.result)
      this.pictureModal = false
      this.pictureCanvas.cropper.destroy()
      this.pictureCanvas = {
        imageFile: null,
        fileReader: null,
        isReady: false,
        cropper: null,
        type: null,
      }
    },
    drawImageOnCanvas() {
      const ctx = this.$refs.pictureCanvas.getContext('2d')
      ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
      ctx.drawImage(
        this.pictureCanvas.imageFile,
        0, 0,
      )
      this.$refs.pictureCanvas.toDataURL(this.pictureCanvas.type)
      this.$nextTick(this.drawCropperOnCanvas)
    },
    drawCropperOnCanvas() {
      this.pictureCanvas.cropper = new Cropper(this.$refs.pictureCanvas, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        rotatable: false,
        minCropBoxWidth: this.canvasSize.def,
        minCropBoxHeight: this.canvasSize.def,
        cropBoxResizable: false,
        cropBoxMovable: false,
        // scalable: false,
      })
    },
    onImageLoad() {
      this.pictureCanvas.type = this.raw.type
      this.canvasSize.w = this.pictureCanvas.imageFile.width
      this.canvasSize.h = this.pictureCanvas.imageFile.height
      this.pictureCanvas.isReady = true

      this.$nextTick(this.drawImageOnCanvas)
    },
    onFileLoad() {
      this.pictureCanvas.imageFile = new Image()
      this.pictureCanvas.imageFile.onload = this.onImageLoad
      this.pictureCanvas.imageFile.src = this.pictureCanvas.fileReader.result
    },
  },
  watch: {
    raw(val) {
      if (val && val.size) {
        this.pictureModal = true
        this.pictureCanvas.fileReader = new FileReader()
        this.pictureCanvas.fileReader.onload = this.onFileLoad
        this.pictureCanvas.fileReader.readAsDataURL(this.raw)
      }
    },
  },
}
</script>

<style>
.cropper-modal {
  opacity: 0.8;
}
</style>

<style lang="scss" scoped>
.pictureUpload {
  &__canvas {
    overflow: hidden;
    border: 0.3em solid black;
    border-top-width: 2em;
    border-bottom-width: 2em;
    border-radius: 0.3em;
    height: 400px;
    margin-left: 2em;
    margin-right: 2em;
    margin-top: 1em;
  }
}
</style>
