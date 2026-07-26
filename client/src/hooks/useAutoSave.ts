import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { safeLoadFromJSON } from '@/utils/fabricHelpers'

const AUTOSAVE_KEY = 'mini-canva-autosave'
const AUTOSAVE_INTERVAL = 3000 // 3 seconds

/**
 * useAutoSave — periodically snapshots the canvas to LocalStorage.
 * On mount, restores the last saved state if no project is explicitly loaded.
 */
export function useAutoSave(projectId?: string) {
  const { canvas } = useCanvasStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Save to localStorage ──────────────────────────────────────────────────
  useEffect(() => {
    if (!canvas) return

    intervalRef.current = setInterval(() => {
      try {
        const json = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable']))
        const key = projectId ? `${AUTOSAVE_KEY}-${projectId}` : AUTOSAVE_KEY
        localStorage.setItem(key, json)
        localStorage.setItem(`${key}-timestamp`, Date.now().toString())
      } catch (e) {
        // localStorage quota exceeded — silently skip
        console.warn('[AutoSave] Could not save:', e)
      }
    }, AUTOSAVE_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [canvas, projectId])

  // ── Restore from localStorage ─────────────────────────────────────────────
  const restore = () => {
    if (!canvas) return false
    const key = projectId ? `${AUTOSAVE_KEY}-${projectId}` : AUTOSAVE_KEY
    const saved = localStorage.getItem(key)
    if (!saved) return false

    try {
      safeLoadFromJSON(canvas, saved, () => {
        canvas.requestRenderAll()
      })
      return true
    } catch {
      return false
    }
  }

  const clearSave = (id?: string) => {
    const key = id ? `${AUTOSAVE_KEY}-${id}` : AUTOSAVE_KEY
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}-timestamp`)
  }

  const getSaveTimestamp = (id?: string): number | null => {
    const key = id ? `${AUTOSAVE_KEY}-${id}` : AUTOSAVE_KEY
    const ts = localStorage.getItem(`${key}-timestamp`)
    return ts ? parseInt(ts) : null
  }

  return { restore, clearSave, getSaveTimestamp }
}
