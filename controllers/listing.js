const Listing = require("../models/listing");
const mongoose = require('mongoose');
const axios = require("axios");

module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
        ];
    }
    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        selectedCategory: category,
        search,
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing,   mapToken: process.env.MAP_TOKEN,});
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    // Create address for geocoding
    const place = `${newListing.location}, ${newListing.country}`;

    // Get coordinates from MapTiler
    const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(place)}.json`,
        {
            params: {
                key: process.env.MAP_TOKEN,
            },
        }
    );
    console.log(response.data.features[0]);
    console.log(response.data.features[0].center);
    if (response.data.features.length > 0) {
        newListing.geometry = {
            type: "Point",
            coordinates: response.data.features[0].center,
        };
    }
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }
    let originalImg = listing.image.url;
    originalImg = originalImg.replace("/upload/h_300");
    res.render("listings/edit.ejs", { listing, originalImg });
};

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        url = req.file.path;
        filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    return res.redirect("/listings");
};