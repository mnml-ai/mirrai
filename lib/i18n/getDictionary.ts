import ar from "./dictionaries/ar";
import en from "./dictionaries/en";
import { DEFAULT_LOCALE, type Locale } from "./config";

const dictionaries = {
  en,
  ar,
} as const;

export type Dictionary = (typeof dictionaries)[typeof DEFAULT_LOCALE];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
