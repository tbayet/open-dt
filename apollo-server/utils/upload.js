import fs, { createWriteStream } from 'fs'
import util from 'util'
import { resolve } from 'path'
import { sync } from 'mkdirp'
import { generate } from 'shortid'
import { db } from './db'

const uploadDir = resolve(__dirname, '../../live/uploads')

// Ensure upload directory exists
sync(uploadDir)

const storeUpload = async ({ stream, filename }) => {
  const id = generate()
  const file = `${id}-${filename}`
  const path = `${uploadDir}/${file}`
  const urlPath = `files/${file}`

  return new Promise((resolveP, reject) => stream
    .pipe(createWriteStream(path))
    .on('finish', () => resolveP({ id, path: urlPath }))
    .on('error', reject))
}

const recordFile = file => db
  .get('uploads')
  .push(file)
  .last()
  .write()

export async function processUpload(file) {
  const {
    stream, filename, mimetype, encoding,
  } = await file
  const { id, path } = await storeUpload({ stream, filename })
  return recordFile({
    id, filename, mimetype, encoding, path,
  })
}

export async function processPictureUpload(dataURLFile) {
  const [fileInfo, base64Data] = dataURLFile.split('base64,')
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const format = fileInfo.split('/')[1].split(';')[0].toLowerCase()
  const filename = `${generate() + new Date().toISOString()}.${format}`
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`${uploadDir}/${filename}`, imageBuffer, 'binary')
  return `files/${filename}`
}
