import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore } from '@/store/canvasStore'

const GUIDE_COLOR = 'rgba(99,102,241,0.8)'
const SNAP_THRESHOLD = 8

interface GuideLines {
  vertical: fabric.Line[]
  horizontal: fabric.Line[]
}

/**
 * useSnap — renders snap guidelines when objects are dragged near alignment points.
 * Guidelines are drawn as temporary Fabric.js Line objects and cleared on mouse:up.
 */
export function useSnap() {
  const { canvas, snap, canvasSize } = useCanvasStore()
  const guideRef = useRef<GuideLines>({ vertical: [], horizontal: [] })

  useEffect(() => {
    if (!canvas || !snap.enabled) return

    const clearGuides = () => {
      guideRef.current.vertical.forEach((l) => canvas.remove(l))
      guideRef.current.horizontal.forEach((l) => canvas.remove(l))
      guideRef.current = { vertical: [], horizontal: [] }
    }

    const onObjectMoving = (e: fabric.IEvent) => {
      const obj = e.target
      if (!obj) return

      clearGuides()

      const objLeft   = obj.left || 0
      const objTop    = obj.top  || 0
      const objWidth  = (obj.getScaledWidth  ? obj.getScaledWidth()  : obj.width  || 0)
      const objHeight = (obj.getScaledHeight ? obj.getScaledHeight() : obj.height || 0)
      const objCX     = objLeft + objWidth  / 2
      const objCY     = objTop  + objHeight / 2

      const W = canvasSize.width
      const H = canvasSize.height

      // Snap to canvas center vertical
      if (Math.abs(objCX - W / 2) < SNAP_THRESHOLD) {
        obj.set({ left: W / 2 - objWidth / 2 })
        const line = new fabric.Line([W / 2, 0, W / 2, H], {
          stroke: GUIDE_COLOR, strokeWidth: 1, selectable: false, evented: false,
          strokeDashArray: [4, 4],
        })
        canvas.add(line)
        guideRef.current.vertical.push(line)
      }

      // Snap to canvas center horizontal
      if (Math.abs(objCY - H / 2) < SNAP_THRESHOLD) {
        obj.set({ top: H / 2 - objHeight / 2 })
        const line = new fabric.Line([0, H / 2, W, H / 2], {
          stroke: GUIDE_COLOR, strokeWidth: 1, selectable: false, evented: false,
          strokeDashArray: [4, 4],
        })
        canvas.add(line)
        guideRef.current.horizontal.push(line)
      }

      canvas.requestRenderAll()
    }

    canvas.on('object:moving', onObjectMoving)
    canvas.on('mouse:up', () => {
      clearGuides()
      canvas.requestRenderAll()
    })

    return () => {
      canvas.off('object:moving', onObjectMoving as (e: fabric.IEvent) => void)
      clearGuides()
    }
  }, [canvas, snap.enabled, canvasSize])
}
