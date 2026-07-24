import { useEffect, useRef, useCallback } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore } from '@/store/canvasStore'
import { useUiStore } from '@/store/uiStore'
import { syncLayers, assignObjectId, getObjectById } from '@/utils/fabricHelpers'
import { rafThrottle, debounce } from '@/utils/debounce'
import type { CanvasLayer } from '@/types/canvas.types'
import { v4 as uuidv4 } from 'uuid'

/**
 * useFabric — initializes the Fabric.js canvas, binds all event listeners,
 * and syncs canvas state to Zustand on every mutation.
 *
 * Performance strategy:
 * - object:moving and mouse:move are RAF-throttled (one update per frame)
 * - renderAll is batched and only called when needed
 * - Selection events update Zustand only (no re-render of canvas itself)
 */
export function useFabric(canvasElRef: React.RefObject<HTMLCanvasElement | null>) {
  const {
    canvas, setCanvas,
    setLayers, setSelectedLayerIds,
    pushHistory, backgroundColor,
    canvasSize, zoom, setZoom,
    snap,
  } = useCanvasStore()

  const historyPauseRef = useRef(false)

  // ── Initialize Fabric canvas ──────────────────────────────────────────────
  useEffect(() => {
    if (!canvasElRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasElRef.current, {
      width:            canvasSize.width,
      height:           canvasSize.height,
      backgroundColor:  backgroundColor,
      preserveObjectStacking: true,
      selection:        true,
      renderOnAddRemove: false, // batch render manually for perf
      enableRetinaScaling: true,
      stopContextMenu: true,
    })

    // Retina / HiDPI support
    const dpr = window.devicePixelRatio || 1
    fabricCanvas.setDimensions(
      { width: canvasSize.width, height: canvasSize.height },
      { backstoreOnly: true }
    )
    fabricCanvas.setZoom(dpr)

    setCanvas(fabricCanvas)

    return () => {
      fabricCanvas.dispose()
      setCanvas(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Sync background color ─────────────────────────────────────────────────
  useEffect(() => {
    if (!canvas) return
    canvas.setBackgroundColor(backgroundColor, () => canvas.requestRenderAll())
  }, [canvas, backgroundColor])

  // ── Sync canvas size ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvas) return
    canvas.setWidth(canvasSize.width)
    canvas.setHeight(canvasSize.height)
    canvas.requestRenderAll()
  }, [canvas, canvasSize])

  // ── Sync zoom level ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvas) return
    canvas.setZoom(zoom)
    canvas.requestRenderAll()
  }, [canvas, zoom])

  // ── Event binding ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvas) return

    // Helper: snapshot history (debounced to avoid flooding history during mass operations)
    const snapshotHistory = debounce((label: string) => {
      if (historyPauseRef.current) return
      pushHistory({
        id: uuidv4(),
        timestamp: Date.now(),
        label,
        snapshot: JSON.stringify(canvas.toJSON(['id', 'name', 'selectable'])),
      })
    }, 200)

    // Helper: sync layers from canvas to Zustand (debounced to avoid React update limits during loadFromJSON)
    const syncLayersFromCanvas = debounce(() => {
      const activeObjects = canvas.getActiveObjects()
      const ids = activeObjects.map((o) => (o as fabric.Object & { id?: string }).id || '')
      syncLayers(canvas, setLayers, ids)
    }, 50)

    // RAF-throttled drag update
    const onObjectMoving = rafThrottle(() => {
      // Snap to grid
      if (snap.enabled) {
        const obj = canvas.getActiveObject()
        if (obj) {
          const gs = snap.gridSize
          obj.set({
            left: Math.round((obj.left || 0) / gs) * gs,
            top:  Math.round((obj.top  || 0) / gs) * gs,
          })
        }
      }
      canvas.requestRenderAll()
    })

    // Assign IDs on add
    canvas.on('object:added', (e) => {
      if (e.target) {
        assignObjectId(e.target)
        canvas.requestRenderAll()
        syncLayersFromCanvas()
        snapshotHistory('Object added')
      }
    })

    canvas.on('object:removed', () => {
      syncLayersFromCanvas()
      snapshotHistory('Object removed')
    })

    canvas.on('object:modified', () => {
      syncLayersFromCanvas()
      snapshotHistory('Object modified')
    })

    canvas.on('object:moving',  onObjectMoving)
    canvas.on('object:scaling', onObjectMoving)
    canvas.on('object:rotating', onObjectMoving)

    canvas.on('selection:created', syncLayersFromCanvas)
    canvas.on('selection:updated', syncLayersFromCanvas)
    canvas.on('selection:cleared', syncLayersFromCanvas)

    // Initial render
    canvas.requestRenderAll()

    return () => {
      canvas.off('object:added')
      canvas.off('object:removed')
      canvas.off('object:modified')
      canvas.off('object:moving')
      canvas.off('object:scaling')
      canvas.off('object:rotating')
      canvas.off('selection:created')
      canvas.off('selection:updated')
      canvas.off('selection:cleared')
    }
  }, [canvas, pushHistory, setLayers, setSelectedLayerIds, snap])
}
