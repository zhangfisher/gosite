'use client'

import { toast } from '@/components/ui/toast'

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

export interface ToastOptions {
  type?: ToastType
  title?: string
  description?: string
}

export interface ToastPromiseMessages<T> {
  loading?: React.ReactNode | (() => React.ReactNode)
  success?: React.ReactNode | ((data: T) => React.ReactNode)
  error?: React.ReactNode | ((error: unknown) => React.ReactNode)
}

export interface ToastRecord {
  id: string
  type: ToastType
  title?: string
  description?: string
  createdAt: number
  promise: boolean
}

const MAX_HISTORY = 100

function isPromise(value: unknown): value is Promise<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

/**
 * 客户端 Toast 管理器
 *
 * 封装 sonner 的 `toast` 用于实际弹出展示，同时维护一份
 * 最近 100 条 toast 的本地历史（含类型、标题、描述、时间），
 * 供后台「通知历史」面板读取与展示。
 */
export class ToastManager {
  private _history: ToastRecord[] = []
  private _listeners = new Set<() => void>()

  /** 逆序（最新在前）的 toast 历史，最多保留 {@link MAX_HISTORY} 条 */
  get history(): ToastRecord[] {
    return this._history
  }

  /** 订阅历史变化，返回取消订阅函数 */
  subscribe(listener: () => void): () => void {
    this._listeners.add(listener)
    return () => {
      this._listeners.delete(listener)
    }
  }

  /** 清空历史 */
  clear(): void {
    this._history = []
    this._emit()
  }

  private _emit(): void {
    this._listeners.forEach((listener) => listener())
  }

  private _record(record: ToastRecord): void {
    this._history = [record, ...this._history].slice(0, MAX_HISTORY)
    this._emit()
  }

  /** 展示一条普通 toast 并记录到历史 */
  show(options: ToastOptions): string {
    const type = options.type ?? 'info'
    const id = (
      toast[type] as (message: string, opts?: { description?: string }) => string | number
    )(options.title ?? '', { description: options.description })

    this._record({
      id: String(id),
      type,
      title: options.title,
      description: options.description,
      createdAt: Date.now(),
      promise: false,
    })

    return String(id)
  }

  /** 展示一条 Promise toast 并记录到历史 */
  showPromise<T>(
    promise: Promise<T>,
    messages: ToastPromiseMessages<T>,
  ): Promise<T> {
    const loadingText =
      typeof messages.loading === 'function'
        ? (messages.loading as () => React.ReactNode)()
        : messages.loading

    toast.promise(promise, {
      loading: messages.loading as React.ReactNode,
      success: messages.success as React.ReactNode,
      error: messages.error as React.ReactNode,
    })

    this._record({
      id: `promise-${Date.now()}`,
      type: 'loading',
      title: typeof loadingText === 'string' ? loadingText : undefined,
      description: undefined,
      createdAt: Date.now(),
      promise: true,
    })

    return promise
  }
}

export { isPromise }
