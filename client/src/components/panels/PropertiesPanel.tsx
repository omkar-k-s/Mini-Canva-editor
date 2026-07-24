import React, { memo, useCallback, useEffect, useState } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore, selectCanvas, selectLayers } from '@/store/canvasStore'
import { useUiStore } from '@/store/uiStore'
import { Slider } from '@/components/ui/Slider'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { debounce } from '@/utils/debounce'
import { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from '@/constants/fonts'
import {
  MdFormatBold, MdFormatItalic, MdFormatUnderlined,
  MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify,
  MdFlipToFront, MdFlipToBack,
} from 'react-icons/md'

type ActiveObject = (fabric.Object & { id?: string; name?: string }) | null

/**
 * PropertiesPanel — context-aware panel that shows different controls
 * based on the type of the currently selected Fabric object.
 *
 * Performance:
 * - Uses a local state snapshot of the selected object's properties
 * - All onChange handlers are debounced 100ms before applying to Fabric
 * - The panel only re-renders when the selection changes (via canvas events)
 */
const PropertiesPanel = memo(() => {
  const canvas = useCanvasStore(selectCanvas)
  const [activeObj, setActiveObj] = useState<ActiveObject>(null)
  const [, forceUpdate] = useState(0)

  // Subscribe to canvas selection changes
  useEffect(() => {
    if (!canvas) return

    const onSelect  = () => setActiveObj(canvas.getActiveObject() as ActiveObject)
    const onClear   = () => setActiveObj(null)
    const onChange  = () => forceUpdate(n => n + 1)

    canvas.on('selection:created',  onSelect)
    canvas.on('selection:updated',  onSelect)
    canvas.on('selection:cleared',  onClear)
    canvas.on('object:modified',    onChange)

    return () => {
      canvas.off('selection:created',  onSelect)
      canvas.off('selection:updated',  onSelect)
      canvas.off('selection:cleared',  onClear)
      canvas.off('object:modified',    onChange)
    }
  }, [canvas])

  if (!canvas || !activeObj) {
    return <CanvasProperties />
  }

  const type = activeObj.type

  if (type === 'textbox' || type === 'text' || type === 'i-text') {
    return <TextProperties obj={activeObj as fabric.Textbox} canvas={canvas} />
  }

  if (type === 'image') {
    return <ImageProperties obj={activeObj as fabric.Image} canvas={canvas} />
  }

  return <ShapeProperties obj={activeObj} canvas={canvas} />
})

PropertiesPanel.displayName = 'PropertiesPanel'
export default PropertiesPanel

// ─── Canvas Background Properties ────────────────────────────────────────────
const CanvasProperties = memo(() => {
  const { backgroundColor, setBackgroundColor, canvasSize, canvas } = useCanvasStore()

  const applyBg = useCallback((color: string) => {
    setBackgroundColor(color)
    if (canvas) {
      canvas.setBackgroundColor(color, () => canvas.requestRenderAll())
    }
  }, [setBackgroundColor, canvas])

  return (
    <div className="p-4 space-y-4">
      <SectionHeader title="Canvas" />
      <div className="flex items-center gap-3">
        <ColorPicker color={backgroundColor} onChange={applyBg} label="Background" />
        <div>
          <p className="text-xs text-slate-500">Size</p>
          <p className="text-xs text-slate-600">{canvasSize.width} × {canvasSize.height}px</p>
        </div>
      </div>
    </div>
  )
})

// ─── Shape Properties ─────────────────────────────────────────────────────────
interface ObjPanelProps { obj: fabric.Object; canvas: fabric.Canvas }

const ShapeProperties = memo(({ obj, canvas }: ObjPanelProps) => {
  const apply = useCallback(
    debounce((props: Partial<fabric.Object>) => {
      obj.set(props as Record<string, unknown>)
      canvas.requestRenderAll()
    }, 80),
    [obj, canvas]
  )

  const fill   = (obj.fill   as string) || '#6366f1'
  const stroke = (obj.stroke as string) || 'transparent'
  const opacity = (obj.opacity ?? 1) * 100
  const angle  = obj.angle  || 0

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <SectionHeader title="Shape" />

      {/* Colors */}
      <div className="flex gap-4">
        <ColorPicker color={fill}   onChange={(c) => apply({ fill: c })}         label="Fill" />
        <ColorPicker color={stroke} onChange={(c) => apply({ stroke: c })}       label="Stroke" />
      </div>

      <PropertyRow label="Stroke width">
        <Slider
          value={(obj as fabric.Rect).strokeWidth || 0}
          onChange={(v) => apply({ strokeWidth: v })}
          min={0} max={20} step={1}
        />
      </PropertyRow>

      <PropertyRow label="Opacity">
        <Slider value={opacity} onChange={(v) => apply({ opacity: v / 100 })} unit="%" />
      </PropertyRow>

      <PropertyRow label="Rotation">
        <Slider value={angle} onChange={(v) => apply({ angle: v })} min={0} max={360} unit="°" />
      </PropertyRow>

      {/* Corner radius for rects */}
      {obj.type === 'rect' && (
        <PropertyRow label="Corner radius">
          <Slider
            value={(obj as fabric.Rect).rx || 0}
            onChange={(v) => { (obj as fabric.Rect).set({ rx: v, ry: v }); canvas.requestRenderAll() }}
            min={0} max={100} step={1} unit="px"
          />
        </PropertyRow>
      )}

      <LayerOrderButtons obj={obj} canvas={canvas} />
    </div>
  )
})

