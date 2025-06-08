import React, { useState } from "react";
import "../../public/AddEvent.css";
import api_url from '../../public/assets/api_url.js';

const AddEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        img: null
    });

    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, img: file });

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("date", formData.date);
        data.append("img", formData.img);

        try {
            const response = await fetch(`${api_url}/events/add`, {
                method: "POST",
                body: data,
            });

            const result = await response.json();
            if (result.success) {
                setMessage("Event uploaded successfully!");
                setFormData({ title: "", description: "", date: "", img: null });
                setPreview(null);
            } else {
                setMessage("Error uploading event.");
            }
        } catch (error) {
            setMessage("Server error. Please try again.");
        }
    };

    return (
        <div className="event-form-container">
            <h2>Add New Event</h2>
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <label>Event Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label>Event Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label>Event Date:</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <label>Upload Event Poster:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />

                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="Preview" />
                    </div>
                )}

                <button type="submit">Submit Event</button>
            </form>
        </div>
    );
};

export default AddEvent;
