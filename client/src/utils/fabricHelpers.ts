import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'

// ─── Default style tokens ─────────────────────────────────────────────────────

const DEFAULT_FILL   = '#6366f1'
const DEFAULT_STROKE = 'transparent'
const DEFAULT_STROKE_WIDTH = 0

type FabricObjectWithId = fabric.Object & { id?: string; name?: string }

/**
 * Add a unique id and name to every Fabric object so we can track it in the
 * layers panel and history snapshots without collisions.
 */
export function assignObjectId(obj: fabric.Object, name?: string): void {
  const o = obj as FabricObjectWithId
  if (!o.id) o.id = uuidv4()
  if (!o.name) o.name = name || o.type || 'object'
}

// ─── Shape Factories ──────────────────────────────────────────────────────────

export function createRect(options?: fabric.IRectOptions): fabric.Rect {
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 200,
    height: 150,
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    rx: 8,
    ry: 8,
    ...options,
  })
  assignObjectId(rect, 'Rectangle')
  return rect
}

export function createCircle(options?: fabric.ICircleOptions): fabric.Circle {
  const circle = new fabric.Circle({
    left: 100,
    top: 100,
    radius: 80,
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    ...options,
  })
  assignObjectId(circle, 'Circle')
  return circle
}

export function createTriangle(options?: fabric.ITriangleOptions): fabric.Triangle {
  const tri = new fabric.Triangle({
    left: 100,
    top: 100,
    width: 150,
    height: 150,
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    ...options,
  })
  assignObjectId(tri, 'Triangle')
  return tri
}

export function createEllipse(options?: fabric.IEllipseOptions): fabric.Ellipse {
  const el = new fabric.Ellipse({
    left: 100,
    top: 100,
    rx: 100,
    ry: 60,
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    ...options,
  })
  assignObjectId(el, 'Ellipse')
  return el
}

export function createLine(options?: fabric.ILineOptions): fabric.Line {
  const line = new fabric.Line([50, 100, 250, 100], {
    stroke: DEFAULT_FILL,
    strokeWidth: 3,
    ...options,
  })
  assignObjectId(line, 'Line')
  return line
}

export function createArrow(
  canvas: fabric.Canvas,
  options?: Record<string, unknown>
): fabric.Group {
  const line = new fabric.Line([50, 100, 230, 100], {
    stroke: DEFAULT_FILL,
    strokeWidth: 3,
  })

  const arrowHead = new fabric.Triangle({
    left: 218,
    top: 91,
    width: 20,
    height: 20,
    fill: DEFAULT_FILL,
    angle: 90,
  })

  const group = new fabric.Group([line, arrowHead], {
    left: 100,
    top: 100,
    ...options,
  })
  assignObjectId(group, 'Arrow')
  return group
}

export function createStar(
  numPoints = 5,
  outerRadius = 80,
  innerRadius = 40,
  options?: fabric.IPolylineOptions
): fabric.Polygon {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < numPoints * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (Math.PI / numPoints) * i - Math.PI / 2
    points.push({
      x: Math.cos(angle) * radius + outerRadius,
      y: Math.sin(angle) * radius + outerRadius,
    })
  }
  const star = new fabric.Polygon(points, {
    left: 100,
    top: 100,
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    ...options,
  } as fabric.IPolylineOptions)
  assignObjectId(star, 'Star')
  return star
}

export function createPolygon(sides = 6, options?: fabric.IPolylineOptions): fabric.Polygon {
  const radius = 80
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
    points.push({
      x: Math.cos(angle) * radius + radius,
      y: Math.sin(angle) * radius + radius,
    })
  }
  const poly = new fabric.Polygon(points, {
    left: 100,
    top: 100,
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    ...options,
  } as fabric.IPolylineOptions)
  assignObjectId(poly, 'Polygon')
  return poly
}

// ─── Text Factories ───────────────────────────────────────────────────────────

export function createHeading(text = 'Heading', options?: fabric.ITextboxOptions): fabric.Textbox {
  const tb = new fabric.Textbox(text, {
    left: 100,
    top: 100,
    width: 400,
    fontSize: 56,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    fill: '#ffffff',
    ...options,
  })
  assignObjectId(tb, 'Heading')
  return tb
}

export function createSubheading(text = 'Subheading', options?: fabric.ITextboxOptions): fabric.Textbox {
  const tb = new fabric.Textbox(text, {
    left: 100,
    top: 100,
    width: 400,
    fontSize: 32,
    fontWeight: '600',
    fontFamily: 'Inter',
    fill: '#e2e8f0',
    ...options,
  })
  assignObjectId(tb, 'Subheading')
  return tb
}

export function createParagraph(text = 'Your text here', options?: fabric.ITextboxOptions): fabric.Textbox {
  const tb = new fabric.Textbox(text, {
    left: 100,
    top: 100,
    width: 400,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
    fill: '#94a3b8',
    ...options,
  })
  assignObjectId(tb, 'Paragraph')
  return tb
}

// ─── Canvas Helpers ───────────────────────────────────────────────────────────

/**
 * Sync the Zustand layers array from the current canvas object stack.
 * Call this after every canvas mutation.
 */
export function syncLayers(
  canvas: fabric.Canvas,
  setLayers: (layers: import('@/types/canvas.types').CanvasLayer[]) => void,
  selectedIds: string[]
): void {
  const objects = canvas.getObjects()
  const layers = [...objects].reverse().map((obj) => {
    const o = obj as FabricObjectWithId
    return {
      id: o.id || '',
      name: o.name || o.type || 'object',
      type: o.type || 'unknown',
      visible: obj.visible !== false,
      locked: !obj.selectable,
      selected: selectedIds.includes(o.id || ''),
      object: obj,
    }
  })
  setLayers(layers)
}

/**
 * Get a Fabric object by its custom `id` field.
 */
export function getObjectById(
  canvas: fabric.Canvas,
  id: string
): fabric.Object | null {
  return (
    canvas.getObjects().find((o) => (o as FabricObjectWithId).id === id) || null
  )
}

/**
 * Generate a thumbnail PNG data URL from the canvas.
 * Scales down to 400px wide for performance.
 */
export function generateThumbnail(canvas: fabric.Canvas): string {
  return canvas.toDataURL({
    format: 'jpeg',
    quality: 0.6,
    multiplier: 400 / canvas.getWidth(),
  })
}