// ─── Text Properties ──────────────────────────────────────────────────────────
const TextProperties = memo(({ obj, canvas }: { obj: fabric.Textbox; canvas: fabric.Canvas }) => {
  const apply = useCallback(
    debounce((props: Partial<fabric.Textbox>) => {
      obj.set(props as Record<string, unknown>)
      canvas.requestRenderAll()
    }, 80),
    [obj, canvas]
  )

  const fill   = (obj.fill   as string) || '#ffffff'
  const opacity = (obj.opacity ?? 1) * 100

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <SectionHeader title="Text" />

      {/* Font family */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-500">Font family</label>
        <select
          className="bg-editor-input border border-canvas-border rounded-lg text-sm text-slate-900 h-9 px-2"
          value={obj.fontFamily || 'Inter'}
          onChange={(e) => apply({ fontFamily: e.target.value })}
        >
          {FONT_FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Font size + weight */}
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs text-slate-500">Size</label>
          <select
            className="bg-editor-input border border-canvas-border rounded-lg text-sm text-slate-900 h-9 px-2"
            value={obj.fontSize || 16}
            onChange={(e) => apply({ fontSize: parseInt(e.target.value) })}
          >
            {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs text-slate-500">Weight</label>
          <select
            className="bg-editor-input border border-canvas-border rounded-lg text-sm text-slate-900 h-9 px-2"
            value={obj.fontWeight || '400'}
            onChange={(e) => apply({ fontWeight: e.target.value })}
          >
            {FONT_WEIGHTS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
      </div>

      {/* Style toggles */}
      <div className="flex gap-1">
        {[
          { icon: <MdFormatBold />, label: 'Bold',      active: obj.fontWeight === 'bold' || Number(obj.fontWeight) >= 700, action: () => apply({ fontWeight: (obj.fontWeight === 'bold' || Number(obj.fontWeight) >= 700) ? '400' : 'bold' }) },
          { icon: <MdFormatItalic />, label: 'Italic',  active: obj.fontStyle === 'italic', action: () => apply({ fontStyle: obj.fontStyle === 'italic' ? 'normal' : 'italic' }) },
          { icon: <MdFormatUnderlined />, label: 'Underline', active: obj.underline, action: () => apply({ underline: !obj.underline }) },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            aria-label={item.label}
            className={[
              'w-9 h-9 flex items-center justify-center rounded-lg text-base transition-colors',
              item.active
                ? 'bg-primary-600 text-slate-900'
                : 'bg-editor-input text-slate-500 hover:text-slate-900',
            ].join(' ')}
          >
            {item.icon}
          </button>
        ))}

        <div className="w-px h-9 bg-canvas-border mx-1" />

        {/* Alignment */}
        {[
          { icon: <MdFormatAlignLeft />,    align: 'left' },
          { icon: <MdFormatAlignCenter />,  align: 'center' },
          { icon: <MdFormatAlignRight />,   align: 'right' },
          { icon: <MdFormatAlignJustify />, align: 'justify' },
        ].map((item) => (
          <button
            key={item.align}
            onClick={() => apply({ textAlign: item.align as fabric.Textbox['textAlign'] })}
            aria-label={`Align ${item.align}`}
            className={[
              'w-9 h-9 flex items-center justify-center rounded-lg text-base transition-colors',
              obj.textAlign === item.align
                ? 'bg-primary-600 text-slate-900'
                : 'bg-editor-input text-slate-500 hover:text-slate-900',
            ].join(' ')}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Color */}
      <div className="flex items-center gap-3">
        <ColorPicker color={fill} onChange={(c) => apply({ fill: c })} label="Color" />
      </div>

      {/* Letter spacing + line height */}
      <PropertyRow label="Letter spacing">
        <Slider value={obj.charSpacing || 0} onChange={(v) => apply({ charSpacing: v })} min={-200} max={800} unit="" />
      </PropertyRow>
      <PropertyRow label="Line height">
        <Slider value={obj.lineHeight || 1} onChange={(v) => apply({ lineHeight: v })} min={0.5} max={3} step={0.1} />
      </PropertyRow>
      <PropertyRow label="Opacity">
        <Slider value={opacity} onChange={(v) => apply({ opacity: v / 100 })} unit="%" />
      </PropertyRow>
      <PropertyRow label="Rotation">
        <Slider value={obj.angle || 0} onChange={(v) => apply({ angle: v })} min={0} max={360} unit="°" />
      </PropertyRow>

      <LayerOrderButtons obj={obj} canvas={canvas} />
    </div>
  )
})

// ─── Image Properties ─────────────────────────────────────────────────────────
const ImageProperties = memo(({ obj, canvas }: { obj: fabric.Image; canvas: fabric.Canvas }) => {
  const apply = useCallback(
    debounce((props: Record<string, unknown>) => {
      obj.set(props)
      canvas.requestRenderAll()
    }, 80),
    [obj, canvas]
  )

  const applyFilter = useCallback(
    debounce((filterClass: new (...args: unknown[]) => fabric.IBaseFilter, options: Record<string, unknown>, index: number) => {
      obj.filters![index] = new filterClass(options)
      obj.applyFilters()
      canvas.requestRenderAll()
    }, 100),
    [obj, canvas]
  )

  const opacity = (obj.opacity ?? 1) * 100

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <SectionHeader title="Image" />

      <PropertyRow label="Opacity">
        <Slider value={opacity} onChange={(v) => apply({ opacity: v / 100 })} unit="%" />
      </PropertyRow>
      <PropertyRow label="Rotation">
        <Slider value={obj.angle || 0} onChange={(v) => apply({ angle: v })} min={0} max={360} unit="°" />
      </PropertyRow>
      <PropertyRow label="Corner radius">
        <Slider value={(obj as fabric.Image & { rx?: number }).rx || 0} onChange={(v) => apply({ rx: v, ry: v })} min={0} max={300} unit="px" />
      </PropertyRow>

      {/* Flip */}
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => apply({ flipX: !obj.flipX })}>Flip H</Button>
        <Button size="sm" variant="secondary" onClick={() => apply({ flipY: !obj.flipY })}>Flip V</Button>
      </div>

      {/* Filters */}
      <SectionHeader title="Filters" />
      <Toggle
        label="Grayscale"
        checked={!!(obj.filters && obj.filters[0])}
        onChange={(v) => {
          if (v) { obj.filters![0] = new fabric.Image.filters.Grayscale() }
          else   { obj.filters![0] = undefined as unknown as fabric.IBaseFilter }
          obj.applyFilters()
          canvas.requestRenderAll()
        }}
      />
      <Toggle
        label="Sepia"
        checked={!!(obj.filters && obj.filters[1])}
        onChange={(v) => {
          if (v) { obj.filters![1] = new fabric.Image.filters.Sepia() }
          else   { obj.filters![1] = undefined as unknown as fabric.IBaseFilter }
          obj.applyFilters()
          canvas.requestRenderAll()
        }}
      />

      <LayerOrderButtons obj={obj} canvas={canvas} />
    </div>
  )
})

// ─── Layer Order Buttons ──────────────────────────────────────────────────────
const LayerOrderButtons = memo(({ obj, canvas }: ObjPanelProps) => (
  <div className="flex gap-2 pt-2 border-t border-canvas-border">
    <Button size="sm" variant="ghost" onClick={() => { canvas.bringToFront(obj); canvas.requestRenderAll() }} icon={<MdFlipToFront />}>Front</Button>
    <Button size="sm" variant="ghost" onClick={() => { canvas.sendToBack(obj);  canvas.requestRenderAll() }} icon={<MdFlipToBack />}>Back</Button>
  </div>
))

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SectionHeader = memo(({ title }: { title: string }) => (
  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</h3>
))

const PropertyRow = memo(({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs text-slate-500">{label}</span>
    {children}
  </div>
))
