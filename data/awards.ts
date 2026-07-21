// Awards — managed by the CMS in content/awards.json.
import awardsData from "@/content/awards.json";

export interface Award {
  name: string;
  detail: string;
  link?: string;
}

export const awards: Award[] = awardsData.awards;
