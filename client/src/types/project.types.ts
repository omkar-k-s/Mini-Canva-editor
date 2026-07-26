// ─── Project Types ────────────────────────────────────────────────────────────

export interface Project {
  _id: string
  title: string
  description?: string
  thumbnail?: string
  canvasData: string         // JSON-serialized Fabric.js canvas
  canvasWidth: number
  canvasHeight: number
  backgroundColor: string
  tags?: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ProjectCreatePayload {
  title: string
  description?: string
  thumbnail?: string
  canvasData: string
  canvasWidth: number
  canvasHeight: number
  backgroundColor: string
}

export interface ProjectUpdatePayload extends Partial<ProjectCreatePayload> {
  thumbnail?: string
}

export interface ProjectListItem {
  _id: string
  title: string
  thumbnail?: string
  canvasWidth: number
  canvasHeight: number
  backgroundColor: string
  updatedAt: string
}

// ─── Template Types ───────────────────────────────────────────────────────────

export type TemplateCategory =
  | 'social'
  | 'poster'
  | 'flyer'
  | 'certificate'
  | 'resume'
  | 'business-card'

export interface CanvasTemplate {
  id: string
  name: string
  category: TemplateCategory
  description: string
  thumbnail: string          // Emoji or URL
  width: number
  height: number
  backgroundColor: string
  objects: object[]          // Fabric.js serialized objects
}

// ─── Project Store State ──────────────────────────────────────────────────────

export interface ProjectStoreState {
  projects: ProjectListItem[]
  currentProject: Project | null
  isLoading: boolean
  isSaving: boolean

  setProjects: (projects: ProjectListItem[]) => void
  setCurrentProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  addProject: (project: ProjectListItem) => void
  updateProjectInList: (id: string, updates: Partial<ProjectListItem>) => void
  removeProject: (id: string) => void
}
