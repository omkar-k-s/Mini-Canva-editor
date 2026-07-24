import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdLayers, MdGridView, MdHistory, MdTune,
} from 'react-icons/md'
import { useUiStore, selectActiveSidePanel } from '@/store/uiStore'
import { Tooltip } from '@/components/ui/Tooltip'
import LayersPanel from './LayersPanel'
import TemplatesPanel from './TemplatesPanel'
import HistoryPanel from './HistoryPanel'
import type { SidebarPanel } from '@/types/ui.types'

const PANELS: { id: SidebarPanel; label: string; icon: React.ReactNode }[] = [
  { id: 'layers',    label: 'Layers',    icon: <MdLayers className="w-5 h-5" />    },
  { id: 'templates', label: 'Templates', icon: <MdGridView className="w-5 h-5" />  },
  { id: 'history',   label: 'History',   icon: <MdHistory className="w-5 h-5" />   },
]

/**
 * SidebarPanel — right sidebar with tab navigation between Layers, Templates, and History.
 * Width is fixed at 240px. The active panel slides in with Framer Motion.
 */
const SidebarPanel = memo(() => {
  const activePanel = useUiStore(selectActiveSidePanel)
  const { setActiveSidePanel } = useUiStore()

  return (
    <aside className="w-60 h-full bg-editor-sidebar border-l border-canvas-border flex flex-col shrink-0 overflow-hidden">
      {/* Tab strip */}
      <div className="flex border-b border-canvas-border shrink-0">
        {PANELS.map((panel) => (
          <Tooltip key={panel.id} content={panel.label} side="bottom">
            <button
              onClick={() => setActiveSidePanel(panel.id)}
              aria-label={panel.label}
              className={[
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors relative',
                activePanel === panel.id
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-600',
              ].join(' ')}
            >
              {panel.icon}
              <span className="text-[10px]">{panel.label}</span>
              {activePanel === panel.id && (
                <motion.div
                  layoutId="sidebar-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                />
              )}
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {activePanel === 'layers'    && <LayersPanel />}
            {activePanel === 'templates' && <TemplatesPanel />}
            {activePanel === 'history'   && <HistoryPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  )
})

SidebarPanel.displayName = 'SidebarPanel'
export default SidebarPanel
