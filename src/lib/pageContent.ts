import { PAGE_CONTENT, GUIDE_CONTENT, type PageContentKey, type GuideContentKey, type PageContentUnit } from "@/content/pageContent";

export function getPageContent(key: PageContentKey, locale: string): PageContentUnit {
  return PAGE_CONTENT[key][locale === "en" ? "en" : "ar"];
}

export function getGuideContent(key: GuideContentKey, locale: string): PageContentUnit {
  return GUIDE_CONTENT[key][locale === "en" ? "en" : "ar"];
}
