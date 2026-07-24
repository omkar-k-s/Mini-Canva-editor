import { create } from 'zustand'
import type { ProjectStoreState, Project, ProjectListItem } from '@/types/project.types'

/**
 * Project store — tracks project list, current open project, and save state.
 */
export const useProjectStore = create<ProjectStoreState>()((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  isSaving: false,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),

  addProject: (project) =>
    set((s) => ({ projects: [project, ...s.projects] })),

  updateProjectInList: (id, updates) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p._id === id ? { ...p, ...updates } : p
      ),
    })),

  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p._id !== id) })),
}))

// Selectors
export const selectProjects       = (s: ProjectStoreState) => s.projects
export const selectCurrentProject = (s: ProjectStoreState) => s.currentProject
export const selectIsSaving       = (s: ProjectStoreState) => s.isSaving
