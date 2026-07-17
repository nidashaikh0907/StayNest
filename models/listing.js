const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },

    description: {
        type: String,
        required: [true, "Description is required"],
    },

    image: {
        url: String,
        filename: String,
    },

    price: {
        type: Number,
        required: true,
    },

    location: {
        type: String,
        required: [true, "Location is required"],
    },

    country: {
        type: String,
        required: [true, "Country is required"],
    },

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [77.2090, 28.6139],
        },
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Iconic Cities",
            "Mountains",
            "Castles",
            "Arctic",
            "Camping",
            "farms",
            "Domes",
            "Boats",
        ],
        required: true,
    },
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;