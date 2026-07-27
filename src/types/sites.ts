import type { BCP47LanguageTag } from "bcp47-language-tags";

export interface SiteSocials extends Record<string, string | undefined> {
    wechat?: string
    weibo?: string
    red?: string
    zhihu?: string
    douyin?: string
    tikTok?: string
    facebook?: string
    x?: string // twitter
    whatsapp?: string
    youtube?: string
    instagram?: string
    linkedin?: string
    snapchat?: string
    reddit?: string
    telegram?: string
    pinterest?: string
}

export interface SiteConfig extends Record<string, any> {
    id: string
    title: string
    description: string    
    defaultLanguage: string // BCP 47 格式的语言标签
    languages: Record<string, BCP47LanguageTag>
    keywords?: string[] // 关键词
    copyright?: string // 版权声明
    privacyPolicy?: string // 隐私政策
    cookieDeclaration?: string // Cookie声明
    filing?: string // 备案号
    contacts: {
        phone?: string
        email?: string
        address?: string
        support?: string // 技术支持电话
        worktimes?: string // 工作时间如：BeiJing 8:00 12:22
    }
    socials?: SiteSocials
}

export interface SiteRegistry {
    [siteId: string]: Record<string, SiteConfig>
}
