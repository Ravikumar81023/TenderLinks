import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAnalyticsStore } from "../store/analyticsStore";
import useAuthStore from "../store/authStore";

interface AnalyticsWrapperProps {
  children: React.ReactNode;
}

const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { recordPageView, updateTimeSpent } = useAnalyticsStore();
  const [startTime] = useState(Date.now());

  // Record page view on route change
  useEffect(() => {
    if (isAuthenticated) {
      recordPageView();
    }
  }, [isAuthenticated, location.pathname, recordPageView]);

  // Update time spent every minute
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeSpentInterval = setInterval(() => {
      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
      updateTimeSpent(timeSpentSeconds);
    }, 60000);

    return () => clearInterval(timeSpentInterval);
  }, [isAuthenticated, startTime, updateTimeSpent]);

  return <>{children}</>;
};

export default AnalyticsWrapper;
