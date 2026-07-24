import { Router } from 'express'
import { body } from 'express-validator'
import {
  createProject, getProjects, getProject,
  updateProject, deleteProject,
} from '../controllers/project.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'

const router = Router()

// All project routes require authentication
router.use(authenticate)

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('canvasData').notEmpty().withMessage('Canvas data is required'),
  ],
  validate,
  createProject
)

router.get('/',    getProjects)
router.get('/:id', getProject)

router.put(
  '/:id',
  [body('title').optional().trim().isLength({ max: 200 })],
  validate,
  updateProject
)

router.delete('/:id', deleteProject)

export default router
