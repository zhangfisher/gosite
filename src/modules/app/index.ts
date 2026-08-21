'use client'

import mitt from 'mitt'

import {
  ToastManager,
  isPromise,
  type ToastOptions,
  type ToastPromiseMessages,
} from './toastManager'

export type AppEvents = Record<string, unknown>

export interface Subscriber {
    off: () => void
}

export class Application {
    private _emitter = mitt<AppEvents>()
    private _retained = new Map<keyof AppEvents, unknown>()

    /** 客户端 Toast 管理器（单例） */
    readonly toastManager = new ToastManager()

    /**
     * 显示一条 toast。
     *
     * - 对象形式：`App.toast({ type, title, description })`
     * - Promise 形式：`App.toast(promise, { loading, success, error })`
     *
     * 内部委托 {@link toastManager} 展示并记录历史。
     */
    toast(
        arg1: ToastOptions | Promise<unknown>,
        arg2?: ToastPromiseMessages<unknown>,
    ): string | Promise<unknown> {
        if (isPromise(arg1)) {
            return this.toastManager.showPromise(arg1, arg2 ?? {})
        }
        return this.toastManager.show(arg1)
    }

    get all() {
        return this._emitter.all
    }

    private _replay(type: keyof AppEvents | '*', handler: (...args: any[]) => void) {
        if (type === '*') {
            this._retained.forEach((event, key) => handler(key, event))
        } else if (this._retained.has(type)) {
            handler(this._retained.get(type))
        }
    }

    on<Key extends keyof AppEvents>(type: Key, handler: (event: AppEvents[Key]) => void): Subscriber
    on(type: '*', handler: (type: keyof AppEvents, event: AppEvents[keyof AppEvents]) => void): Subscriber
    on(type: keyof AppEvents | '*', handler: (...args: any[]) => void): Subscriber {
        this._emitter.on(type as any, handler as any)
        this._replay(type, handler as any)
        return {
            off: () => this._emitter.off(type as any, handler as any)
        }
    }

    once<Key extends keyof AppEvents>(type: Key, handler: (event: AppEvents[Key]) => void): Subscriber
    once(type: '*', handler: (type: keyof AppEvents, event: AppEvents[keyof AppEvents]) => void): Subscriber
    once(type: keyof AppEvents | '*', handler: (...args: any[]) => void): Subscriber {
        const subscriber = this.on(type as any, (...args: any[]) => {
            subscriber.off()
            handler(...args)
        })
        return subscriber
    }

    off<Key extends keyof AppEvents>(type: Key, handler?: (event: AppEvents[Key]) => void): void
    off(type: '*', handler: (type: keyof AppEvents, event: AppEvents[keyof AppEvents]) => void): void
    off(type: keyof AppEvents | '*', handler?: (...args: any[]) => void): void {
        this._emitter.off(type as any, handler as any)
    }

    emit<Key extends keyof AppEvents>(type: Key, event: AppEvents[Key], retain?: boolean): void
    emit<Key extends keyof AppEvents>(type: undefined extends AppEvents[Key] ? Key : never, event?: undefined, retain?: boolean): void
    emit(type: keyof AppEvents, event?: any, retain?: boolean): void {
        if (retain) {
            this._retained.set(type, event)
        }
        this._emitter.emit(type as any, event)
    }
}


declare global{
    var App:Application
}

globalThis.App=new Application()


