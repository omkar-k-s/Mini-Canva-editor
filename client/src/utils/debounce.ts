/**
 * Debounce — delays invoking fn until after wait ms have elapsed
 * since the last invocation.
 *
 * Used for property panel inputs to prevent Fabric re-renders on every keystroke.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

/**
 * Throttle — ensures fn is called at most once per every limit ms.
 *
 * Used for Fabric mouse:move and object:moving events.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => { inThrottle = false }, limit)
    }
  }
}

/**
 * RAF-throttle — executes fn on the next animation frame.
 * Optimal for smooth 60fps canvas updates.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rafThrottle<T extends (...args: any[]) => unknown>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null
  return (...args: Parameters<T>) => {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      fn(...args)
      rafId = null
    })
  }
}
