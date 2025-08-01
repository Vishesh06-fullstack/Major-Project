const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(() => {
    console.log("Connection succesfull");
})
.catch((err) => {
    console.log("connetion fail " +err);
})
async function main(){
    await mongoose.connect(MONGO_URL); 
}

// clean previous data
const initDB = async () => {
    await Listing.deleteMany({})
   initData.data =  initData.data .map((obj) => ({...obj, owner : '687f2529129764648bf3e8f4'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();
