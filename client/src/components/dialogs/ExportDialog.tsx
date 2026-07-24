import React, { memo, useState, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { Toggle } from '@/components/ui/Toggle'
import { useUiStore } from '@/store/uiStore'
import { useExport } from '@/hooks/useExport'
import type { ExportFormat, ExportQuality, ExportOptions } from '@/types/canvas.types'
import { MdFileDownload } from 'react-icons/md'

const FORMAT_OPTIONS: { value: ExportFormat; label: string; desc: string }[] = [
  { value: 'png',  label: 'PNG',  desc: 'Lossless, supports transparency' },
  { value: 'jpeg', label: 'JPEG', desc: 'Compressed, smaller file size' },
  { value: 'pdf',  label: 'PDF',  desc: 'Print-ready vector document' },
]

const QUALITY_OPTIONS: { value: ExportQuality; label: string; multiplier: number }[] = [
  { value: 'standard', label: 'Standard (1×)', multiplier: 1 },
  { value: 'high',     label: 'High (2×)',     multiplier: 2 },
  { value: 'ultra',    label: 'Ultra (3×)',     multiplier: 3 },
]

/**
 * ExportDialog — modal for configuring and triggering canvas export.
 */
const ExportDialog = memo(() => {
  const { dialogs, closeDialog } = useUiStore()
  const { exportCanvas } = useExport()

  const [format,      setFormat]      = useState<ExportFormat>('png')
  const [quality,     setQuality]     = useState<ExportQuality>('high')
  const [transparent, setTransparent] = useState(false)
  const [filename,    setFilename]    = useState('mini-canva-design')
  const [isExporting, setIsExporting] = useState(false)

  const multiplier = QUALITY_OPTIONS.find((q) => q.value === quality)?.multiplier ?? 2

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    const options: ExportOptions = { format, quality, multiplier, transparentBackground: transparent, filename }
    await exportCanvas(options)
    setIsExporting(false)
    closeDialog('exportDialog')
  }, [format, quality, multiplier, transparent, filename, exportCanvas, closeDialog])

  return (
    <Modal
      isOpen={dialogs.exportDialog}
      onClose={() => closeDialog('exportDialog')}
      title="Export Design"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Format selection */}
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">File format</p>
          <div className="flex gap-2">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormat(opt.value)}
                className={[
                  'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors',
                  format === opt.value
                    ? 'bg-primary-600/20 border-primary-500 text-slate-900'
                    : 'bg-editor-input border-canvas-border text-slate-500 hover:border-slate-500',
                ].join(' ')}
                aria-label={`Export as ${opt.label}`}
                aria-pressed={format === opt.value}
              >
                <span className="font-bold text-sm">{opt.label}</span>
                <span className="text-[10px] text-center leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        {format !== 'pdf' && (
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium">Resolution</p>
            <div className="flex gap-2">
              {QUALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className={[
                    'flex-1 py-2 rounded-lg border text-xs font-medium transition-colors',
                    quality === opt.value
                      ? 'bg-primary-600/20 border-primary-500 text-slate-900'
                      : 'bg-editor-input border-canvas-border text-slate-500 hover:border-slate-500',
                  ].join(' ')}
                  aria-label={opt.label}
                  aria-pressed={quality === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filename */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-500 font-medium" htmlFor="export-filename">
            Filename
          </label>
          <input
            id="export-filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-editor-input border border-canvas-border rounded-lg text-sm text-slate-900 h-9 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            placeholder="my-design"
          />
        </div>

        {/* Transparent background */}
        {format === 'png' && (
          <Toggle
            label="Transparent background"
            checked={transparent}
            onChange={setTransparent}
          />
        )}

        {/* Export button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={isExporting}
          onClick={handleExport}
          icon={<MdFileDownload className="w-5 h-5" />}
          aria-label="Download export"
        >
          Download {format.toUpperCase()}
        </Button>
      </div>
    </Modal>
  )
})

ExportDialog.displayName = 'ExportDialog'
export default ExportDialog
