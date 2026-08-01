/**
 * Typed, lightweight cross-component event bus.
 *
 * Replaces ad-hoc `window.dispatchEvent(new CustomEvent(...))` usage with a
 * type-safe emitter so producers and consumers stay in sync at compile time.
 *
 * Usage:
 *   import { appEvents } from '@/lib/events'
 *   appEvents.emit('prefill-inquiry', { type: 'career', position: 'Engineer' })
 *   const off = appEvents.on('prefill-inquiry', (detail) => { ... })
 */

export interface AppEventMap {
  'prefill-inquiry': {
    type: string
    position?: string
  }
}

type Handler<T> = (detail: T) => void

class TypedEventBus<Events extends object> {
  private listeners = new Map<keyof Events, Set<Handler<never>>>()

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(handler as Handler<never>)
    return () => this.off(event, handler)
  }

  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    this.listeners.get(event)?.delete(handler as Handler<never>)
  }

  emit<K extends keyof Events>(event: K, detail: Events[K]): void {
    this.listeners.get(event)?.forEach((handler) => {
      ;(handler as Handler<Events[K]>)(detail)
    })
  }
}

export const appEvents = new TypedEventBus<AppEventMap>()
