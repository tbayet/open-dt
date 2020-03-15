/* eslint-disable global-require */
const listImages = [
  {
    name: 'sport',
    src: require('../../assets/canvas-patterns/sport.png'),
    color: 'orange',
  },
  {
    name: 'movie',
    src: require('../../assets/canvas-patterns/movietv.png'),
    color: 'blue',
  },
  {
    name: 'videogame',
    src: require('../../assets/canvas-patterns/gamepad.png'),
    color: 'red',
  },
  {
    name: 'dicegame',
    src: require('../../assets/canvas-patterns/dice.png'),
    color: 'green',
  },
]

const loadImage = (image) => new Promise((resolve, reject) => {
  const img = new Image()
  img.src = image.src
  img.onerror = reject
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = image.color
    ctx.fillRect(0, 0, 30, 30)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.drawImage(img, 0, 0, 24, 24)
    const pattern = ctx.createPattern(canvas, 'repeat')
    resolve({ name: image.name, pattern })
  }
})

export const getPatterns = async () => {
  const allPatterns = await Promise.all(listImages.map(image => loadImage(image)))
  return allPatterns.reduce((acc, pattern) => ({ ...acc, [pattern.name]: pattern.pattern }), {})
}
