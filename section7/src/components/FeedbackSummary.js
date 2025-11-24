import React from "react";
import "./FeedbackSummary.css";
import { feedbackSummaryData } from "./../api/FeedbackSummaryAPI";

const FeedbackSummary = () => {
  const eventRows = Object.entries(feedbackSummaryData);

  var temp_dict = {};
  var finalRows = [];
  for(var i in eventRows)
  {
    var row = eventRows[i][1];

    if(row.event === undefined || row.event === "" || row.rating === undefined || row.rating < 0 || row.rating > 5)
    {
      continue;
    }

    if(temp_dict[row.event] === undefined)
    {
      temp_dict[row.event] = {count:0, rating:0, comments:[]}
    }
    temp_dict[row.event].count += 1;
    temp_dict[row.event].rating += row.rating;
    
    if(row.comments === undefined || row.comments === "")
    {
      continue;
    }
    
    if(temp_dict[row.event].count === 4)
    {
      temp_dict[row.event].comments.push("...");
    }
    else if(temp_dict[row.event].count < 4)
    {
      temp_dict[row.event].comments.push(row.comments);
    }
  }

  for(var i in temp_dict)
  {
    finalRows.push([i, {averageRating:(temp_dict[i].rating/temp_dict[i].count).toFixed(2), comments:temp_dict[i].comments}]);
  }



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
          {finalRows.map(([eventName, data]) => (
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
