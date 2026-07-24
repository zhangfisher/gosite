import { SiteConfig } from "@/types/sites";
  import { defaultLanguage, languages } from "@/sites/default/i18n"


export const config: SiteConfig = {
  id: "default",
  title: "Default",
  description: "Default site description",
  defaultLanguage,
  languages,
  contacts: {
    address: "Yucheng Base, Keji Road, Fengze District, Quanzhou City, Fujian Province, China",
    phone: "0086-15906005001",
    email: "hyt@huanyutong.com",
    support: "4009988188",
    worktimes: "Monday to Friday 9:00-18:00",
  },
  socials: {
    facebook: "https://www.facebook.com/meeyi.intercom",
    x: "https://twitter.com/MEEYI_HYT",
    youtube: "https://youtube.com/@meeyi1999",
    whatsapp: "https://wa.me/8615392123519?text=",
  },
  copyright: "© 2008-2026 Fujian Huanyutong Information Technology Co., Ltd. All Rights Reserved",
  privacyPolicy: "",
  cookieDeclaration: "",
  filing: "Min ICP No. 16038990",
};