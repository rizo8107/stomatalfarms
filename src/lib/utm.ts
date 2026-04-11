export const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid'
];

/**
 * Capture UTM params from the URL and store them in localStorage.
 * Also stores Shopify's special tracking keys: _landing_page, _source_url, _ref.
 * These are only recorded on the FIRST visit (first-click attribution).
 */
export const captureUtmParams = () => {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  UTM_PARAMS.forEach(param => {
    const value = searchParams.get(param);
    if (value) {
      utms[param] = value;
    }
  });

  const existing = getStoredUtmParams();
  const isFirstVisit = !localStorage.getItem('utm_session_captured');

  if (isFirstVisit) {
    // Mark that we've captured the session so we don't overwrite on subsequent page loads
    localStorage.setItem('utm_session_captured', '1');

    // _landing_page: Shopify uses this to attribute the order to the originating URL
    utms['_landing_page'] = window.location.pathname + window.location.search;

    // _source_url: full absolute URL
    utms['_source_url'] = window.location.href;

    // _ref: HTTP referrer — what site sent them here (Google, Meta, etc.)
    if (document.referrer) {
      utms['_ref'] = document.referrer;
    }
  }

  // Always refresh _ga (Google Analytics client ID) — it updates each session
  try {
    const gaCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_ga='));
    if (gaCookie) {
      // GA cookie format: GA1.1.XXXXXXXXXX.XXXXXXXXXX — extract the numeric part
      const gaValue = gaCookie.split('=')[1];
      const gaClientId = gaValue.split('.').slice(2).join('.');
      if (gaClientId) {
        utms['_ga'] = gaClientId;
      }
    }
  } catch (_) {
    // Cookie access can fail in some environments; silently ignore
  }

  if (Object.keys(utms).length > 0) {
    const updated = { ...existing, ...utms };
    localStorage.setItem('utm_params', JSON.stringify(updated));
  }
};

export const getStoredUtmParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};

  const stored = localStorage.getItem('utm_params');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse UTM params', e);
    }
  }
  return {};
};

export const appendUtmToUrl = (url: string): string => {
  try {
    const utms = getStoredUtmParams();
    if (Object.keys(utms).length === 0) return url;

    const urlObj = new URL(url);
    // Only append the standard UTM/click IDs to the URL, not the _internal Shopify keys
    const urlParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    urlParams.forEach(key => {
      if (utms[key]) {
        urlObj.searchParams.set(key, utms[key]);
      }
    });

    return urlObj.toString();
  } catch (e) {
    console.error('Failed to append UTMs to URL', e);
    return url;
  }
};

/**
 * Returns ALL stored tracking data as Shopify checkout attributes.
 * This includes UTM params, _landing_page, _source_url, _ref, and _ga.
 * Shopify uses these to populate Conversion Summary in the Admin panel.
 */
export const getShopifyCheckoutAttributes = (): Array<{ key: string; value: string }> => {
  const params = getStoredUtmParams();
  return Object.entries(params)
    .filter(([, value]) => value && value.trim() !== '')
    .map(([key, value]) => ({ key, value: String(value) }));
};
