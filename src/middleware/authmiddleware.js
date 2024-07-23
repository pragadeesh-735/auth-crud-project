import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const verifyApplicationKey = (req, res, next) => {
  try {
    const authHeader = req.headers && req.headers['authorization']

    const key = authHeader

    const application_key = process.env.APPLICATION_KEY

    if (!key) {
      return res
        .status(403)
        .json({ status: 203, data: {}, message: 'Unauthorized access' })
    }

    if (!application_key) {
      throw new Error('APPLICATION_KEY is not defined')
    }

    if (key !== application_key) {
      return res
        .status(403)
        .json({ status: 0, data: {}, message: 'Unauthorized access' })
    }

    next() // Proceed to the next middleware or route handler
  } catch (er) {
    console.error(`AUTHMID001: Error in auth middleware: ${er.message}`)
    return res
      .status(500)
      .json({ status: 0, data: {}, message: 'Internal Server Error' })
  }
}

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers && req.headers['authorization']
    const token = authHeader
    const jwt_secret = process.env.JWT_SECRET

    if (!token) {
      return res
        .status(403)
        .json({ status: 0, data: {}, message: 'Unauthorized access' })
    }

    if (!jwt_secret) {
      throw new Error('JWT_SECRET is not defined')
    }

    jwt.verify(token, jwt_secret, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ status: 0, data: {}, message: 'Unauthorized access' })
      }
      req.user = decoded // Store decoded token in request
      next()
    })
  } catch (er) {
    console.error(`AUTHMID002: Error in auth middleware: ${er.message}`)
    return res
      .status(500)
      .json({ status: 0, data: {}, message: 'Internal Server Error' })
  }
}
export default verifyToken
