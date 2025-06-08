import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // <-- import SweetAlert2
import api_url from '../../public/assets/api_url.js';
import '../../public/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [poster, setPoster] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [uploadedPosters, setUploadedPosters] = useState([]);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchPosters();
    }
  }, []);

  const fetchPosters = async () => {
    try {
      const res = await fetch(api_url + '/api/getPosters', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        setUploadedPosters(data.posters);
        setUserName(data.user.name);
      }
    } catch (err) {
      console.error(err);
    }
  };
  


  const handlePosterUpload = async (e) => {
    e.preventDefault();

    if (!poster || !title || !desc || !date) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'All fields are required!',
      });
    }

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64Image = await toBase64(poster);

      const res = await fetch(api_url + '/api/uploadPoster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, desc, date, imageBase64: base64Image }),
      });      

      const data = await res.json();

      if (res.ok) {
        setUploadedPosters([data, ...uploadedPosters]);
        setPoster(null);
        setTitle('');
        setDesc('');
        setDate('');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Poster uploaded successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: data.msg || 'Something went wrong',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong!',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(api_url + `/api/deletePoster/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = uploadedPosters.filter((p) => p._id !== id);
        setUploadedPosters(updated);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Poster deleted successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete poster.',
      });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="admin-info">
            <img
              src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
              alt="Admin Avatar"
              className="admin-avatar"
            />
            <div>
              <h1>Hello, {userName}</h1>
              <p className="admin-role">Information Technology</p>
            </div>
          </div>
        </header>

        <div className="stats-cards">
          <div className="card">
            <h3>Your Uploads</h3>
            <p>{uploadedPosters.length}</p>
          </div>
          <div className="card">
            <h3>Total Posters</h3>
            <p>24</p>
          </div>
          <div className="card">
            <h3>Upcoming Events</h3>
            <p>8</p>
          </div>
        </div>

        <div
          className="upload-and-posters"
          style={{ display: 'flex', gap: '30px', marginTop: '40px' }}
        >
          <div className="upload-section" style={{ flex: 1 }}>
            <h2>Upload New Poster</h2>
            <form onSubmit={handlePosterUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPoster(e.target.files[0])}
              />
              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button type="submit">Upload Poster</button>
            </form>
          </div>

          <div className="poster-preview">
            <h2>Uploaded Posters</h2>
            {uploadedPosters.length === 0 && <p>No posters uploaded yet.</p>}
            <div className="poster-list">
              {uploadedPosters.map((poster) => (
                <div key={poster._id} className="poster-card">
                  <img src={poster.imageBase64} alt={poster.title} />
                  <div className="poster-info">
                    <h3>{poster.title}</h3>
                    <p>{poster.desc}</p>
                    <small>{poster.date}</small>
                  </div>
                  <button
                    onClick={() => handleDelete(poster._id)}
                    title="Delete Poster"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
