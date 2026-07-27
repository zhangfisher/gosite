/**
 * 全局类型声明
 */

/**
 * Webpack require.context 类型声明
 */
declare global {
  interface RequireContext {
    keys(): string[]
    (id: string): any
    <T>(id: string): T
  }

  interface Require {
    context(
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ): RequireContext
  }
}

export {}
