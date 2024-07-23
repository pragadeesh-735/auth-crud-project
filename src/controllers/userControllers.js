// controllers/userController.js
import User from '../models/user.js'
import logger from '../utils/logger.js'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

export const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age,
      mobileno: req.body.mobileno
    })
    res.status(201).send(user)
  } catch (err) {
    logger.error('USERCTR001: Error in controller :', err)
    console.error(`USERCTR001: Error in controller : ${err.message}`)
    res.status(500).send({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email, is_active: 1 }
    })
    if (!user) {
      return res.status(404).send({ message: 'User not found.' })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid password.' })
    }

    const jwt_secret = process.env.JWT_SECRET
    const session_time = process.env.SESSION_TIME
    if (!jwt_secret) {
      throw new Error('JWT_SECRET is not defined')
    }

    const token = jwt.sign({ id: user.id }, jwt_secret, {
      expiresIn: session_time
    })
    // logger.message('User was sucessfull login');
    console.log('User was sucessfull login')

    res.send({ token })
  } catch (err) {
    console.error(`USERCTR002: Error in controller : ${err.message}`)

    res.status(500).send({ message: err.message })
  }
}

//get all User
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_active: 1 },
      attributes: ['id', 'name', 'email', 'password', 'age', 'mobileno']
    })
    if (users.length === 0) {
      //   logger.info("user not found");
      return res.status(200).json({
        status: 0,
        data: [],
        message: 'No data found'
      })
    }
    // logger.info(`Retrieved all user`);
    return res
      .status(200)
      .json({ status: 1, data: users, message: 'Retrieved all users' })
  } catch (err) {
    logger.error('USERCTR003: Error in controller :', err)

    console.error(`USERCTR003: Error in controller : ${err.message}`)

    return res
      .status(500)
      .json({ status: 0, data: [], message: 'Failed to find users' })
  }
}

// Create a new user
// export const createUser = async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    logger.error('USERCTR004: Error in controller :', err)

    console.error(`USERCTR004: Error in controller : ${err.message}`)

    res.status(500).json({ error: error.message })
  }
}

// Update a user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      await user.update(req.body)
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    logger.error('USERCTR005: Error in controller :', err)

    console.error(`USERCTR005: Error in controller : ${err.message}`)

    res.status(400).json({ error: error.message })
  }
}

// Delete a user
// export const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id)
//     if (user) {
// await user.destroy()
//          // await user.destroy({
//         // is_active: 0
//        // where: { is_active: 0 }
//       //})
//       res.json({ message: 'User deleted' })
//     } else {
//       res.status(404).json({ error: 'User not found' })
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

//tempervery delete user

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      user.is_active = 0
      await user.save()
      res.json({ message: 'User marked as inactive' })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (err) {
    logger.error('USERCTR006: Error in controller :', err)

    console.error(`USERCTR005: Error in controller : ${err.message}`)
    res.status(500).json({ error: error.message })
  }
}
