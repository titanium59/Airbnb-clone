const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number
})

module.exports = mongoose.model('Place', placeSchema); 