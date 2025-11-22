import React, { useEffect, useState } from 'react';
import EventPerformance from './EventPerformance';
import FeedbackSummary from './FeedbackSummary';
import AudienceInsights from './AudienceInsights';
import './OrganizerDashboard.css';
import { getEventPerformanceData } from '../api/EventPerformanceAPI';
import { feedbackSummaryData } from '../api/FeedbackSummaryAPI';
import { audienceInsightsData } from '../api/AudienceInsightsAPI';

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getEventPerformanceData()
      .then((data) => {
        if (!mounted) return;
        setEventData(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load Event Performance data');
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Analytics & Reporting Dashboard</h1>
      <div className="dashboard-widgets">
        {loading ? (
          <div className="widget">Loading Event Performance...</div>
        ) : error ? (
          <div className="widget error">Error: {error}</div>
        ) : (
          <EventPerformance data={eventData} />
        )}

        <FeedbackSummary data={feedbackSummaryData} />
        <AudienceInsights data={audienceInsightsData} />
      </div>
    </div>
  );
};

export default OrganizerDashboard;
