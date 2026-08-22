export const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'wbraid',
  'gbraid',
  'fbclid',
  'ttclid',
  'msclkid',
];

/**
 * Capture UTM params from the URL and store them in localStorage.
 * Also stores Shopify's special tracking keys: _landing_page, _source_url, _ref, _ga, _fbc, _fbp.
 * These are recorded on the FIRST visit (first-click attribution) and refreshed per session.
 */
export const captureUtmParams = () => {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  UTM_PARAMS.forEach((param) => {
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

  // Always extract/refresh Google Analytics (_ga) client ID cookie
  try {
    const gaCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('_ga='));
    if (gaCookie) {
      const gaValue = gaCookie.split('=')[1];
      const gaClientId = gaValue.split('.').slice(2).join('.');
      if (gaClientId) {
        utms['_ga'] = gaClientId;
      }
    }
  } catch (_) {
    // Cookie access can fail in some restricted environments; silently ignore
  }

  // Meta Pixel _fbp cookie (Browser ID)
  try {
    const fbpCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('_fbp='));
    if (fbpCookie) {
      utms['_fbp'] = fbpCookie.split('=')[1];
    }
  } catch (_) {}

  // Meta Pixel _fbc cookie or synthesize from fbclid (fb.1.{timestamp}.{fbclid})
  try {
    const fbcCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('_fbc='));
    if (fbcCookie) {
      utms['_fbc'] = fbcCookie.split('=')[1];
    } else if (searchParams.get('fbclid')) {
      const fbclid = searchParams.get('fbclid');
      const creationTime = Date.now();
      utms['_fbc'] = `fb.1.${creationTime}.${fbclid}`;
    }
  } catch (_) {}

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
    // Append standard UTM/click IDs to the URL for downstream tracking
    const forwardParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'gclid',
      'wbraid',
      'gbraid',
      'fbclid',
      'ttclid',
      'msclkid',
    ];

    forwardParams.forEach((key) => {
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
 * This includes UTM params, _landing_page, _source_url, _ref, _ga, _fbc, and _fbp.
 * Shopify uses these to populate Conversion Summary in the Admin panel.
 */
export const getShopifyCheckoutAttributes = (): Array<{ key: string; value: string }> => {
  const params = getStoredUtmParams();
  return Object.entries(params)
    .filter(([, value]) => value && String(value).trim() !== '')
    .map(([key, value]) => ({ key, value: String(value) }));
};
