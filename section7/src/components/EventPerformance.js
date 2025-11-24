import React from "react";
import "./EventPerformance.css";

export default function EventPerformance({ data }) {
  if (!data || data.length === 0)
    return <div className="widget">No events found.</div>;

  return (
    <div className="widget event-performance">
      <h2>Event Performance</h2>
      <table className="event-list">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>RSVP</th>
            <th>Actual</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.id}</td>
              <td>{ev.rsvpCount}</td>
              <td>{ev.actual}</td>
              <td>{((ev.actual/ev.rsvpCount).toFixed(2)*100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
