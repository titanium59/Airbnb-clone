const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const User = require('./models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const jwtSecret = "asfhasjkfhlkjahdfuoiwemintipopu"

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

mongoose.connect('mongodb://localhost:27017/airbnbdb');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection eroor: "));
db.once("open", () => {
    console.log("database connected")
})

app.get('/test', (req, res) => {
    res.send("Hello")
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    try {
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.json(newUser);
    } catch (e) {
        res.status(422).json(e);
    }
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (userData) {
        const result = await bcrypt.compare(password, userData.password);
        if (result) {
            jwt.sign({ email: userData.email, id: userData._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userData);
            });
        }
        else {
            res.status(422).json('pass not ok')
        }
    }
    else {
        res.status(404).json("not present");
    }

})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id)
            res.json({ name, email, _id });
        })
    }
    else {
        res.json(null);
    }
})

app.listen(4000);