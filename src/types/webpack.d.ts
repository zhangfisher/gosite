declare interface RequireContext {
  keys(): string[]
  (id: string): any
  resolve(id: string): string
  id: string
}

interface Require {
  context(
    request: string,
    recursive?: boolean,
    regExp?: RegExp
  ): RequireContext
}

declare module "webpack" {
  export interface RequireContext {
    keys(): string[]
    (id: string): any
    resolve(id: string): string
    id: string
  }

  export function require(
    request: string,
    recursive?: boolean,
    regExp?: RegExp
  ): RequireContext
}
