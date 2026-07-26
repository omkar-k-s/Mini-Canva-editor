import React, { memo, useEffect } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { useProjectStore } from '@/store/projectStore'
import { useAutoSave } from '@/hooks/useAutoSave'
import EditorLayout from '@/components/layout/EditorLayout'
import { fabric } from 'fabric'
import { safeLoadFromJSON } from '@/utils/fabricHelpers'

/**
 * EditorPage — sets up canvas state then renders EditorLayout.
 * Also handles loading an existing project (passed via store) onto the canvas.
 */
const EditorPage = memo(() => {
  const { canvas, canvasSize, setCanvasSize, setBackgroundColor } = useCanvasStore()
  const { currentProject } = useProjectStore()
  const { restore } = useAutoSave(currentProject?._id)

  // Load existing project data when canvas is ready
  useEffect(() => {
    if (!canvas) return

    if (currentProject) {
      // Load project from cloud
      try {
        safeLoadFromJSON(canvas, currentProject.canvasData, () => {
          canvas.requestRenderAll()
        })
        setCanvasSize({
          width:  currentProject.canvasWidth,
          height: currentProject.canvasHeight,
          label:  currentProject.title,
        })
        setBackgroundColor(currentProject.backgroundColor)
      } catch (e) {
        console.error('[Editor] Failed to load project:', e)
      }
    } else {
      // Attempt autosave restore for new canvas
      const restored = restore()
      if (!restored) {
        // Fresh canvas — nothing to do
      }
    }
  }, [canvas, currentProject]) // eslint-disable-line react-hooks/exhaustive-deps

  return <EditorLayout />
})

EditorPage.displayName = 'EditorPage'
export default EditorPage
