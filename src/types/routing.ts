export interface RouteContext {
    site: string
    lang: string
    path: string
}

export interface ParsedUrl {
    lang?: string
    site?: string
    rest: string
}
