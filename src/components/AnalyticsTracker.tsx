import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmParams } from "@/lib/utm";
import { trackPageView } from "@/lib/tracking";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Capture and refresh UTM & Ad click IDs (gclid, fbclid, wbraid, gbraid, etc.)
    captureUtmParams();

    // 2. Track unified PageView across Google Analytics & Meta Pixel
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default AnalyticsTracker;
