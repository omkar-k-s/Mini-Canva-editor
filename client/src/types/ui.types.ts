// ─── UI Types ─────────────────────────────────────────────────────────────────

export type SidebarPanel = 'layers' | 'templates' | 'history' | 'none'
export type Theme = 'dark' | 'light'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  targetId?: string
}

export interface DialogState {
  exportDialog: boolean
  canvasSizeDialog: boolean
  saveProjectDialog: boolean
  openProjectDialog: boolean
}

// ─── UI Store State ───────────────────────────────────────────────────────────

export interface UiStoreState {
  // Sidebar panels
  activeSidePanel: SidebarPanel
  setActiveSidePanel: (panel: SidebarPanel) => void

  // Dialog visibility
  dialogs: DialogState
  openDialog: (dialog: keyof DialogState) => void
  closeDialog: (dialog: keyof DialogState) => void

  // Right-click context menu
  contextMenu: ContextMenuState
  showContextMenu: (x: number, y: number, targetId?: string) => void
  hideContextMenu: () => void

  // Left toolbar collapsed
  isToolbarCollapsed: boolean
  toggleToolbar: () => void

  // Properties panel visible
  isPropertiesPanelOpen: boolean
  setPropertiesPanelOpen: (open: boolean) => void

  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void

  // Loading overlay
  isGlobalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}
