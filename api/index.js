const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const User = require('./models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))


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

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
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

console.log(__dirname);

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;

    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName)
})

app.listen(4000);