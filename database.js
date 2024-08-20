/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/webook";

const connetToMongo = async ()=>{
          await mongoose.connect(mongoURI);
          console.log("connected successfully!");
}

module.exports = connetToMongo;