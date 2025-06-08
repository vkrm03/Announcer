import React, { useState, useEffect } from 'react';
import { FaDownload, FaIdBadge } from "react-icons/fa";
import api_url from '../../public/assets/api_url.js';
import "../../public/Event.css";

function EventPage() {
  const [allEventPosters, setAllEventPosters] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  const eventPosters = allEventPosters;

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch(`${api_url}/api/getallPosters`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          const formatted = data.map((item, index) => ({
            id: item._id || index,
            title: item.title,
            description: item.desc,
            date: item.date,
            img: item.imageBase64,
          }));
          setAllEventPosters(formatted);
        } else {
          console.error("Backend error:", data.msg);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchPosters();
  }, []);

  const downloadPoster = (imgSrc, title) => {
    const link = document.createElement("a");
    link.href = imgSrc;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  
  };

  const odUrl = "https://od.sathyabama.ac.in";

  return (
    <div className="container">
      <h1>Upcoming Events</h1>

      {zoomImage && (
        <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Full" className="zoom-img" />
        </div>
      )}

      {selectedEvent && (
        <div className="overlay" onClick={() => setSelectedEvent(null)}>
          <div
            className="focused-card"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedEvent.img}
              alt={selectedEvent.title}
              onClick={() => setZoomImage(selectedEvent.img)}
              style={{ cursor: "zoom-in" }}
            />
            <div className="details">
              <h2>{selectedEvent.title} on {selectedEvent.date}</h2>
              <p>{selectedEvent.description}</p>

              <button onClick={() => downloadPoster(selectedEvent.img, selectedEvent.title)}>
                <FaDownload /> Download Poster
              </button>

              <button onClick={() => window.open(odUrl, "_blank")}>
                <FaIdBadge /> Get OD
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`grid ${selectedEvent ? 'blurred' : ''}`}>
        {eventPosters.map((event) => (
          <div key={event.id} className="card" onClick={() => setSelectedEvent(event)}>
            <img
              src={event.img}
              alt={event.title}
              onError={(e) => (e.target.style.display = 'none')}
            />
            <div className="event-content">
              <h2>{event.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventPage;
