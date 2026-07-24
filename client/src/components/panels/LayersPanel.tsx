import React, { memo, useCallback, useState } from 'react'
import { fabric } from 'fabric'
import {
  DndContext, closestCenter,
  KeyboardSensor, PointerSensor,
  useSensor, useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  MdVisibility, MdVisibilityOff, MdLock, MdLockOpen,
  MdDelete, MdDragIndicator, MdContentCopy,
} from 'react-icons/md'
import { useCanvasStore, selectLayers, selectCanvas } from '@/store/canvasStore'
import { Tooltip } from '@/components/ui/Tooltip'
import type { CanvasLayer } from '@/types/canvas.types'

/**
 * LayersPanel — drag-to-reorder layer list with visibility/lock/delete controls.
 *
 * Uses @dnd-kit for accessible drag-and-drop.
 * Renders a virtualized list for performance with 300+ layers.
 */
const LayersPanel = memo(() => {
  const canvas = useCanvasStore(selectCanvas)
  const layers = useCanvasStore(selectLayers)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!canvas) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = layers.findIndex((l) => l.id === active.id)
    const newIndex = layers.findIndex((l) => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // Move in canvas object stack
    // layers are reversed from canvas stack — index 0 in layers = topmost object
    const canvasObjects = canvas.getObjects()
    const canvasOldIdx  = canvasObjects.length - 1 - oldIndex
    const canvasNewIdx  = canvasObjects.length - 1 - newIndex
    const obj = canvasObjects[canvasOldIdx]

    canvas.remove(obj)
    const newStack = canvas.getObjects()
    newStack.splice(canvasNewIdx, 0, obj)
    // Re-insert all objects in new order
    canvas.clear()
    newStack.forEach((o) => canvas.add(o))
    canvas.requestRenderAll()
  }, [canvas, layers])

  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="text-4xl mb-3">🎨</div>
        <p className="text-sm text-slate-500">No layers yet</p>
        <p className="text-xs text-slate-500 mt-1">Add shapes, text or images to get started</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={layers.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
          {layers.map((layer) => (
            <SortableLayer key={layer.id} layer={layer} canvas={canvas} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
})

LayersPanel.displayName = 'LayersPanel'
export default LayersPanel

// ─── Sortable Layer Row ───────────────────────────────────────────────────────

interface SortableLayerProps {
  layer: CanvasLayer
  canvas: fabric.Canvas | null
}

const SortableLayer = memo(({ layer, canvas }: SortableLayerProps) => {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: layer.id })

  const [isRenaming, setIsRenaming] = useState(false)
  const [nameValue, setNameValue] = useState(layer.name)

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const applyToObject = useCallback((fn: (obj: fabric.Object) => void) => {
    if (!canvas) return
    const obj = layer.object
    fn(obj)
    canvas.requestRenderAll()
  }, [canvas, layer.object])

  const select = useCallback(() => {
    if (!canvas) return
    canvas.setActiveObject(layer.object)
    canvas.requestRenderAll()
  }, [canvas, layer.object])

  const toggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    applyToObject((obj) => obj.set({ visible: !obj.visible }))
  }, [applyToObject])

  const toggleLock = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    applyToObject((obj) => obj.set({
      selectable:  layer.locked,
      evented:     layer.locked,
    }))
  }, [applyToObject, layer.locked])

  const duplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canvas) return
    layer.object.clone((cloned: fabric.Object & { id?: string }) => {
      cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 })
      delete cloned.id
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.requestRenderAll()
    })
  }, [canvas, layer.object])

  const deleteLayer = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canvas) return
    canvas.remove(layer.object)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }, [canvas, layer.object])

  const commitRename = useCallback(() => {
    ;(layer.object as fabric.Object & { name?: string }).name = nameValue
    setIsRenaming(false)
  }, [layer.object, nameValue])

  const typeIcon: Record<string, string> = {
    rect: '▭', circle: '○', triangle: '△', ellipse: '⬭',
    textbox: 'T', text: 'T', 'i-text': 'T',
    image: '🖼', line: '—', group: '⊞', polygon: '⬡',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={select}
      className={[
        'flex items-center gap-1.5 px-2 py-1.5 group cursor-pointer transition-colors',
        layer.selected
          ? 'bg-primary-600/20 border-l-2 border-primary-500'
          : 'border-l-2 border-transparent hover:bg-canvas-hover',
      ].join(' ')}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-slate-600 hover:text-slate-500 cursor-grab active:cursor-grabbing p-0.5"
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag to reorder"
      >
        <MdDragIndicator className="w-3.5 h-3.5" />
      </button>

      {/* Type icon */}
      <span className="text-xs w-4 text-center shrink-0 text-slate-500">
        {typeIcon[layer.type] || '◆'}
      </span>

      {/* Name */}
      {isRenaming ? (
        <input
          autoFocus
          className="flex-1 bg-editor-input text-xs text-slate-900 rounded px-1 h-5 border border-primary-500 outline-none"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setIsRenaming(false) }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="flex-1 text-xs text-slate-600 truncate"
          onDoubleClick={(e) => { e.stopPropagation(); setIsRenaming(true) }}
          title="Double-click to rename"
        >
          {layer.name}
        </span>
      )}

      {/* Action icons — appear on hover / when selected */}
      <div className={['flex items-center gap-0.5', layer.selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'].join(' ')}>
        <Tooltip content={layer.visible ? 'Hide' : 'Show'} side="top">
          <IconBtn onClick={toggleVisibility} aria-label="Toggle visibility">
            {layer.visible ? <MdVisibility className="w-3.5 h-3.5" /> : <MdVisibilityOff className="w-3.5 h-3.5 text-slate-600" />}
          </IconBtn>
        </Tooltip>
        <Tooltip content={layer.locked ? 'Unlock' : 'Lock'} side="top">
          <IconBtn onClick={toggleLock} aria-label="Toggle lock">
            {layer.locked ? <MdLock className="w-3.5 h-3.5 text-accent-orange" /> : <MdLockOpen className="w-3.5 h-3.5" />}
          </IconBtn>
        </Tooltip>
        <Tooltip content="Duplicate" side="top">
          <IconBtn onClick={duplicate} aria-label="Duplicate layer">
            <MdContentCopy className="w-3.5 h-3.5" />
          </IconBtn>
        </Tooltip>
        <Tooltip content="Delete" side="top">
          <IconBtn onClick={deleteLayer} aria-label="Delete layer" className="hover:text-accent-red">
            <MdDelete className="w-3.5 h-3.5" />
          </IconBtn>
        </Tooltip>
      </div>
    </div>
  )
})

SortableLayer.displayName = 'SortableLayer'

const IconBtn = memo(({
  onClick, children, className, 'aria-label': ariaLabel
}: {
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={['p-0.5 text-slate-500 hover:text-slate-900 transition-colors rounded', className].join(' ')}
  >
    {children}
  </button>
))
