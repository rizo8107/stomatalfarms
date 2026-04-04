export const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid'
];

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

  if (Object.keys(utms).length > 0) {
    // Store in localStorage for persistence across sessions
    // We update it every time new UTMs are found
    const existing = getStoredUtmParams();
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
    Object.entries(utms).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
    
    return urlObj.toString();
  } catch (e) {
    console.error('Failed to append UTMs to URL', e);
    return url;
  }
};
