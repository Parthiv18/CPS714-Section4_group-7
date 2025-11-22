import React from "react";
import { audienceInsightsData } from "./../api/AudienceInsightsAPI";
import "./AudienceInsights.css";

const AudienceInsights = () => {
  const eventRows = Object.entries(audienceInsightsData);

  const formatDataList = (dataObject) => {
    return Object.entries(dataObject)
      .map(([name, count]) => `${name} - ${count}`)
      .join(", ");
  };

  return (
    <div className="widget audience-insights">
      <h2>Event Performance Insights</h2>

      <table className="insights-table event-list">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Colleges and Counts</th>
            <th>Majors and Counts</th>
          </tr>
        </thead>
        <tbody>
          {eventRows.map(([eventName, eventDetails]) => (
            <tr key={eventName}>
              <td>{eventName}</td>
              <td>{formatDataList(eventDetails.colleges)}</td>
              <td>{formatDataList(eventDetails.majors)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AudienceInsights;
