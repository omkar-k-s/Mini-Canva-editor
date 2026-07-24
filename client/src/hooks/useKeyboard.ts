import { useEffect, useCallback } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore } from '@/store/canvasStore'
import { useUiStore } from '@/store/uiStore'

/**
 * useKeyboard — binds global keyboard shortcuts to canvas actions.
 * All handlers are cleaned up on unmount.
 */
export function useKeyboard() {
  const {
    canvas,
    activeTool, setActiveTool,
    clipboard, setClipboard,
    undo, redo,
    zoom, setZoom,
  } = useCanvasStore()
  const { openDialog } = useUiStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!canvas) return

      // Don't intercept when typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      const ctrl = e.ctrlKey || e.metaKey

      // ── Delete ───────────────────────────────────────────────────────────
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObjects()
        if (active.length > 0) {
          active.forEach((obj) => canvas.remove(obj))
          canvas.discardActiveObject()
          canvas.requestRenderAll()
        }
        return
      }

      // ── Escape ────────────────────────────────────────────────────────────
      if (e.key === 'Escape') {
        canvas.discardActiveObject()
        canvas.requestRenderAll()
        setActiveTool('select')
        return
      }

      // ── Copy ──────────────────────────────────────────────────────────────
      if (ctrl && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        const active = canvas.getActiveObject()
        if (active) {
          active.clone((cloned: fabric.Object) => setClipboard(cloned))
        }
        return
      }

      // ── Paste ─────────────────────────────────────────────────────────────
      if (ctrl && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        if (clipboard) {
          clipboard.clone((cloned: any) => {
            canvas.discardActiveObject()
            cloned.set({
              left: (cloned.left || 0) + 20,
              top: (cloned.top || 0) + 20,
              evented: true,
            })
            delete cloned.id

            if (cloned.type === 'activeSelection') {
              cloned.canvas = canvas
              cloned.forEachObject((obj: any) => canvas.add(obj))
              cloned.setCoords()
            } else {
              canvas.add(cloned)
            }

            clipboard.top = (clipboard.top || 0) + 20
            clipboard.left = (clipboard.left || 0) + 20

            canvas.setActiveObject(cloned)
            canvas.requestRenderAll()
          })
        }
        return
      }

      // ── Duplicate ─────────────────────────────────────────────────────────
      if (ctrl && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        const active = canvas.getActiveObject()
        if (active) {
          active.clone((cloned: any) => {
            canvas.discardActiveObject()
            cloned.set({
              left: (cloned.left || 0) + 20,
              top: (cloned.top || 0) + 20,
              evented: true,
            })
            delete cloned.id
            if (cloned.type === 'activeSelection') {
              cloned.canvas = canvas
              cloned.forEachObject((obj: any) => canvas.add(obj))
              cloned.setCoords()
            } else {
              canvas.add(cloned)
            }
            canvas.setActiveObject(cloned)
            canvas.requestRenderAll()
          })
        }
        return
      }

      // ── Undo ──────────────────────────────────────────────────────────────
      if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }

      // ── Redo ──────────────────────────────────────────────────────────────
      if (ctrl && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
        return
      }

      // ── Select all ────────────────────────────────────────────────────────
      if (ctrl && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        canvas.discardActiveObject()
        const allObjects = canvas.getObjects()
        const selection = new fabric.ActiveSelection(allObjects, { canvas })
        canvas.setActiveObject(selection)
        canvas.requestRenderAll()
        return
      }

      // ── Group ─────────────────────────────────────────────────────────────
      if (ctrl && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        e.preventDefault()
        const active = canvas.getActiveObject()
        if (active && active.type === 'activeSelection') {
          const group = (active as fabric.ActiveSelection).toGroup()
          canvas.requestRenderAll()
        }
        return
      }

      // ── Ungroup ───────────────────────────────────────────────────────────
      if (ctrl && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault()
        const active = canvas.getActiveObject()
        if (active && active.type === 'group') {
          (active as fabric.Group).toActiveSelection()
          canvas.requestRenderAll()
        }
        return
      }

      // ── Zoom ──────────────────────────────────────────────────────────────
      if (ctrl && e.key === '=') { e.preventDefault(); setZoom(zoom + 0.1); return }
      if (ctrl && e.key === '-') { e.preventDefault(); setZoom(zoom - 0.1); return }
      if (ctrl && e.key === '0') { e.preventDefault(); setZoom(1);          return }

      // ── Layer order ───────────────────────────────────────────────────────
      if (ctrl && e.key === ']') {
        e.preventDefault()
        canvas.getActiveObjects().forEach((o) => canvas.bringForward(o))
        canvas.requestRenderAll()
        return
      }
      if (ctrl && e.key === '[') {
        e.preventDefault()
        canvas.getActiveObjects().forEach((o) => canvas.sendBackwards(o))
        canvas.requestRenderAll()
        return
      }

      // ── Arrow nudge ───────────────────────────────────────────────────────
      const nudge = e.shiftKey ? 10 : 1
      const active = canvas.getActiveObject()
      if (!active) return

      if (e.key === 'ArrowLeft')  { e.preventDefault(); active.set({ left: (active.left || 0) - nudge }); canvas.requestRenderAll() }
      if (e.key === 'ArrowRight') { e.preventDefault(); active.set({ left: (active.left || 0) + nudge }); canvas.requestRenderAll() }
      if (e.key === 'ArrowUp')    { e.preventDefault(); active.set({ top: (active.top   || 0) - nudge }); canvas.requestRenderAll() }
      if (e.key === 'ArrowDown')  { e.preventDefault(); active.set({ top: (active.top   || 0) + nudge }); canvas.requestRenderAll() }
    },
    [canvas, clipboard, setClipboard, undo, redo, zoom, setZoom, setActiveTool, openDialog]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
