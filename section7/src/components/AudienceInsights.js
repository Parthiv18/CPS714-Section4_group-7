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

  var temp_dict = {};
  var finalRows = [];

  for(var i in eventRows)
  {
    var event = eventRows[i][0];
    var entry = eventRows[i][1];

    if(temp_dict[event] === undefined)
    {
      temp_dict[event] = {};
    }

    for(var c in entry)
    {
      var count = 0;
      var college = entry[c];

      if(temp_dict[event][c] === undefined)
      {
        temp_dict[event][c] = {count:0, majors:[]}
      }
      else
      {
        count = temp_dict[event][c].count;
      }

      var col_info = temp_dict[event][c].majors;

      
      for(var m in college)
      {
        if(college[m] <= 0)
          continue;
        count += college[m];
        if(col_info[m] === undefined)
        {
          col_info[m] = college[m];
        }
        else
        {
          col_info[m] += college[m];
        }
      }
      temp_dict[event][c].count = count;
    }
  }

  for(i in temp_dict)
  {
    var event_used = false;

    for(var c in temp_dict[i])
    {
      var college_used = false;
      for(var m in temp_dict[i][c].majors)
      {
        if(event_used === false)
        {
          finalRows.push([i, c + " - " + temp_dict[i][c].count, m + " - " + temp_dict[i][c].majors[m]]);
          event_used = true;
          college_used = true;
        }
        else if(college_used === false)
        {
          finalRows.push(["", c + " - " + temp_dict[i][c].count, m + " - " + temp_dict[i][c].majors[m]]);
          college_used = true;
        }
        else
        {
          finalRows.push(["", "", m + " - " + temp_dict[i][c].majors[m]]);
        }
      }
    }
  }

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
          {finalRows.map(([event, college, major]) => (
            <tr key={event}>
              <td>{event}</td>
              <td>{college}</td>
              <td>{major}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AudienceInsights;
