// Fetch and normalize EventPerformance data from your API
export async function getEventPerformanceData() {
  const res = await fetch("http://localhost:3001/api/collections");
  if (!res.ok) {
    throw new Error(`Fetch error ${res.status}: ${res.statusText}`);
  }

  const collections = await res.json();

  const map = new Map();

  collections.forEach((collection) => {
    (collection.documents || []).forEach((doc) => {
      const id = doc.id || (doc.data && doc.data.EventID) || "unknown";
      const data = doc.data || {};

      let rsvpCount = 0;
      if (typeof data.Registered === "number") {
        rsvpCount = data.Registered;
      } else if (Array.isArray(data.EnrolledEmail)) {
        rsvpCount = data.EnrolledEmail.length;
      } else if (Array.isArray(data.Interest)) {
        rsvpCount = data.Interest.length;
      } else if (Array.isArray(data.Interested)) {
        rsvpCount = data.Interested.length;
      } else if (Array.isArray(data.Waitlist)) {
        rsvpCount = data.Waitlist.length;
      }

      if (!map.has(id)) {
        map.set(id, { id, rsvpCount, sources: [data] });
      } else {
        const prev = map.get(id);
        prev.rsvpCount = Math.max(prev.rsvpCount, rsvpCount);
        prev.sources.push(data);
        map.set(id, prev);
      }
    });
  });

  var events = Array.from(map.values()).sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  for(var i in events)
  {
    events[i].actual = Math.max(events[i].rsvpCount - 2, 0);
  }

/*  events = [
  {
    id:"Event 1",
    rsvpCount: 50,
    actual: 40
  },
  {
    id:"Event 2",
    rsvpCount: 100,
    actual: 75
  },
  {
    id:"Event 3",
    rsvpCount: 0,
    actual: 62
  },
  {
    id:"Event 4",
    rsvpCount: -14,
    actual: 62
  },
  {
    id:"Event 5",
    rsvpCount: 73,
    actual: -30
  },
  {
    id:"Event 6",
    rsvpCount: 82,
  },
  {
    id:"Event 7",
    actual: 10,
  },
  {
    id:"Event 8",
    rsvpCount: 60,
    actual: 0
  },
  {
    id:"Event 9",
  },
];*/

  return events;
}
