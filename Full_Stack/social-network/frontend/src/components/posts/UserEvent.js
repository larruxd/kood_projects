import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserEvent = () => {
  const [userEvents, setUserEvents] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getUserEvents = async () => {
    try {
      const resp = await fetch("http://localhost:8080/getUserEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: +localStorage.getItem("user_id" ?? 0) }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch user events: ${resp.status}`);
      }

      const events = await resp.json();
      setUserEvents(events);
    } catch (error) {
      console.error("Error fetching user events:", error);
    }
  };

  const toggleEvent = (eventId) => {
    setExpandedEvents((prevExpanded) => {
      if (prevExpanded.includes(eventId)) {
        // If already expanded, collapse it
        return prevExpanded.filter((id) => id !== eventId);
      } else {
        // If not expanded, expand it
        return [...prevExpanded, eventId];
      }
    });
  };

  const toggleAllEvents = () => {
    setAllExpanded((prevAllExpanded) => !prevAllExpanded);
    setExpandedEvents([]);
  };

  useEffect(() => {
    getUserEvents();
  }, []);
  const totalEventsCount = userEvents ? userEvents.length : 0;

  return (
    <div
      className='upcomingEvents'
      style={{
        padding: 5,
        boxShadow: "3px 3px 5px 5px var(--bs-body-color)",
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <h5 style={{ marginBottom: 10 }}>
        <span style={{ marginLeft: 5 }}>
          Upcoming Events {totalEventsCount}
        </span>
      </h5>
      <button
        style={{ marginBottom: 10 }}
        onClick={toggleAllEvents}
        className='btn btn-primary btn-sm'
      >
        {allExpanded ? "Collapse All" : "Expand All"}
      </button>
      {/* Start: YourEventsDescDiv */}
      {userEvents &&
        userEvents.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 15,
              marginBottom: 15,
              cursor: "pointer",
              display:
                allExpanded || expandedEvents.includes(event.id)
                  ? "block"
                  : "none",
            }}
            onClick={() => toggleEvent(event.id)}
          >
            <h6 style={{ margin: 0, fontSize: 18 }}>{event.title}</h6>

            {expandedEvents.includes(event.id) && (
              <>
                {/* <p style={{ fontSize: 14, color: "#777", marginTop: 5 }}>
                  {event.grouptitle}
                </p> */}
                <div>
                  <Link to={`/groupprofile/${event.groupid}`}>
                    {" "}
                    <h6>{event.grouptitle}</h6>
                  </Link>
                </div>
                <p style={{ fontSize: 14, marginTop: 10 }}>
                  {event.description}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#aaa",
                    textAlign: "right",
                    marginTop: 10,
                  }}
                >
                  {new Date(event.starttime).toLocaleString()}
                </p>
              </>
            )}
          </div>
        ))}
      {/* End: YourEventsDescDiv */}
    </div>
  );
};

export default UserEvent;
