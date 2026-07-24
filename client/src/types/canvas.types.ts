import type { fabric } from 'fabric'

// ─── Canvas State ────────────────────────────────────────────────────────────

export type ToolType =
  | 'select'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'polygon'
  | 'star'
  | 'image'
  | 'pen'

export interface CanvasSize {
  width: number
  height: number
  label: string
}

export interface ZoomState {
  level: number
  minLevel: number
  maxLevel: number
}

export interface PanState {
  x: number
  y: number
}

export interface SnapSettings {
  enabled: boolean
  gridSize: number
  threshold: number
}

export interface GridSettings {
  visible: boolean
  size: number
  color: string
  opacity: number
}

// ─── Layer ───────────────────────────────────────────────────────────────────

export interface CanvasLayer {
  id: string
  name: string
  type: string
  visible: boolean
  locked: boolean
  selected: boolean
  object: fabric.Object
}

// ─── History ─────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string
  timestamp: number
  label: string
  snapshot: string // JSON serialized canvas state
}

// ─── Export ──────────────────────────────────────────────────────────────────

export type ExportFormat = 'png' | 'jpeg' | 'pdf'
export type ExportQuality = 'standard' | 'high' | 'ultra'

export interface ExportOptions {
  format: ExportFormat
  quality: ExportQuality
  multiplier: number
  transparentBackground: boolean
  filename: string
}

// ─── Object Properties ───────────────────────────────────────────────────────

export interface TextProperties {
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: string
  fontStyle: 'normal' | 'italic'
  underline: boolean
  linethrough: boolean
  textAlign: 'left' | 'center' | 'right' | 'justify'
  fill: string
  charSpacing: number
  lineHeight: number
  opacity: number
  angle: number
  shadow: fabric.IShadowOptions | null
  stroke: string | null
  strokeWidth: number
}

export interface ShapeProperties {
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  angle: number
  rx?: number
  ry?: number
  shadow: fabric.IShadowOptions | null
}

export interface ImageProperties {
  src: string
  opacity: number
  angle: number
  flipX: boolean
  flipY: boolean
  brightness: number
  contrast: number
  blur: number
  grayscale: boolean
  sepia: boolean
  rx?: number
}

export type ObjectProperties = TextProperties | ShapeProperties | ImageProperties

// ─── Canvas Store State ───────────────────────────────────────────────────────

export interface CanvasStoreState {
  // Canvas instance
  canvas: fabric.Canvas | null
  setCanvas: (canvas: fabric.Canvas | null) => void

  // Active tool
  activeTool: ToolType
  setActiveTool: (tool: ToolType) => void

  // Canvas dimensions
  canvasSize: CanvasSize
  setCanvasSize: (size: CanvasSize) => void

  // Canvas background
  backgroundColor: string
  setBackgroundColor: (color: string) => void

  // Zoom
  zoom: number
  setZoom: (zoom: number) => void

  // Grid
  grid: GridSettings
  setGrid: (grid: Partial<GridSettings>) => void

  // Snap
  snap: SnapSettings
  setSnap: (snap: Partial<SnapSettings>) => void

  // Layers
  layers: CanvasLayer[]
  setLayers: (layers: CanvasLayer[]) => void
  selectedLayerIds: string[]
  setSelectedLayerIds: (ids: string[]) => void

  // History
  history: HistoryEntry[]
  historyIndex: number
  pushHistory: (entry: HistoryEntry) => void
  undo: () => void
  redo: () => void

  // Clipboard
  clipboard: fabric.Object | null
  setClipboard: (obj: fabric.Object | null) => void
}
