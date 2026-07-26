import React, { memo, useState, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUiStore } from '@/store/uiStore'
import { useCanvasStore } from '@/store/canvasStore'
import { useProjectStore } from '@/store/projectStore'
import { projectService } from '@/services/projectService'
import { generateThumbnail, prepareCanvasForSave } from '@/utils/fabricHelpers'
import { CANVAS_SIZES } from '@/constants/canvasSizes'
import toast from 'react-hot-toast'
import type { CanvasSize } from '@/types/canvas.types'

/**
 * SaveProjectDialog — shown when the user clicks Save on a new (unsaved) project.
 */
const SaveProjectDialog = memo(() => {
  const { dialogs, closeDialog } = useUiStore()
  const { canvas, canvasSize, backgroundColor, setCanvasSize } = useCanvasStore()
  const { setSaving, addProject, setCurrentProject } = useProjectStore()

  const [title,       setTitle]       = useState('Untitled Design')
  const [description, setDescription] = useState('')
  const [isSaving,    setIsSaving]    = useState(false)

  const handleSave = useCallback(async () => {
    if (!canvas || !title.trim()) return
    setIsSaving(true)
    setSaving(true)

    try {
      prepareCanvasForSave(canvas)

      // Wait a tick for fabric to fully exit text editing mode
      await new Promise(resolve => setTimeout(resolve, 50))

      let canvasData = ''
      try {
        canvasData = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable']))
      } catch (e: any) {
        throw new Error('Canvas toJSON failed: ' + e.message)
      }

      let thumbnail = ''
      try {
        thumbnail = generateThumbnail(canvas)
      } catch (e: any) {
        console.error('Thumbnail generation failed', e)
      }

      const project = await projectService.create({
        title: title.trim(),
        description: description.trim(),
        canvasData,
        thumbnail,
        canvasWidth:  canvasSize.width,
        canvasHeight: canvasSize.height,
        backgroundColor,
      })

      setCurrentProject(project)
      addProject({
        _id:             project._id,
        title:           project.title,
        thumbnail,
        canvasWidth:     project.canvasWidth,
        canvasHeight:    project.canvasHeight,
        backgroundColor: project.backgroundColor,
        updatedAt:       project.updatedAt,
      })

      toast.success('Project saved!')
      closeDialog('saveProjectDialog')
    } catch (err: any) {
      console.error('[SaveProjectDialog Error]', err, err.response?.data)
      const debugInfo = err.stack ? err.stack.split('\\n').slice(0, 2).join(' ') : err.message
      toast.error('Failed to save: ' + (err.response?.data?.message || debugInfo))
    } finally {
      setIsSaving(false)
      setSaving(false)
    }
  }, [canvas, title, description, canvasSize, backgroundColor, setSaving, addProject, setCurrentProject, closeDialog])

  return (
    <Modal
      isOpen={dialogs.saveProjectDialog}
      onClose={() => closeDialog('saveProjectDialog')}
      title="Save Project"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <Input
          label="Project name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome design"
          id="save-project-title"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-500" htmlFor="save-project-desc">Description (optional)</label>
          <textarea
            id="save-project-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this design for?"
            rows={3}
            className="bg-editor-input border border-canvas-border rounded-lg text-sm text-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="ghost" className="flex-1" onClick={() => closeDialog('saveProjectDialog')}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" loading={isSaving} onClick={handleSave} aria-label="Save project">
            Save Project
          </Button>
        </div>
      </div>
    </Modal>
  )
})

SaveProjectDialog.displayName = 'SaveProjectDialog'
export default SaveProjectDialog
