import path from 'path'
import express from 'express'

export default app => {
  app.use(express.json({ limit: '50mb' }));
  app.use('/files', express.static(path.resolve(__dirname, '../live/uploads')))
}
