const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/booking.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


const jwtSecret = "asfhasjkfhlkjahdfuoiwemintipopu";

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

function getUserDataFromToken(req) {

    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData)
        });
    })


}

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

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;

    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName)
})


const photosMiddleware = multer({ dest: 'uploads/' });

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {

    const uploadedFiles = []
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1]
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
    const { token } = req.cookies;

    const { title, address, addedPhotos, description,
        perks, extraInfo, checkInTime, checkOutTime, guests, price } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const newPlace = new Place({
            owner: userData.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn: checkInTime,
            checkOut: checkOutTime,
            maxGuests: guests,
            price
        })
        await newPlace.save();
        res.json(newPlace);
    })
})

app.get('/places', async (req, res) => {
    res.json(await Place.find());
})

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const { id } = userData;
        const placeData = await Place.find({ owner: id });
        res.json(placeData);

    })
})

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    const currPlace = await Place.findById(id);
    res.json(currPlace);
})

app.put('/places', async (req, res) => {

    const { token } = req.cookies;

    const { id, title, address, addedPhotos, description,
        perks, extraInfo, checkInTime, checkOutTime, guests, price } = req.body;

    console.log(id);

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const oldPlace = await Place.findById(id);
        if (userData.id === oldPlace.owner.toString()) {

            await Place.findByIdAndUpdate(id, {
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn: checkInTime,
                checkOut: checkOutTime,
                maxGuests: guests,
                price
            });
            res.json("successful");

        }
    })

})

app.post('/bookings', async (req, res) => {

    const userData = await getUserDataFromToken(req);

    const { place, checkIn, checkOut,
        numberOfGuests, name, mobile
    } = req.body;
    const newBooking = new Booking({
        place,
        user: userData.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        numberOfGuests,
        name,
        mobile
    })
    newBooking.save();
    res.json(newBooking);
})

app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromToken(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));

})

app.listen(4000);