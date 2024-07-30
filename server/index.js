require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userSchema = require('./models/user_model'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xssSanitize = require('xss-clean');
const rateLimit = require('express-rate-limit');

let forgetLimiter = rateLimit({
    max:10,
    windowMs: 60*60*1000,
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: "you have reached your limit, Please try after an hour."
        });
    }});

let limiter = rateLimit({
    max:150,
    windowMs: 60*60*1000,
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: "Too many requests from this IP, please try again later."
        });
    }});


// Middlewares
app.use(cors({
    origin: 'https://authentication-deploy-client.vercel.app', // Replace with your client URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'] // Adjust headers as needed
}));
// app.use(cors()); // Used for cross-origin requests [frontend and backend]
app.use(express.json({limit:'40kb'})); // Middleware for JSON 
app.use(helmet()); //Adding Security Headers
app.use(sanitize()); //Sanitize NoSQL injection Attacks
app.use(xssSanitize()); //Sanitize XSS injection Attacks


app.use('/forgetpassword',forgetLimiter);
app.use('/',limiter);

// DB
mongoose.connect(process.env.MONGODB_URL, {
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });


  app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already registered' });
        }

        const newPass = await bcrypt.hash(password, 10);
        await userSchema.create({
            name,
            email,
            password: newPass,
        });

        res.status(201).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


app.post('/login', async (req, res) => {
    const user = await userSchema.findOne({
        email: req.body.email,
    });

    if (!user) {
        return res.json({
            status: 'error',
            message: 'Invalid login'
        });
    }

    const isPassValid = await bcrypt.compare(req.body.password, user.password);

    if (isPassValid) {
        const token = jwt.sign({
            name: user.name,
            email: user.email,
        }, `${process.env.JWT_SECRET}`);
        return res.json({ status: 'success', user: token });
    } else {
        return res.json({ status: 'error', message: 'Invalid login' });
    }
});


app.get('/dashboard', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // token is sent as "Bearer token"

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        const user = await userSchema.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.json({ status: 'success', name: user.name });
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
});


app.post('/forgetpassword', async (req, res) => {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Generate a reset token
    const token = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 

    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASS}`
        },
    });

    const message = {
        from: `Secure Auth Community <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request',
        text: `Password Reset Code: ${token}`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            return res.status(500).json({ message: "Something went wrong, try again" });
        }
        res.status(200).json({ message: 'Validation code sent to your email' });
    });
});


app.get('/verify-token/:token', async (req, res) => {
    const { token } = req.params;
    const user = await userSchema.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(404).json({ message: 'Invalid or expired token' });
    }

    res.status(200).json({ message: 'Token is valid' });
});


app.post('/forgetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userSchema.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(404).json({ message: 'Invalid or expired token' });
    }

    const newPass = await bcrypt.hash(password, 10);
    user.password = newPass;
    user.resetPasswordExpires = null;
    user.resetPasswordToken = null;

    await user.save();

    res.json({ message: "Password reset successful" });
});


// Verify the reset code
app.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await userSchema.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        res.status(200).json({ message: 'Reset code is valid' });
    } catch (error) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});



app.use((req, res) => {
    res.status(404).send('404 Page Not Found');
  });


app.listen(process.env.PORT_NO, () => {
    console.log(`Server started on ${process.env.PORT_NO}`);
});
