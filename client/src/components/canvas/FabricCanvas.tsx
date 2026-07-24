import React, { useRef, useEffect, memo, useCallback } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { useUiStore } from '@/store/uiStore'
import { useFabric } from '@/hooks/useFabric'
import { useSnap } from '@/hooks/useSnap'
import {
  createRect, createCircle, createTriangle, createEllipse,
  createLine, createArrow, createStar, createPolygon,
  createHeading, createSubheading, createParagraph,
} from '@/utils/fabricHelpers'
import { fabric } from 'fabric'

/**
 * FabricCanvas — the main canvas component.
 *
 * Responsibilities:
 * 1. Renders the <canvas> element that Fabric.js attaches to
 * 2. Delegates canvas init to useFabric hook
 * 3. Handles tool-driven click-to-draw interactions
 * 4. Applies zoom/pan wrapper
 *
 * The canvas element itself is intentionally kept dumb — all logic lives
 * in hooks to keep this component lean and avoid re-renders.
 */
const FabricCanvas = memo(() => {
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { canvas, activeTool, setActiveTool, canvasSize, zoom } = useCanvasStore()
  const { hideContextMenu } = useUiStore()

  // Initialize Fabric and bind all event listeners
  useFabric(canvasElRef)
  useSnap()

  // ── Tool-driven drawing ───────────────────────────────────────────────────
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvas) return
      if (activeTool === 'select') return

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
      const clickX = (e.clientX - rect.left) / zoom
      const clickY = (e.clientY - rect.top)  / zoom

      let obj: fabric.Object | null = null

      switch (activeTool) {
        case 'rectangle': obj = createRect({ left: clickX, top: clickY }); break
        case 'circle':    obj = createCircle({ left: clickX, top: clickY }); break
        case 'triangle':  obj = createTriangle({ left: clickX, top: clickY }); break
        case 'ellipse':   obj = createEllipse({ left: clickX, top: clickY }); break
        case 'line':      obj = createLine(); break
        case 'arrow':     obj = createArrow(canvas); break
        case 'star':      obj = createStar(); break
        case 'polygon':   obj = createPolygon(); break
        case 'text':      obj = createHeading('Click to edit', { left: clickX, top: clickY }); break
        default: break
      }

      if (obj) {
        canvas.add(obj)
        canvas.setActiveObject(obj)
        canvas.requestRenderAll()
        setActiveTool('select') // Return to select after placing
      }
    },
    [canvas, activeTool, zoom, setActiveTool]
  )

  // ── Right-click context menu ──────────────────────────────────────────────
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      // Context menu is handled by the ContextMenu component listening to store
    },
    []
  )

  // ── Wheel zoom ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvas) return

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const { setZoom, zoom } = useCanvasStore.getState()
      setZoom(Math.max(0.1, Math.min(5, zoom + delta)))
    }

    const el = canvasElRef.current?.parentElement
    el?.addEventListener('wheel', handleWheel, { passive: false })
    return () => el?.removeEventListener('wheel', handleWheel)
  }, [canvas])

  // ── Cursor style based on active tool ────────────────────────────────────
  const cursorStyle: Record<string, string> = {
    select: 'default',
    text: 'text',
    rectangle: 'crosshair',
    circle: 'crosshair',
    triangle: 'crosshair',
    ellipse: 'crosshair',
    line: 'crosshair',
    arrow: 'crosshair',
    star: 'crosshair',
    polygon: 'crosshair',
    image: 'copy',
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto flex items-start justify-start p-8 bg-[#111118]"
      onClick={hideContextMenu}
      onContextMenu={handleContextMenu}
    >
      {/* Canvas shadow + centering wrapper */}
      <div
        className="relative shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_64px_rgba(0,0,0,0.8)]"
        style={{
          width:  canvasSize.width  * zoom,
          height: canvasSize.height * zoom,
          cursor: cursorStyle[activeTool] || 'default',
        }}
        onClick={handleCanvasClick}
        onContextMenu={handleContextMenu}
      >
        <canvas ref={canvasElRef} id="main-canvas" />
      </div>
    </div>
  )
})

FabricCanvas.displayName = 'FabricCanvas'
export default FabricCanvas
