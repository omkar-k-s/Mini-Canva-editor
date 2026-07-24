import React, { Suspense, lazy, memo } from 'react'
import TopToolbar from '@/components/toolbar/TopToolbar'
import LeftToolbar from '@/components/toolbar/LeftToolbar'
import SidebarPanel from '@/components/panels/SidebarPanel'
import FabricCanvas from '@/components/canvas/FabricCanvas'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useAutoSave } from '@/hooks/useAutoSave'

// Dialogs are lazy-loaded — they're heavy and only needed occasionally
const PropertiesPanel = lazy(() => import('@/components/panels/PropertiesPanel'))
const ExportDialog    = lazy(() => import('@/components/dialogs/ExportDialog'))
const SaveProjectDialog = lazy(() => import('@/components/dialogs/SaveProjectDialog'))

/**
 * EditorLayout — the main editor chrome.
 *
 * Layout: TopToolbar / [LeftToolbar | Canvas | [PropertiesPanel | SidebarPanel]]
 *
 * Performance:
 * - All panels are memoized
 * - Dialogs are lazy-loaded
 * - The canvas area takes all remaining space via flexbox
 */
const EditorLayout = memo(() => {
  // Register global keyboard shortcuts
  useKeyboard()

  // AutoSave runs silently in the background
  useAutoSave()

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-canvas-bg select-none">
      {/* Top bar */}
      <TopToolbar />

      {/* Main area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left tool strip */}
        <LeftToolbar />

        {/* Canvas */}
        <FabricCanvas />

        {/* Right panels */}
        <div className="flex flex-col w-60 shrink-0 border-l border-canvas-border overflow-hidden">
          {/* Context-aware properties */}
          <div className="flex-shrink-0 border-b border-canvas-border overflow-y-auto max-h-[50%]">
            <Suspense fallback={<div className="p-4"><LoadingSpinner size="sm" /></div>}>
              <PropertiesPanel />
            </Suspense>
          </div>

          {/* Layers / Templates / History */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <SidebarPanel />
          </div>
        </div>
      </div>

      {/* Lazy-loaded dialogs */}
      <Suspense fallback={null}>
        <ExportDialog />
        <SaveProjectDialog />
      </Suspense>
    </div>
  )
})

EditorLayout.displayName = 'EditorLayout'
export default EditorLayout
