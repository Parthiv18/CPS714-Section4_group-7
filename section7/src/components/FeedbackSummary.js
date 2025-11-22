import React from "react";
import "./FeedbackSummary.css";
import { feedbackSummaryData } from "./../api/FeedbackSummaryAPI";

const FeedbackSummary = () => {
  const eventRows = Object.entries(feedbackSummaryData);

  return (
    <div className="widget event-performance">
      <h2>Feedback Summary</h2>

      <table className="event-list">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Average Rating</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {eventRows.map(([eventName, data]) => (
            <tr key={eventName}>
              <td>{eventName}</td>
              <td>
                <span className="rating-value">{data.averageRating} / 5</span>
              </td>
              <td className="comment-cell">
                {data.comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    {comment}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackSummary;
