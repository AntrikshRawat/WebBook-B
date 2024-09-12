/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://antrikshrawat2:antrikshrawat2@ar-cluster.eio7o.mongodb.net/WebBook?retryWrites=true&w=majority&appName=AR-CLUSTER";
const connectToMongo = async ()=>{
try{
await mongoose.connect(mongoURI);
console.log("connected successfully!");
}catch(error) {
          console.log(error);
 }
}

module.exports = connectToMongo;