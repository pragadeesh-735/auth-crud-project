import express from 'express'
import dotenv from 'dotenv'
import logger from './src/utils/logger.js'

const app = express()
dotenv.config()

//import routes path
import sequelize from './src/config/database.js'
import userRoutes from './src/controllers/userRoutes.js'

app.use(express.json())
app.use('/api', userRoutes)

sequelize
  .sync()
  .then(() => {
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });

    // const PORT = getEnv('PORT')
    try {
      const PORT = process.env.PORT || 3000
      app.listen(PORT, () => {
        // console.log(`🚀 Server is running on port ${PORT}`)
        logger.info(`🚀 Server is running on port ${PORT}`)
      })
    } catch (err) {
      logger.error('Unable to connect to the server:', err)

      // console.log('server not running')
    }
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error)
    logger.error('Unable to connect to the database:', error)
  })
