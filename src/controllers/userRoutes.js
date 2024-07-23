// routes/userRoutes.js
import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  register,
  login
} from './userControllers.js'
import {
  verifyToken,
  verifyApplicationKey
} from '../middleware/authmiddleware.js'

const router = express.Router()

router.post('/users/register', verifyApplicationKey, register)
router.post('/users', login)
// router.post("/users/createUser", createUser);
router.get('/users', verifyToken, getAllUsers)
router.get('/users/:id', verifyToken, getUserById)
router.put('/users/:id', verifyToken, updateUser)
router.delete('/users/:id', verifyToken, deleteUser)

export default router
