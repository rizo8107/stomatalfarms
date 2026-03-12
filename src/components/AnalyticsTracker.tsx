import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track PageView in Google Analytics
    if (window.gtag) {
      window.gtag('config', 'GT-NBXH2XRV', {
        page_path: location.pathname + location.search,
      });
    }

    // Track PageView in Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
};

export default AnalyticsTracker;
