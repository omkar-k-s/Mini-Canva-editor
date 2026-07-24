export const FONT_FAMILIES = [
  'Inter',
  'Georgia',
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Verdana',
  'Trebuchet MS',
  'Courier New',
  'Palatino',
  'Impact',
  'Comic Sans MS',
  'Tahoma',
  'Gill Sans',
  'Futura',
  'Garamond',
] as const

export type FontFamily = typeof FONT_FAMILIES[number]

export const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 56, 64, 72, 80, 96, 128] as const

export const FONT_WEIGHTS = [
  { label: 'Thin',       value: '100' },
  { label: 'Light',      value: '300' },
  { label: 'Regular',    value: '400' },
  { label: 'Medium',     value: '500' },
  { label: 'SemiBold',   value: '600' },
  { label: 'Bold',       value: '700' },
  { label: 'ExtraBold',  value: '800' },
  { label: 'Black',      value: '900' },
] as const
