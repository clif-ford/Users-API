import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import multer from 'multer';
import validator from 'validator';
import path from 'path'
import User from './models/userModel.js';


const app = express()
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/', (req,res) => {
    res.send('User Homepage');
});

mongoose.connect('MONGODB URL')
.then(() => {
    console.log('Connected to MogoDB')
    app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`))
}).catch((error) => {
    console.error(error)
})

// User Creation
app.post('/user/create', async (req, res) => {
    const { fullName, email, password } = req.body;
  
    // Validate user data
    const errors = {};
    if (!fullName || fullName.trim() === '') {
      errors.fullName = 'Full name is required';
    }
    if (!validator.isEmail(email)) {
      errors.email = 'Invalid email format';
    }
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message:'Validation error',errors });
    }
  
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      const savedUser = await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  // Update User Details
app.put('/user/edit', async (req, res) => {
    const { email,fullName, password } = req.body;
  
    // Validate user data
    const errors = {};
    if (!fullName || fullName.trim() === '') {
      errors.fullName = 'Full name is required';
    }
    if (password && password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (fullName) existingUser.fullName = fullName;
      if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      }
      await existingUser.save();
      return res.status(200).json({message:'User updated successfully'});
    }catch(err){
        console.error(err);
    }
});

// Delete User
app.delete('/user/delete', async (req, res) => {
    const { email } = req.body;
  
    // Validate request body
    if (!email) {
      return res.status(400).json({ message: 'Validation error: Email is required' });
    }
  
    try {
      // Find user by email and delete
      const user = await User.findOneAndDelete({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Retrieve All Users
app.get('/user/getAll', async (req, res) => {
    try {

        const users = await User.find({}, { fullName: 1, email: 1 });
  
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

// Upload Image
// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + Date.now() + ext);
    }
  });
  
  // Multer upload configuration
  const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed'));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5 MB file size limit
    }
  });
  
  // POST /user/uploadImage endpoint
  app.post('/user/uploadImage', upload.single('image'), async (req, res) => {
    const { userId } = req.body;
    
    if (!req.file || !userId) {
      return res.status(400).json({ message: 'Missing image file or user ID' });
    }
  
    const imagePath = req.file.path;

    try {
        const user = await User.findById(userId);
        user.image=imagePath;
        await user.save();
        return res.status(200).json({ 'imagePath':imagePath,message: 'Image uploaded successfully.' });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload image' });
      }
  });
