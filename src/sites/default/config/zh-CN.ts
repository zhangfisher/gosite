import { SiteConfig } from "@/types/sites";
 import { defaultLanguage, languages } from "@/sites/default/i18n"


export const config: SiteConfig = {
  id: "default",
  title: "默认站点",
  description: "默认站点描述", 
  defaultLanguage,
  languages,
  contacts: {
    address: "福建省泉州市丰泽区科技路育成基地",
    phone: "0086-15906005001",
    email: "hyt@huanyutong.com",
    support: "4009988188",
    worktimes: "周一至周五 9:00-18:00",
  },
  socials: {
    facebook: "https://www.facebook.com/meeyi.intercom",
    x: "https://twitter.com/MEEYI_HYT",
    youtube: "https://youtube.com/@meeyi1999",
    whatsapp: "https://wa.me/8615392123519?text=",
  },
  copyright: "© 2008-2026 福建环宇通信息科技股份公司 版权所有",
  privacyPolicy: "",
  cookieDeclaration: "",
  filing: "闽ICP备16038990号",
};
