import type { CanvasSize } from '@/types/canvas.types'

export const CANVAS_SIZES: CanvasSize[] = [
  { width: 1080, height: 1080, label: 'Instagram Post (1:1)' },
  { width: 1080, height: 1920, label: 'Instagram Story (9:16)' },
  { width: 1200, height: 630,  label: 'Facebook Post' },
  { width: 1500, height: 500,  label: 'Twitter/X Header' },
  { width: 1280, height: 720,  label: 'YouTube Thumbnail (16:9)' },
  { width: 2480, height: 3508, label: 'A4 Poster (Portrait)' },
  { width: 3508, height: 2480, label: 'A4 Poster (Landscape)' },
  { width: 816,  height: 1056, label: 'US Letter (Portrait)' },
  { width: 1056, height: 816,  label: 'US Letter (Landscape)' },
  { width: 1080, height: 1350, label: 'Certificate (4:5)' },
  { width: 1050, height: 600,  label: 'Resume Page' },
  { width: 1050, height: 600,  label: 'Business Card' },
  { width: 800,  height: 800,  label: 'Custom Square' },
]

export const DEFAULT_CANVAS_SIZE = CANVAS_SIZES[0]
