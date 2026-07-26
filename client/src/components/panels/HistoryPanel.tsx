import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdHistory, MdRestoreFromTrash } from 'react-icons/md'
import { safeLoadFromJSON } from '@/utils/fabricHelpers'
import { useCanvasStore, selectHistory } from '@/store/canvasStore'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/Button'

/**
 * HistoryPanel — visual list of undo/redo history entries.
 * Clicking an entry restores canvas to that state.
 */
const HistoryPanel = memo(() => {
  const { history, historyIndex, canvas } = {
    ...useCanvasStore(useShallow(selectHistory)),
    canvas: useCanvasStore(s => s.canvas),
  }

  const restoreToIndex = useCallback((index: number) => {
    if (!canvas) return
    const entry = history[index]
    safeLoadFromJSON(canvas, entry.snapshot, () => {
      canvas.requestRenderAll()
    })
    useCanvasStore.setState({ historyIndex: index })
  }, [canvas, history])

  const clearHistory = useCallback(() => {
    useCanvasStore.setState({ history: [], historyIndex: -1 })
  }, [])

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <MdHistory className="w-8 h-8 text-slate-600 mb-3" />
        <p className="text-sm text-slate-500">No history yet</p>
        <p className="text-xs text-slate-500 mt-1">Changes will appear here</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-canvas-border">
        <span className="text-xs text-slate-500">{history.length} states</span>
        <Button size="xs" variant="ghost" onClick={clearHistory} icon={<MdRestoreFromTrash />}>
          Clear
        </Button>
      </div>

      <div className="flex flex-col">
        {[...history].reverse().map((entry, i) => {
          const realIndex = history.length - 1 - i
          const isCurrent = realIndex === historyIndex
          const isFuture  = realIndex > historyIndex

          return (
            <motion.button
              key={entry.id}
              onClick={() => restoreToIndex(realIndex)}
              whileHover={{ x: 2 }}
              className={[
                'flex items-center gap-2 px-3 py-2 text-left transition-colors',
                isCurrent  ? 'bg-primary-600/20 border-l-2 border-primary-500' : '',
                isFuture   ? 'opacity-40' : '',
                !isCurrent ? 'hover:bg-canvas-hover border-l-2 border-transparent' : '',
              ].join(' ')}
              aria-label={`Restore to: ${entry.label}`}
            >
              <MdHistory className={['w-3.5 h-3.5 shrink-0', isCurrent ? 'text-primary-400' : 'text-slate-600'].join(' ')} />
              <div className="flex-1 min-w-0">
                <p className={['text-xs truncate', isCurrent ? 'text-slate-900 font-medium' : 'text-slate-500'].join(' ')}>
                  {entry.label}
                </p>
                <p className="text-xs text-slate-600">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {isCurrent && (
                <span className="text-[10px] bg-primary-600 text-slate-900 px-1.5 py-0.5 rounded-full">Now</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
})

HistoryPanel.displayName = 'HistoryPanel'
export default HistoryPanel
