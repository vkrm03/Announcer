const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Poster = require('./models/Poster');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const auth = require('./auth');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://vkrm:vkrm@announcer.8zfn5r5.mongodb.net/Announcer')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));


  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
  
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }
  
      if (user.password !== password) {
        return res.status(400).json({ msg: 'Incorrect password' });
      }
  
      const token = jwt.sign({ id: user._id }, "itannouncerapp", {
        expiresIn: '1d',
      });
  
      res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

  app.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.password !== oldPassword) {
      return res.status(400).json({ msg: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ msg: 'Server error while changing password' });
  }
});



  // const users = [
  //   {
  //     name: "Vikram",
  //     email: "vikram@example.com",
  //     password: "password123"
  //   },
  //   {
  //     name: "Harish",
  //     email: "harish@example.com",
  //     password: "securepass456"
  //   },
  //   {
  //     name: "Niranchan",
  //     email: "niranchan@example.com",
  //     password: "letmein789"
  //   },
  //   {
  //     name: "Sharvanth",
  //     email: "sharvanth@example.com",
  //     password: "testuser000"
  //   }
  // ];

  // try {
  //   const inserted = User.insertMany(users);
  //   console.log("Users inserted :", inserted);
  // } catch(err){
  //   console.error("Error inserting users", err);
  // };


  app.post('/api/uploadPoster', auth, async (req, res) => {
    try {
      const { title, desc, date, imageBase64 } = req.body;
      const poster = new Poster({
        title,
        desc,
        date,
        imageBase64,
        user: req.user.id
      });
  
      const saved = await poster.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to upload poster' });
    }
  });
  
  app.get('/api/getPosters', auth, async (req, res) => {
    try {
      const posters = await Poster.find({ user: req.user.id });
      const user = await User.findById(req.user.id);
      res.json({ posters, user: { name: user.name } });
    } catch (err) {
      res.status(500).json({ msg: 'Error fetching posters' });
    }
  });
  


  app.get('/api/getallPosters', async (req, res) => {
    try {
      const posters = await Poster.find();
      res.json(posters);
    } catch (err) {
      res.status(500).json({ msg: 'Error fetching posters' });
    }
  });
  

app.delete('/api/deletePoster/:id', async (req, res) => {
  try {
    await Poster.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Poster deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting poster' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
