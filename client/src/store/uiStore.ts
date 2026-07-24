import { create } from 'zustand'
import type { UiStoreState, SidebarPanel, DialogState, Theme } from '@/types/ui.types'

/**
 * UI store — panel visibility, dialogs, context menu, theme.
 * No persistence needed — UI resets on page load.
 */
export const useUiStore = create<UiStoreState>()((set) => ({
  // ── Side panel ────────────────────────────────────────────────────────
  activeSidePanel: 'layers' as SidebarPanel,
  setActiveSidePanel: (activeSidePanel) => set({ activeSidePanel }),

  // ── Dialogs ───────────────────────────────────────────────────────────
  dialogs: {
    exportDialog: false,
    canvasSizeDialog: false,
    saveProjectDialog: false,
    openProjectDialog: false,
  },
  openDialog: (dialog) =>
    set((s) => ({ dialogs: { ...s.dialogs, [dialog]: true } })),
  closeDialog: (dialog) =>
    set((s) => ({ dialogs: { ...s.dialogs, [dialog]: false } })),

  // ── Context menu ──────────────────────────────────────────────────────
  contextMenu: { visible: false, x: 0, y: 0 },
  showContextMenu: (x, y, targetId) =>
    set({ contextMenu: { visible: true, x, y, targetId } }),
  hideContextMenu: () =>
    set({ contextMenu: { visible: false, x: 0, y: 0 } }),

  // ── Toolbar ───────────────────────────────────────────────────────────
  isToolbarCollapsed: false,
  toggleToolbar: () =>
    set((s) => ({ isToolbarCollapsed: !s.isToolbarCollapsed })),

  // ── Properties panel ──────────────────────────────────────────────────
  isPropertiesPanelOpen: true,
  setPropertiesPanelOpen: (isPropertiesPanelOpen) =>
    set({ isPropertiesPanelOpen }),

  // ── Theme ─────────────────────────────────────────────────────────────
  theme: 'dark' as Theme,
  setTheme: (theme) => {
    document.documentElement.className = theme
    set({ theme })
  },

  // ── Global loading overlay ────────────────────────────────────────────
  isGlobalLoading: false,
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
}))

// Selectors
export const selectActiveSidePanel     = (s: UiStoreState) => s.activeSidePanel
export const selectDialogs             = (s: UiStoreState) => s.dialogs
export const selectContextMenu         = (s: UiStoreState) => s.contextMenu
export const selectIsPropertiesPanelOpen = (s: UiStoreState) => s.isPropertiesPanelOpen
