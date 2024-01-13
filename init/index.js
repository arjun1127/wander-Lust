const mongoose =require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js")


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust")
}
main().then(()=>{
    console.log("connected to Mdb");
}).catch((err) => {
    console.log(err);
});
const initdb =async()=>{
   await listing.deleteMany({});//deleting the already exixting data from DB
   initData.data=initData.data.map((obj)=>({...obj,owner:"6599468029c366856f4b67ab"}))
   await listing.insertMany(initData.data);//accessing data key from data.js;
   console.log("data was initialized");
}
//map () creates a new array and makes changes 
initdb();