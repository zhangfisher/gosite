'use client'

import { Application } from '@/modules/app'

declare global {
  var App: Application
}

if (typeof window !== 'undefined') {
  globalThis.App = new Application()
}

export function AppInit() {
  return null
}
