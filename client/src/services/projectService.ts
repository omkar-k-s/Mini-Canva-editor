import api from './api'
import type { Project, ProjectCreatePayload, ProjectUpdatePayload, ProjectListItem } from '@/types/project.types'

/**
 * Project API service — all calls to /api/projects/*
 */
export const projectService = {
  create: async (payload: ProjectCreatePayload): Promise<Project> => {
    const { data } = await api.post<{ data: Project }>('/projects', payload)
    return data.data
  },

  getAll: async (): Promise<ProjectListItem[]> => {
    const { data } = await api.get<{ data: ProjectListItem[] }>('/projects')
    return data.data
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get<{ data: Project }>(`/projects/${id}`)
    return data.data
  },

  update: async (id: string, payload: ProjectUpdatePayload): Promise<Project> => {
    const { data } = await api.put<{ data: Project }>(`/projects/${id}`, payload)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },
}
