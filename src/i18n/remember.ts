import { LOCALE_COOKIE, type Locale } from "./config";

/** Persists the chosen language so the proxy redirects future unprefixed visits to it. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
