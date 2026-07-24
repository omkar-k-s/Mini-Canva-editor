import { Response } from 'express'
import { Project } from '../models/Project.model'
import { sendSuccess, sendError } from '../utils/response.utils'
import { asyncHandler } from '../utils/asyncHandler'
import type { AuthRequest } from '../middleware/auth.middleware'

/**
 * POST /api/projects
 */
export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, canvasData, canvasWidth, canvasHeight, backgroundColor } = req.body

  const project = await Project.create({
    title,
    description,
    canvasData,
    canvasWidth:     canvasWidth  || 1080,
    canvasHeight:    canvasHeight || 1080,
    backgroundColor: backgroundColor || '#ffffff',
    userId: req.user!.userId,
  })

  sendSuccess(res, project, 201, 'Project created')
})

/**
 * GET /api/projects
 */
export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projects = await Project.find(
    { userId: req.user!.userId },
    // Return only list fields — not the heavy canvasData
    { title: 1, thumbnail: 1, canvasWidth: 1, canvasHeight: 1, backgroundColor: 1, updatedAt: 1 }
  ).sort({ updatedAt: -1 }).lean()

  sendSuccess(res, projects)
})

/**
 * GET /api/projects/:id
 */
export const getProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOne({
    _id:    req.params.id,
    userId: req.user!.userId,
  }).lean()

  if (!project) return sendError(res, 'Project not found', 404)
  sendSuccess(res, project)
})

/**
 * PUT /api/projects/:id
 */
export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.userId },
    { $set: req.body },
    { new: true, runValidators: true }
  ).lean()

  if (!project) return sendError(res, 'Project not found', 404)
  sendSuccess(res, project, 200, 'Project updated')
})

/**
 * DELETE /api/projects/:id
 */
export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOneAndDelete({
    _id:    req.params.id,
    userId: req.user!.userId,
  })

  if (!project) return sendError(res, 'Project not found', 404)
  sendSuccess(res, null, 200, 'Project deleted')
})
