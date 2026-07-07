// Featured In articles — managed by the CMS in content/press.json.
import pressData from "@/content/press.json";

export interface PressItem {
  publication: string;
  title: string;
  date: string;
  url?: string;
}

export const press: PressItem[] = (pressData.press as PressItem[]).map((p) => ({
  ...p,
  url: p.url || undefined,
}));
