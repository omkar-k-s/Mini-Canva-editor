import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MdUndo, MdRedo, MdSave, MdFileDownload, MdGridOn, MdGridOff,
  MdZoomIn, MdZoomOut, MdHome, MdAdd, MdCenterFocusStrong,
} from 'react-icons/md'
import { useCanvasStore, selectHistory, selectZoom, selectGrid } from '@/store/canvasStore'
import { useShallow } from 'zustand/react/shallow'
import { useUiStore } from '@/store/uiStore'
import { useProjectStore, selectIsSaving } from '@/store/projectStore'
import { useAuthStore, selectIsAuthenticated } from '@/store/authStore'
import { projectService } from '@/services/projectService'
import { generateThumbnail, prepareCanvasForSave } from '@/utils/fabricHelpers'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import toast from 'react-hot-toast'

/**
 * Top Toolbar — file operations, undo/redo, zoom, grid toggle, export.
 */
const TopToolbar = memo(() => {
  const navigate = useNavigate()

  // Granular Zustand selectors — only re-render when the specific value changes
  const { canUndo, canRedo } = useCanvasStore(useShallow(selectHistory))
  const zoom   = useCanvasStore(selectZoom)
  const grid   = useCanvasStore(selectGrid)
  const { undo, redo, canvas, canvasSize, backgroundColor, setZoom, setGrid } = useCanvasStore()
  const { openDialog } = useUiStore()
  const isSaving = useProjectStore(selectIsSaving)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const { currentProject, setSaving, updateProjectInList } = useProjectStore()

  // ── Save project ──────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!canvas) return

    if (!isAuthenticated) {
      toast('Sign in to save projects to the cloud', { icon: '🔐' })
      return
    }

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
        // Fallback to empty thumbnail if it fails, don't block saving
        console.error('Thumbnail generation failed', e)
      }

      if (currentProject && currentProject._id) {
        await projectService.update(currentProject._id, {
          canvasData,
          thumbnail,
          canvasWidth:  canvasSize.width,
          canvasHeight: canvasSize.height,
          backgroundColor,
        })
        updateProjectInList(currentProject._id, { thumbnail, updatedAt: new Date().toISOString() })
        toast.success('Project saved!')
      } else {
        openDialog('saveProjectDialog')
      }
    } catch (err: any) {
      console.error('[Save Error]', err, err.response?.data)
      // Print the stack trace's first important line if available to help debugging
      const debugInfo = err.stack ? err.stack.split('\\n').slice(0, 2).join(' ') : err.message
      toast.error('Failed to save: ' + (err.response?.data?.message || debugInfo))
    } finally {
      setSaving(false)
    }
  }, [canvas, isAuthenticated, currentProject, canvasSize, backgroundColor, setSaving, updateProjectInList, openDialog])

  // ── Zoom controls ─────────────────────────────────────────────────────────
  const zoomIn  = useCallback(() => setZoom(Math.min(5, zoom + 0.25)), [zoom, setZoom])
  const zoomOut = useCallback(() => setZoom(Math.max(0.1, zoom - 0.25)), [zoom, setZoom])
  const resetZoom = useCallback(() => setZoom(1), [setZoom])

  return (
    <header className="h-12 bg-editor-toolbar border-b border-canvas-border flex items-center px-3 gap-2 shrink-0 z-20">
      {/* Logo / Home */}
      <Tooltip content="Dashboard" side="bottom">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} aria-label="Go to Dashboard">
          <MdHome className="w-4 h-4" />
        </Button>
      </Tooltip>

      <div className="w-px h-5 bg-canvas-border mx-1" />

      {/* Brand */}
      <span className="text-sm font-bold bg-gradient-brand bg-clip-text text-transparent select-none mr-2">
        Mini Canva
      </span>

      <div className="w-px h-5 bg-canvas-border mx-1" />

      {/* Undo / Redo */}
      <Tooltip content="Undo (Ctrl+Z)" side="bottom">
        <Button variant="ghost" size="sm" disabled={!canUndo} onClick={undo} aria-label="Undo">
          <MdUndo className="w-4 h-4" />
        </Button>
      </Tooltip>
      <Tooltip content="Redo (Ctrl+Shift+Z)" side="bottom">
        <Button variant="ghost" size="sm" disabled={!canRedo} onClick={redo} aria-label="Redo">
          <MdRedo className="w-4 h-4" />
        </Button>
      </Tooltip>

      <div className="w-px h-5 bg-canvas-border mx-1" />

      {/* Grid toggle */}
      <Tooltip content={grid.visible ? 'Hide Grid' : 'Show Grid'} side="bottom">
        <Button
          variant={grid.visible ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setGrid({ visible: !grid.visible })}
          aria-label="Toggle grid"
        >
          {grid.visible ? <MdGridOn className="w-4 h-4" /> : <MdGridOff className="w-4 h-4" />}
        </Button>
      </Tooltip>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1 bg-editor-input rounded-xl px-2 py-1">
        <Tooltip content="Zoom out (Ctrl+-)" side="bottom">
          <button onClick={zoomOut} className="text-slate-500 hover:text-slate-900 transition-colors p-1" aria-label="Zoom out">
            <MdZoomOut className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip content="Reset zoom (Ctrl+0)" side="bottom">
          <button
            onClick={resetZoom}
            className="text-xs text-slate-600 hover:text-slate-900 min-w-[44px] text-center transition-colors"
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
        </Tooltip>
        <Tooltip content="Zoom in (Ctrl+=)" side="bottom">
          <button onClick={zoomIn} className="text-slate-500 hover:text-slate-900 transition-colors p-1" aria-label="Zoom in">
            <MdZoomIn className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      <div className="w-px h-5 bg-canvas-border mx-1" />

      {/* Export */}
      <Tooltip content="Export design" side="bottom">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openDialog('exportDialog')}
          icon={<MdFileDownload className="w-4 h-4" />}
          aria-label="Export"
        >
          Export
        </Button>
      </Tooltip>

      {/* Save */}
      <Tooltip content="Save project (Ctrl+S)" side="bottom">
        <Button
          variant="primary"
          size="sm"
          loading={isSaving}
          onClick={handleSave}
          icon={<MdSave className="w-4 h-4" />}
          aria-label="Save project"
        >
          Save
        </Button>
      </Tooltip>
    </header>
  )
})

TopToolbar.displayName = 'TopToolbar'
export default TopToolbar
