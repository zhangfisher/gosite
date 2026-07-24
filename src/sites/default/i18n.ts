// 全局多语言配置
// 使用 bcp47-language-tags 库获取语言信息

// 导入语言标签
import { zhCN } from "bcp47-language-tags/with-flags/en-US/zh-CN" 
import { enUS } from "bcp47-language-tags/with-flags/en-US/en-US" 

// 默认语言
export const defaultLanguage = "zh-CN"

export const languages = {
    "zh-CN": zhCN, 
    "en-US": enUS, 
}

export const supportedLanguages = Object.keys(languages)
