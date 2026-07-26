import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { fabric } from 'fabric'
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/constants/canvasSizes'
import { safeLoadFromJSON } from '@/utils/fabricHelpers'
import type {
  CanvasStoreState,
  CanvasLayer,
  HistoryEntry,
  CanvasSize,
  GridSettings,
  SnapSettings,
  ToolType,
} from '@/types/canvas.types'

const DEFAULT_CANVAS_SIZE: CanvasSize = {
  width: 1080,
  height: 1080,
  label: 'Instagram Post',
}

const DEFAULT_GRID: GridSettings = {
  visible: false,
  size: 20,
  color: '#ffffff',
  opacity: 0.1,
}

const DEFAULT_SNAP: SnapSettings = {
  enabled: true,
  gridSize: 10,
  threshold: 8,
}

const MAX_HISTORY = 100

/**
 * Central canvas store — manages Fabric.js canvas instance, tool selection,
 * layers, undo/redo history, grid, snap, and clipboard.
 *
 * Uses subscribeWithSelector middleware so individual component can subscribe
 * to only the slice they need, preventing cascade re-renders.
 */
export const useCanvasStore = create<CanvasStoreState>()(
  subscribeWithSelector((set, get) => ({
    // ── Canvas instance ───────────────────────────────────────────────────
    canvas: null,
    setCanvas: (canvas) => set({ canvas }),

    // ── Active tool ───────────────────────────────────────────────────────
    activeTool: 'select' as ToolType,
    setActiveTool: (activeTool) => set({ activeTool }),

    // ── Canvas size ───────────────────────────────────────────────────────
    canvasSize: DEFAULT_CANVAS_SIZE,
    setCanvasSize: (canvasSize) => set({ canvasSize }),

    // ── Background ────────────────────────────────────────────────────────
    backgroundColor: '#ffffff',
    setBackgroundColor: (backgroundColor) => set({ backgroundColor }),

    // ── Zoom ──────────────────────────────────────────────────────────────
    zoom: 1,
    setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),

    // ── Grid ──────────────────────────────────────────────────────────────
    grid: DEFAULT_GRID,
    setGrid: (grid) => set((s) => ({ grid: { ...s.grid, ...grid } })),

    // ── Snap ──────────────────────────────────────────────────────────────
    snap: DEFAULT_SNAP,
    setSnap: (snap) => set((s) => ({ snap: { ...s.snap, ...snap } })),

    // ── Layers ────────────────────────────────────────────────────────────
    layers: [],
    setLayers: (layers) => set({ layers }),
    selectedLayerIds: [],
    setSelectedLayerIds: (selectedLayerIds) => set({ selectedLayerIds }),

    // ── History ───────────────────────────────────────────────────────────
    history: [],
    historyIndex: -1,

    pushHistory: (entry: HistoryEntry) => {
      const { history, historyIndex } = get()
      // Truncate future states when a new action is taken
      const truncated = history.slice(0, historyIndex + 1)
      const next = [...truncated, entry].slice(-MAX_HISTORY)
      set({ history: next, historyIndex: next.length - 1 })
    },

    undo: () => {
      const { canvas, history, historyIndex } = get()
      if (!canvas || historyIndex <= 0) return
      const prevIndex = historyIndex - 1
      const entry = history[prevIndex]
      if (!canvas || !entry) return

      safeLoadFromJSON(canvas, entry.snapshot, () => {
        canvas.requestRenderAll()
        get().syncLayers()
      })
      set({ historyIndex: prevIndex })
    },

    redo: () => {
      const { canvas, history, historyIndex } = get()
      if (!canvas || historyIndex >= history.length - 1) return
      const nextIndex = historyIndex + 1
      const entry = history[nextIndex]
      safeLoadFromJSON(canvas, entry.snapshot, () => {
        canvas.requestRenderAll()
        get().syncLayers()
      })
      set({ historyIndex: nextIndex })
    },

    // ── Clipboard ─────────────────────────────────────────────────────────
    clipboard: null as fabric.Object | null,
    setClipboard: (clipboard) => set({ clipboard }),
  }))
)

// ─── Memoized Selectors ───────────────────────────────────────────────────────
// Each component should import only the selector it needs to avoid re-renders.

export const selectCanvas     = (s: CanvasStoreState) => s.canvas
export const selectActiveTool = (s: CanvasStoreState) => s.activeTool
export const selectZoom       = (s: CanvasStoreState) => s.zoom
export const selectLayers     = (s: CanvasStoreState) => s.layers
export const selectGrid       = (s: CanvasStoreState) => s.grid
export const selectSnap       = (s: CanvasStoreState) => s.snap
export const selectHistory    = (s: CanvasStoreState) => ({
  history: s.history,
  historyIndex: s.historyIndex,
  canUndo: s.historyIndex > 0,
  canRedo: s.historyIndex < s.history.length - 1,
})
export const selectCanvasSize        = (s: CanvasStoreState) => s.canvasSize
export const selectBackgroundColor   = (s: CanvasStoreState) => s.backgroundColor
export const selectSelectedLayerIds  = (s: CanvasStoreState) => s.selectedLayerIds
