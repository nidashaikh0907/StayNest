const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mongourl = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => { console.log("connected to database"); })
    .catch((err) => { console.log("error connecting to database", err); });

async function main() {
    await mongoose.connect(mongourl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6a4bc99033d7baabffce58e8" }));
    await Listing.insertMany(initdata.data);
    console.log("data was inserted successfully");
};

initDB();